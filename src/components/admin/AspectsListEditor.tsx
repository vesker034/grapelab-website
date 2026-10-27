"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { locales, SupportedLocaleLang } from "@/config";

type Locale = SupportedLocaleLang;

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ru: "RU", ar: "AR" };

type LocalizedText = Record<Locale, string>;

interface AspectDraft {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
}

interface AspectJson {
  title: LocalizedText;
  description: LocalizedText;
}

interface Props {
  name?: string;
  value?: unknown;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  readonly?: boolean;
  [key: string]: unknown;
}

function emptyLocalized(): LocalizedText {
  return Object.fromEntries(locales.map((loc) => [loc, ""])) as LocalizedText;
}

function emptyAspect(): AspectDraft {
  return {
    id: `${Date.now()}-${Math.random()}`,
    title: emptyLocalized(),
    description: emptyLocalized(),
  };
}

function parseInitial(raw: unknown): AspectDraft[] {
  let arr: AspectJson[] = [];
  try {
    if (typeof raw === "string") arr = JSON.parse(raw);
    else if (Array.isArray(raw)) arr = raw as AspectJson[];
  } catch {
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) return [];

  return arr.map((item, i) => {
    const normalizeField = (val: unknown): LocalizedText => {
      if (typeof val === "object" && val !== null) {
        const v = val as Record<string, string>;
        return Object.fromEntries(locales.map((loc) => [loc, v[loc] ?? ""])) as LocalizedText;
      }
      const str = typeof val === "string" ? val : "";
      return Object.fromEntries(locales.map((loc, idx) => [loc, idx === 0 ? str : ""])) as LocalizedText;
    };

    return {
      id: `${i}-${Date.now()}`,
      title: normalizeField(item.title),
      description: normalizeField(item.description),
    };
  });
}

export default function AspectsListEditor({
  name,
  value,
  onChange,
  disabled,
  readonly,
}: Props) {
  const isReadOnly = !!(disabled || readonly);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const [aspects, setAspects] = useState<AspectDraft[]>(() => parseInitial(value));
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const parsed = parseInitial(value);
    if (parsed.length > 0) setAspects(parsed);
  }, [value]);

  const serialize = useCallback((drafts: AspectDraft[]): string => {
    const json: AspectJson[] = drafts.map((a) => ({
      title: { ...a.title },
      description: { ...a.description },
    }));
    return JSON.stringify(json);
  }, []);

  const emitChange = useCallback((drafts: AspectDraft[]) => {
    onChangeRef.current?.({ target: { value: serialize(drafts) } });
  }, [serialize]);

  const addAspect = useCallback(() => {
    setAspects((prev) => {
      const next = [...prev, emptyAspect()];
      emitChange(next);
      return next;
    });
  }, [emitChange]);

  const removeAspect = useCallback((id: string) => {
    setAspects((prev) => {
      const next = prev.filter((a) => a.id !== id);
      emitChange(next);
      return next;
    });
  }, [emitChange]);

  const updateField = useCallback((
    id: string,
    field: "title" | "description",
    locale: Locale,
    val: string
  ) => {
    setAspects((prev) => {
      const next = prev.map((a) =>
        a.id !== id ? a : { ...a, [field]: { ...a[field], [locale]: val } }
      );
      emitChange(next);
      return next;
    });
  }, [emitChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="hidden" name={name} value={serialize(aspects)} readOnly />

      {aspects.length === 0 && (
        <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
          Аспекты не добавлены. Нажмите кнопку ниже.
        </p>
      )}

      {aspects.map((aspect, index) => (
        <div
          key={aspect.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>
              Аспект #{index + 1}
            </span>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => removeAspect(aspect.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                  fontSize: 18,
                  lineHeight: 1,
                  padding: "2px 4px",
                  borderRadius: 4,
                }}
                title="Удалить аспект"
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
            <LocalizedField
              label="Заголовок"
              values={aspect.title}
              onChange={(loc, val) => updateField(aspect.id, "title", loc, val)}
              multiline={false}
              disabled={isReadOnly}
            />
            <LocalizedField
              label="Описание"
              values={aspect.description}
              onChange={(loc, val) => updateField(aspect.id, "description", loc, val)}
              multiline={true}
              disabled={isReadOnly}
            />
          </div>
        </div>
      ))}

      {!isReadOnly && (
        <button
          type="button"
          onClick={addAspect}
          style={{
            alignSelf: "flex-start",
            padding: "8px 16px",
            background: "#58427C",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          + Добавить аспект
        </button>
      )}
    </div>
  );
}

interface LocalizedFieldProps {
  label: string;
  values: LocalizedText;
  onChange: (locale: Locale, value: string) => void;
  multiline: boolean;
  disabled: boolean;
}

function LocaleRow({
  locale,
  label,
  value,
  onChange,
  multiline,
  disabled,
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (val: string) => void;
  multiline: boolean;
  disabled: boolean;
}) {
  const isRtl = locale === "ar";
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "6px 10px",
    fontSize: 13,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: disabled ? "#f9fafb" : "#fff",
    color: "#111827",
    direction: isRtl ? "rtl" : "ltr",
    resize: "vertical" as const,
    fontFamily: isRtl ? "inherit" : undefined,
  };

  return (
    <div style={{ display: "flex", alignItems: multiline ? "flex-start" : "center", gap: 8 }}>
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#6b7280",
        minWidth: 28,
        paddingTop: multiline ? 8 : 0,
        textAlign: "center",
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        padding: "2px 6px",
        alignSelf: multiline ? "flex-start" : "center",
        marginTop: multiline ? 4 : 0,
      }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={2}
          placeholder={`Описание на ${label}`}
          style={inputStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`Заголовок на ${label}`}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function LocalizedField({ label, values, onChange, multiline, disabled }: LocalizedFieldProps) {
  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {locales.map((loc) => (
          <LocaleRow
            key={loc}
            locale={loc}
            label={LOCALE_LABELS[loc]}
            value={values[loc]}
            onChange={(val) => onChange(loc, val)}
            multiline={multiline}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}