"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ChangeEvent } from "react";
import ReviewImageCrop from "./ReviewImageCrop";
import { emitNextAdminChange } from "./nextAdminInputChange";

function getScopeFromPathname(): string {
  if (typeof window === "undefined") return "general";
  const parts = window.location.pathname.split("/").filter(Boolean);
  const modelIndex = parts.indexOf("admin") + 1;
  const model = parts[modelIndex] || "general";

  const scopeMap: Record<string, string> = {
    review: "reviews",
    project: "projects",
    partner: "partners",
    devdirection: "devdirections",
    employee: "employees",
    blogpost: "blog",
    service: "services",
    servicefeature: "services",
  };
  return scopeMap[model.toLowerCase()] || "general";
}

interface CustomInputProps {
  name?: string;
  value?: string;
  // next-admin передаёт onChange как обработчик события input-элемента
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  [key: string]: unknown;
}

export default function ImageUploadInput({
  name,
  value,
  onChange,
  readonly,
  disabled,
}: CustomInputProps) {
  const currentValue = typeof value === "string" ? (!value.startsWith("/") ? "/" + value : value) : "";
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submittedValue = preview ?? currentValue;

  useEffect(() => {
    if (typeof value === "string" && value.trim().length > 0) {
      const normalized = value.startsWith("/") ? value : `/${value}`;
      setPreview(normalized);
      return;
    }

    if (!value) {
      setPreview(null);
    }
  }, [value]);

  const triggerChange = useCallback(
    (newValue: string) => {
      emitNextAdminChange(onChange, newValue);
    },
    [onChange]
  );

  const uploadBlob = useCallback(
    async (blob: Blob, scope: string) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", blob, "avatar.jpg");
        formData.append("scope", scope);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }
        const { path } = await res.json();
        setPreview(path);
        triggerChange(path);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [triggerChange]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const scope = getScopeFromPathname();
      if (scope === "reviews" || scope === "employees") {
        setCropFile(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("scope", scope);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }
        const { path } = await res.json();
        setPreview(path);
        triggerChange(path);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [triggerChange]
  );

  const handleCropDone = useCallback(
    (blob: Blob) => {
      const scope = getScopeFromPathname();
      setCropFile(null);
      uploadBlob(blob, scope);
    },
    [uploadBlob]
  );

  const handleCropCancel = useCallback(() => {
    setCropFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClear = useCallback(() => {
    setPreview(null);
    triggerChange("");
  }, [triggerChange]);

  const isReadonly = readonly || disabled;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {cropFile && (
        <ReviewImageCrop
          file={cropFile}
          onCrop={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
      {/* Скрытый input — next-admin читает value через него при submit */}
      <input
        type="hidden"
        name={name}
        value={submittedValue}
        readOnly
      />

      {/* Превью */}
      {preview && (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "150px",
              objectFit: "contain",
              borderRadius: "8px",
              border: "1px solid #DADADA",
              display: "block",
            }}
            onError={() => setPreview(null)}
          />
          {!isReadonly && (
            <button
              type="button"
              onClick={handleClear}
              title="Удалить"
              style={{
                position: "absolute", top: "-8px", right: "-8px",
                width: "22px", height: "22px", borderRadius: "50%",
                background: "#e53e3e", color: "#fff", border: "none",
                cursor: "pointer", fontSize: "13px", lineHeight: "22px",
                textAlign: "center", padding: 0,
              }}
            >×</button>
          )}
        </div>
      )}

      {/* Текущий путь если нет превью */}
      {currentValue && !preview && (
        <span style={{ fontSize: "12px", color: "#666", wordBreak: "break-all" }}>
          {currentValue}
        </span>
      )}

      {/* Кнопки */}
      {!isReadonly && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: "6px 14px", background: "#58427C", color: "#fff",
              border: "none", borderRadius: "6px",
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: "13px", opacity: uploading ? 0.7 : 1,
            }}
          >
            {uploading ? "Загрузка..." : preview ? "Заменить" : "Загрузить изображение"}
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: "6px 14px", background: "transparent", color: "#e53e3e",
                border: "1px solid #e53e3e", borderRadius: "6px",
                cursor: "pointer", fontSize: "13px",
              }}
            >Очистить</button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      )}

      {error && (
        <span style={{ fontSize: "12px", color: "#e53e3e" }}>{error}</span>
      )}
    </div>
  );
}