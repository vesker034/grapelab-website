"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TechStackItem {
  alt: string;
  image_url: string;
}

interface Props {
  name?: string;
  value?: unknown;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  readonly?: boolean;
  [key: string]: unknown;
}

function emptyItem(): TechStackItem {
  return { alt: "", image_url: "" };
}

function parseItems(raw: unknown): TechStackItem[] {
  if (!raw && raw !== 0) {
    return [];
  }

  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => {
      if (typeof item === "string") {
        return {
          alt: item,
          image_url: `/icons/${item.toLowerCase().replace(/\s+/g, "-")}.png`,
        };
      }

      if (!item || typeof item !== "object") {
        return emptyItem();
      }

      const record = item as Record<string, unknown>;
      return {
        alt: typeof record.alt === "string" ? record.alt : "",
        image_url: typeof record.image_url === "string" ? record.image_url : "",
      };
    });
  } catch {
    return [];
  }
}

export default function TechStackEditor({
  name,
  value,
  onChange,
  disabled,
  readonly,
}: Props) {
  const isReadOnly = !!(disabled || readonly);
  const onChangeRef = useRef(onChange);
  const [items, setItems] = useState<TechStackItem[]>(() => parseItems(value));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setItems(parseItems(value));
  }, [value]);

  const emitChange = useCallback((nextItems: TechStackItem[]) => {
    onChangeRef.current?.({
      target: {
        value: JSON.stringify(nextItems),
      },
    });
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof TechStackItem, fieldValue: string) => {
      setItems((prev) => {
        const next = prev.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: fieldValue } : item,
        );
        emitChange(next);
        return next;
      });
    },
    [emitChange],
  );

  const addItem = useCallback(() => {
    setItems((prev) => {
      const next = [...prev, emptyItem()];
      emitChange(next);
      return next;
    });
  }, [emitChange]);

  const removeItem = useCallback(
    (index: number) => {
      setItems((prev) => {
        const next = prev.filter((_, itemIndex) => itemIndex !== index);
        emitChange(next);
        return next;
      });
    },
    [emitChange],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="hidden" name={name} value={JSON.stringify(items)} readOnly />

      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "#999" }}>
          Технологии не добавлены
        </div>
      ) : (
        items.map((item, index) => (
          <div
            key={`${index}-${item.image_url}`}
            style={{
              display: "grid",
              gap: 10,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #555",
              background: "#2a2a3a",
            }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#aaa" }}>Название (alt)</span>
              <input
                type="text"
                value={item.alt}
                onChange={(event) => updateItem(index, "alt", event.target.value)}
                readOnly={isReadOnly}
                disabled={isReadOnly}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #555",
                  fontSize: 14,
                  background: isReadOnly ? "#1a1a2e" : "#1f1f31",
                  color: "#e0e0e0",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#aaa" }}>Путь к иконке (image_url)</span>
              <input
                type="text"
                value={item.image_url}
                onChange={(event) => updateItem(index, "image_url", event.target.value)}
                readOnly={isReadOnly}
                disabled={isReadOnly}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #555",
                  fontSize: 14,
                  background: isReadOnly ? "#1a1a2e" : "#1f1f31",
                  color: "#e0e0e0",
                }}
              />
            </label>

            {!isReadOnly ? (
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{
                  width: "fit-content",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #e53e3e",
                  background: "transparent",
                  color: "#e53e3e",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Удалить
              </button>
            ) : null}
          </div>
        ))
      )}

      {!isReadOnly ? (
        <button
          type="button"
          onClick={addItem}
          style={{
            width: "fit-content",
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            background: "#58427C",
            color: "#fff",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Добавить технологию
        </button>
      ) : null}
    </div>
  );
}
