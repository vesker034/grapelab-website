"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CIRCLE_PX = 248;
const OUTPUT_PX = 320;

interface ReviewImageCropProps {
  file: File;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
}

export default function ReviewImageCrop({ file, onCrop, onCancel }: ReviewImageCropProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [natSize, setNatSize] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [fillScale, setFillScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);
  // ref keeps scale current for handleScaleChange without stale closure
  const scaleRef = useRef(1);
  scaleRef.current = scale;

  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNatSize({ w, h });
    const fs = CIRCLE_PX / Math.min(w, h);
    setFillScale(fs);
    setScale(fs);
    scaleRef.current = fs;
    setOffset({ x: 0, y: 0 });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  }, [offset]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    });
  }, []);

  const stopDrag = useCallback(() => { dragging.current = false; }, []);

  // When scale changes, adjust offset proportionally so the circle center
  // stays locked to the same source pixel (zoom from circle center, not image center).
  const handleScaleChange = useCallback((newScale: number) => {
    const ratio = newScale / scaleRef.current;
    setOffset(prev => ({ x: prev.x * ratio, y: prev.y * ratio }));
    setScale(newScale);
  }, []);

  const handleApply = useCallback(() => {
    const img = imgRef.current;
    if (!img || natSize.w === 0) return;

    // bgX/bgY: top-left of the image in the circle coordinate space
    const bgX = CIRCLE_PX / 2 + offset.x - natSize.w * scale / 2;
    const bgY = CIRCLE_PX / 2 + offset.y - natSize.h * scale / 2;
    // Source rect in natural image pixels that maps to the CIRCLE_PX×CIRCLE_PX area
    const srcX = -bgX / scale;
    const srcY = -bgY / scale;
    const srcW = CIRCLE_PX / scale;
    const srcH = CIRCLE_PX / scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_PX;
    canvas.height = OUTPUT_PX;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(OUTPUT_PX / 2, OUTPUT_PX / 2, OUTPUT_PX / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_PX, OUTPUT_PX);
    canvas.toBlob(blob => { if (blob) onCrop(blob); }, "image/jpeg", 0.93);
  }, [natSize, scale, offset, onCrop]);

  // Background-image approach: no CSS transform arithmetic, browser handles it correctly
  const bgX = CIRCLE_PX / 2 + offset.x - natSize.w * scale / 2;
  const bgY = CIRCLE_PX / 2 + offset.y - natSize.h * scale / 2;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      {/* Hidden img — only used as source for canvas drawImage */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={imgSrc} onLoad={onImgLoad} alt="" style={{ display: "none" }} />

      <div style={{
        background: "#18182b", borderRadius: 18, padding: "28px 32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)", width: 340,
      }}>
        <p style={{ color: "#E0E0E0", margin: 0, fontSize: 15, fontWeight: 600 }}>
          Выберите область фото
        </p>

        {/* Circle preview via background-image — avoids all CSS transform ambiguity */}
        <div
          style={{
            width: CIRCLE_PX,
            height: CIRCLE_PX,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "2px solid #58427C",
            cursor: "grab",
            backgroundColor: "#0d0d1a",
            backgroundImage: imgSrc ? `url(${imgSrc})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: `${natSize.w * scale}px ${natSize.h * scale}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        />

        <p style={{ color: "#666", fontSize: 12, margin: "-8px 0 0", textAlign: "center" }}>
          Перетащите для выбора области
        </p>

        {/* Zoom slider — min=fillScale so image always fills the circle */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, color: "#888" }}>−</span>
          <input
            type="range"
            min={fillScale}
            max={fillScale * 3}
            step={fillScale / 100}
            value={scale}
            onChange={e => handleScaleChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#58427C" }}
          />
          <span style={{ fontSize: 14, color: "#888" }}>+</span>
        </div>

        <div style={{ display: "flex", gap: 12, width: "100%" }}>
          <button type="button" onClick={onCancel} style={{
            flex: 1, padding: "10px 0", background: "transparent",
            color: "#888", border: "1px solid #444", borderRadius: 8,
            cursor: "pointer", fontSize: 14,
          }}>Отмена</button>
          <button type="button" onClick={handleApply} style={{
            flex: 1, padding: "10px 0", background: "#58427C",
            color: "#fff", border: "none", borderRadius: 8,
            cursor: "pointer", fontSize: 14, fontWeight: 600,
          }}>Применить</button>
        </div>
      </div>
    </div>
  );
}
