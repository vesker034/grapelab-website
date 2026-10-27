"use client";

import { useState, useEffect, useCallback, useRef, type ChangeEvent } from "react";
import { fallbackLocale, SupportedLocaleLang } from "@/config";
import {
  localizationConfig,
  slugify,
  supportedLocales,
  type ModelLocalizationConfig,
} from "@/lib/admin/localizationConfig";
import { emitNextAdminChange } from "./nextAdminInputChange";

type Locale = SupportedLocaleLang;

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", ru: "RU", ar: "AR" };
const fallbackLocaleLabel =
  LOCALE_LABELS[fallbackLocale] || fallbackLocale.toUpperCase();

function detectModelConfig(): ModelLocalizationConfig | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  const adminIdx = parts.indexOf("admin");
  if (adminIdx < 0) return null;
  const modelSegment = parts[adminIdx + 1];
  if (!modelSegment) return null;

  if (localizationConfig[modelSegment]) return localizationConfig[modelSegment];

  const lower = modelSegment.toLowerCase();
  for (const [key, config] of Object.entries(localizationConfig)) {
    if (key.toLowerCase() === lower) return config;
  }
  return null;
}

function isEditPage(): boolean {
  if (typeof window === "undefined") return false;
  const parts = window.location.pathname.split("/").filter(Boolean);
  const adminIdx = parts.indexOf("admin");
  if (adminIdx < 0) return false;
  const idSegment = parts[adminIdx + 2];
  return !!idSegment && idSegment !== "new";
}

type TranslationsMap = Record<string, Record<string, string>>;

interface CustomInputProps {
  name?: string;
  value?: string;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  disabled?: boolean;
  boundFieldName?: string;
  modelNameOverride?: string;
  item?: Record<string, unknown>;
  [key: string]: unknown;
}

