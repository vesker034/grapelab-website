"use client";

import { useEffect, useState } from "react";
import RefTableContentEditor from "./RefTableContentEditor";

interface Props {
  name?: string;
  value?: unknown;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  readonly?: boolean;
  [key: string]: unknown;
}

export default function ContentFieldRouter(props: Props) {
  const [model, setModel] = useState<string | null>(null);

  useEffect(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const adminIdx = parts.indexOf("admin");
    setModel(parts[adminIdx + 1]?.toLowerCase() ?? null);
  }, []);

  // Пока не определили модель — ничего не рендерим
  if (model === null) return null;

  // Только для RefTable — JSON-редактор
  if (model === "reftable") {
    return <RefTableContentEditor {...props} />;
  }

  // Для всех остальных (BlogPost и др.) — стандартный textarea
  const strValue = typeof props.value === "string" ? props.value : String(props.value ?? "");
  return (
    <textarea
      name={props.name}
      value={strValue}
      onChange={(e) => props.onChange?.({ target: { value: e.target.value } })}
      disabled={props.disabled}
      readOnly={props.readonly}
      rows={16}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 6,
        border: "1px solid #555",
        fontSize: 14,
        background: "#2a2a3a",
        color: "#e0e0e0",
        resize: "vertical",
        fontFamily: "inherit",
        lineHeight: 1.6,
      }}
    />
  );
}