export default function LocalizedFieldsInput({
  name,
  value,
  onChange,
  readonly,
  disabled,
  boundFieldName,
  modelNameOverride,
  item,
}: CustomInputProps) {
  const targetFieldName =
    typeof boundFieldName === "string" && boundFieldName.trim().length > 0
      ? boundFieldName
      : typeof name === "string" && name.trim().length > 0
        ? name
        : "rawName";
  const itemRawName =
    item && typeof item[targetFieldName] === "string"
      ? String(item[targetFieldName])
      : "";
  const fieldValue = typeof value === "string" ? value : "";
  const initialRawName =
    targetFieldName === name ? fieldValue : (fieldValue || itemRawName);

  const [isExistingRecord, setIsExistingRecord] = useState(false);
  const [config, setConfig] = useState<ModelLocalizationConfig | null>(null);
  const [configChecked, setConfigChecked] = useState(false);
  const [rawNameValue, setRawNameValue] = useState(initialRawName);
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [activeLocales, setActiveLocales] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);
  const generatedSlugRef = useRef(initialRawName);
  const pendingNativeSubmitRef = useRef(false);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const validationInputRef = useRef<HTMLInputElement | null>(null);

  const setFormError = useCallback((message: string | null) => {
    setError(message);
    if (validationInputRef.current) {
      validationInputRef.current.setCustomValidity(message ?? "");
    }
  }, []);

  const triggerChange = useCallback(
    (newValue: string) => {
      emitNextAdminChange(onChange, newValue);
    },
    [onChange]
  );

  useEffect(() => {
    const detected = modelNameOverride
      ? localizationConfig[modelNameOverride] ?? null
      : detectModelConfig();
    setConfig(detected);
    setConfigChecked(true);
    setIsExistingRecord(isEditPage());
  }, [modelNameOverride]);

  useEffect(() => {
    setRawNameValue(initialRawName);
    generatedSlugRef.current = initialRawName;
  }, [initialRawName]);

  useEffect(() => {
    if (!config || initRef.current) return;
    initRef.current = true;

    const initial: TranslationsMap = {};
    const initialLocales: Record<string, string> = {};
    for (const field of config.fields) {
      initial[field.key] = {};
      for (const loc of supportedLocales) {
        initial[field.key][loc] = "";
      }
      initialLocales[field.key] = fallbackLocale;
    }
    setTranslations(initial);
    setActiveLocales(initialLocales);

    if (isExistingRecord && initialRawName) {
      generatedSlugRef.current = initialRawName;
      const sections = config.fields.map((f) => f.section).join(",");
      fetch(`/api/admin/localizations?rawName=${encodeURIComponent(initialRawName)}&sections=${sections}`)
        .then((res) => res.json())
        .then((data: Array<{ section: string; localeCode: string; content: string }>) => {
          const updated: TranslationsMap = {};
          for (const field of config.fields) {
            updated[field.key] = {};
            for (const loc of supportedLocales) {
              updated[field.key][loc] = "";
            }
          }
          for (const row of data) {
            const field = config.fields.find((f) => f.section === row.section);
            if (field) {
              updated[field.key][row.localeCode] = row.content;
            }
          }
          setTranslations(updated);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    } else {
      setLoaded(true);
    }
  }, [config, initialRawName, isExistingRecord]);

  const handleFieldChange = useCallback(
    (fieldKey: string, locale: string, content: string) => {
      setTranslations((prev) => ({
        ...prev,
        [fieldKey]: { ...prev[fieldKey], [locale]: content },
      }));

      if (!config?.rawNameRequired && !isExistingRecord && fieldKey === "name" && locale === fallbackLocale) {
        const slug = slugify(content);
        setRawNameValue(slug);
        generatedSlugRef.current = slug;
        triggerChange(slug);
      }
    },
    [config, isExistingRecord, triggerChange]
  );

  const handleRawNameInput = useCallback(
    (inputValue: string) => {
      const sanitized = inputValue.replace(/[^a-zA-Z0-9_.\-]/g, "");
      setRawNameValue(sanitized);
      generatedSlugRef.current = sanitized;
      triggerChange(sanitized);
    },
    [triggerChange]
  );

  const handleLocaleSwitch = useCallback((fieldKey: string, locale: string) => {
    setActiveLocales((prev) => ({ ...prev, [fieldKey]: locale }));
  }, []);

  const saveLocalizations = useCallback(async (): Promise<"ok" | "validation-failed" | "api-failed"> => {
    if (!config) return "ok";

    const rawNameToUse = (rawNameValue || generatedSlugRef.current).trim();

    if (!rawNameToUse) {
      const label = config.rawNameRequired
        ? (config.rawNameLabel || "Системный ключ")
        : `${fallbackLocaleLabel} для генерации ключа`;
      setFormError(`Необходимо заполнить ${label}`);
      return "validation-failed";
    }

    for (const field of config.fields) {
      if (field.requiredInFallbackLocale === false) {
        continue;
      }

      const fallbackContent = translations[field.key]?.[fallbackLocale]?.trim() || "";
      if (!fallbackContent) {
        setFormError(`Необходимо заполнить ${fallbackLocaleLabel} для поля "${field.label}"`);
        return "validation-failed";
      }
    }

    setFormError(null);

    try {
      const fields = config.fields.map((field) => ({
        section: field.section,
        translations: translations[field.key] || {},
        requiredInFallbackLocale: field.requiredInFallbackLocale !== false,
      }));

      const res = await fetch("/api/admin/localizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawName: rawNameToUse, fields }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage =
          errorData && typeof errorData.error === "string"
            ? errorData.error
            : "Ошибка сохранения локализаций";
        throw new Error(errorMessage);
      }
      return "ok";
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Ошибка сохранения");
      return "api-failed";
    }
  }, [config, rawNameValue, setFormError, translations]);

  useEffect(() => {
    if (!config || !loaded) return;

    const form = hiddenInputRef.current?.form;
    if (!form) return;

    const handler = (event: Event) => {
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      if (pendingNativeSubmitRef.current) {
        pendingNativeSubmitRef.current = false;
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (typeof (event as Event).stopImmediatePropagation === "function") {
        (event as Event).stopImmediatePropagation();
      }

      void (async () => {
        const saveResult = await saveLocalizations();
        if (saveResult === "validation-failed") {
          validationInputRef.current?.reportValidity();
          return;
        }

        pendingNativeSubmitRef.current = true;

        if (
          "submitter" in event &&
          event.submitter instanceof HTMLElement &&
          typeof form.requestSubmit === "function"
        ) {
          form.requestSubmit(event.submitter);
          return;
        }

        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
          return;
        }

        form.submit();
      })();
    };

    form.addEventListener("submit", handler, true);
    return () => form.removeEventListener("submit", handler, true);
  }, [config, loaded, saveLocalizations]);

  if (!configChecked) {
    return (
      <div style={{ padding: "12px 0", color: "#666", fontSize: 14 }}>
        <input ref={hiddenInputRef} type="hidden" name={targetFieldName} value={rawNameValue} readOnly />
        Инициализация...
      </div>
    );
  }

  if (!config) {
    return (
      <div>
        <input ref={hiddenInputRef} type="hidden" name={targetFieldName} value={rawNameValue} readOnly />
        <input
          type="text"
          value={rawNameValue}
          onChange={(e) => triggerChange(e.target.value)}
          readOnly={readonly || disabled}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #555",
            fontSize: 14,
            background: "#2a2a3a",
            color: "#e0e0e0",
          }}
        />
        <div style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>
          Локализация не настроена для этой модели
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ padding: "12px 0", color: "#666", fontSize: 14 }}>
        <input ref={hiddenInputRef} type="hidden" name={targetFieldName} value={rawNameValue} readOnly />
        Загрузка локализаций...
      </div>
    );
  }

  const isReadonly = readonly || disabled;
  const rawNameLabel = config.rawNameLabel || "Системный ключ";
  const currentRawNameValue = rawNameValue || generatedSlugRef.current;
  const canEditRequiredRawName = config.rawNameRequired && (!isExistingRecord || !rawNameValue.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input ref={hiddenInputRef} type="hidden" name={targetFieldName} value={currentRawNameValue} readOnly />
      <input
        ref={validationInputRef}
        type="text"
        value={error ?? ""}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {config.rawNameRequired ? (
        <div>
          <label style={{ fontSize: 13, color: "#aaa", display: "block", marginBottom: 4 }}>
            {rawNameLabel} (ключ локализации)
          </label>
          {!canEditRequiredRawName ? (
            <div style={{ fontSize: 12, color: "#999" }}>
              <code style={{ background: "#2a2a3a", padding: "2px 6px", borderRadius: 4, color: "#ccc" }}>
                {currentRawNameValue}
              </code>
            </div>
          ) : (
            <input
              type="text"
              value={currentRawNameValue}
              onChange={(e) => handleRawNameInput(e.target.value)}
              readOnly={isReadonly}
              disabled={isReadonly}
              placeholder={`Введите ${rawNameLabel.toLowerCase()}`}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${!currentRawNameValue.trim() ? "#e53e3e" : "#555"}`,
                fontSize: 14,
                background: isReadonly ? "#1a1a2e" : "#2a2a3a",
                color: "#e0e0e0",
              }}
            />
          )}
        </div>
      ) : (
        <>
          {isExistingRecord && (
            <div style={{ fontSize: 12, color: "#999", marginBottom: -8 }}>
              Системный ключ: <code style={{ background: "#2a2a3a", padding: "2px 6px", borderRadius: 4, color: "#ccc" }}>{currentRawNameValue}</code>
            </div>
          )}

          {!isExistingRecord && currentRawNameValue && (
            <div style={{ fontSize: 12, color: "#77C3DD", marginBottom: -8 }}>
              Сгенерированный ключ: <code style={{ background: "#2a2a3a", padding: "2px 6px", borderRadius: 4, color: "#77C3DD" }}>{currentRawNameValue}</code>
            </div>
          )}
        </>
      )}

      {config.fields.map((field) => {
        const activeLoc = (activeLocales[field.key] || fallbackLocale) as Locale;
        const currentContent = translations[field.key]?.[activeLoc] || "";
        const isFallbackRequired = field.requiredInFallbackLocale !== false;

        return (
          <div key={field.key}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#aaa" }}>{field.label}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {supportedLocales.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocaleSwitch(field.key, loc)}
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: activeLoc === loc ? 700 : 400,
                      background: activeLoc === loc ? "#58427C" : "#2a2a3a",
                      color: activeLoc === loc ? "#fff" : "#999",
                      border: "1px solid #555",
                      cursor: "pointer",
                    }}
                  >
                    {LOCALE_LABELS[loc as Locale] || loc}
                  </button>
                ))}
              </div>
            </div>

            {field.multiline ? (
              <textarea
                value={currentContent}
                onChange={(e) => handleFieldChange(field.key, activeLoc, e.target.value)}
                readOnly={isReadonly}
                disabled={isReadonly}
                rows={3}
                placeholder={`${field.label} (${LOCALE_LABELS[activeLoc]})`}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${activeLoc === fallbackLocale && isFallbackRequired && !currentContent.trim() ? "#e53e3e" : "#555"}`,
                  fontSize: 14,
                  fontFamily: "inherit",
                  resize: "vertical",
                  background: isReadonly ? "#1a1a2e" : "#2a2a3a",
                  color: "#e0e0e0",
                }}
              />
            ) : (
              <input
                type="text"
                value={currentContent}
                onChange={(e) => handleFieldChange(field.key, activeLoc, e.target.value)}
                readOnly={isReadonly}
                disabled={isReadonly}
                placeholder={`${field.label} (${LOCALE_LABELS[activeLoc]})`}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: `1px solid ${activeLoc === fallbackLocale && isFallbackRequired && !currentContent.trim() ? "#e53e3e" : "#555"}`,
                  fontSize: 14,
                  background: isReadonly ? "#1a1a2e" : "#2a2a3a",
                  color: "#e0e0e0",
                }}
              />
            )}
          </div>
        );
      })}

      {error && (
        <div style={{ color: "#e53e3e", fontSize: 13, fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  );
}



