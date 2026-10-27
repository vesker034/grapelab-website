"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import type { SupportedLocaleLang } from "@/config";
// @ts-expect-error next-admin не экспортирует хук публично — нужен для dirty-field tracking
import { useFormState } from "../../../node_modules/@premieroctet/next-admin/dist/context/FormStateContext.mjs";
import { emitNextAdminChange } from "./nextAdminInputChange";

type BlogFieldKey = "title" | "excerpt" | "content";

type FieldConfig = {
  hiddenFieldName: string;
  multiline: boolean;
  rows: number;
};

type BlogLocalizationResponse = {
  rawName: string | null;
  translations: Record<BlogFieldKey, Record<SupportedLocaleLang, string>>;
  baseValues: Record<BlogFieldKey, string>;
};

interface CustomInputProps {
  name?: string;
  value?: string;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  readonly?: boolean;
  disabled?: boolean;
  item?: Record<string, unknown>;
  fieldKey?: BlogFieldKey;
  [key: string]: unknown;
}

const BLOG_EDITOR_LOCALES: SupportedLocaleLang[] = ["ru", "en", "ar"];
const SOURCE_LOCALE: SupportedLocaleLang = "ru";
const LOCALE_LABELS: Record<SupportedLocaleLang, string> = {
  en: "EN",
  ru: "RU",
  ar: "AR",
};

const FIELD_CONFIG: Record<BlogFieldKey, FieldConfig> = {
  title: {
    hiddenFieldName: "blogLocalization_title",
    multiline: false,
    rows: 1,
  },
  excerpt: {
    hiddenFieldName: "blogLocalization_excerpt",
    multiline: true,
    rows: 4,
  },
  content: {
    hiddenFieldName: "blogLocalization_content",
    multiline: true,
    rows: 12,
  },
};

const localizationRequestCache = new Map<number, Promise<BlogLocalizationResponse>>();

function createEmptyTranslations(initialValue = ""): Record<SupportedLocaleLang, string> {
  return {
    ru: initialValue,
    en: "",
    ar: "",
  };
}

function detectBlogPostId(item?: Record<string, unknown>): number | null {
  const itemId = Number(item?.id);
  if (Number.isInteger(itemId) && itemId > 0) {
    return itemId;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const parts = window.location.pathname.split("/").filter(Boolean);
  const adminIdx = parts.indexOf("admin");
  if (adminIdx < 0) {
    return null;
  }

  const maybeId = Number(parts[adminIdx + 2]);
  return Number.isInteger(maybeId) && maybeId > 0 ? maybeId : null;
}

function loadBlogLocalization(postId: number): Promise<BlogLocalizationResponse> {
  const cached = localizationRequestCache.get(postId);
  if (cached) {
    return cached;
  }

  const request = fetch(`/api/admin/blog-localization?blogPostId=${postId}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Не удалось загрузить переводы статьи");
      }
      return response.json() as Promise<BlogLocalizationResponse>;
    })
    .finally(() => {
      localizationRequestCache.delete(postId);
    });

  localizationRequestCache.set(postId, request);
  return request;
}

export default function BlogLocalizedFieldInput({
  name,
  value,
  onChange,
  readonly,
  disabled,
  item,
  fieldKey,
}: CustomInputProps) {
  const resolvedFieldKey = useMemo<BlogFieldKey>(() => {
    if (fieldKey) {
      return fieldKey;
    }
    if (name === "excerpt" || name === "content") {
      return name;
    }
    return "title";
  }, [fieldKey, name]);

  const config = FIELD_CONFIG[resolvedFieldKey];
  const initialBaseValue = typeof value === "string" ? value : "";
  const blogPostId = useMemo(() => detectBlogPostId(item), [item]);
  const isReadonly = readonly || disabled;
  const { setFieldDirty } = useFormState();
  const loadedPostIdRef = useRef<number | null>(null);

  const [activeLocale, setActiveLocale] = useState<SupportedLocaleLang>(SOURCE_LOCALE);
  const [translations, setTranslations] = useState<Record<SupportedLocaleLang, string>>(
    createEmptyTranslations(initialBaseValue),
  );
  const [loaded, setLoaded] = useState(blogPostId === null);
  const [error, setError] = useState<string | null>(null);

  const triggerChange = useCallback(
    (newValue: string) => {
      emitNextAdminChange(onChange, newValue);
    },
    [onChange],
  );

  useEffect(() => {
    if (blogPostId === null) {
      loadedPostIdRef.current = null;
      setLoaded(true);
      return;
    }

    if (loadedPostIdRef.current === blogPostId) {
      return;
    }

    let cancelled = false;
    setLoaded(false);
    setError(null);

    loadBlogLocalization(blogPostId)
      .then((payload) => {
        if (cancelled) {
          return;
        }

        const localizedFieldValues = payload.translations[resolvedFieldKey];
        const nextTranslations = createEmptyTranslations(
          payload.baseValues[resolvedFieldKey] || initialBaseValue,
        );

        for (const locale of BLOG_EDITOR_LOCALES) {
          const localizedValue = localizedFieldValues?.[locale];
          if (typeof localizedValue === "string") {
            nextTranslations[locale] = localizedValue;
          }
        }

        if (!nextTranslations[SOURCE_LOCALE].trim()) {
          nextTranslations[SOURCE_LOCALE] =
            payload.baseValues[resolvedFieldKey] || initialBaseValue;
        }

        setTranslations(nextTranslations);
        loadedPostIdRef.current = blogPostId;
        setLoaded(true);
      })
      .catch((loadError) => {
        if (cancelled) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить переводы");
        loadedPostIdRef.current = blogPostId;
        setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [blogPostId, initialBaseValue, resolvedFieldKey]);

  const handleChange = useCallback(
    (locale: SupportedLocaleLang, content: string) => {
      setTranslations((prev) => ({
        ...prev,
        [locale]: content,
      }));

      setFieldDirty(config.hiddenFieldName);

      if (locale === SOURCE_LOCALE) {
        triggerChange(content);
      }
    },
    [config.hiddenFieldName, setFieldDirty, triggerChange],
  );

  const serializedTranslations = JSON.stringify(translations);

  if (!loaded) {
    return (
      <div style={{ padding: "12px 0", color: "#666", fontSize: 14 }}>
        <input type="hidden" name={name} value={translations[SOURCE_LOCALE]} readOnly />
        <input type="hidden" name={config.hiddenFieldName} value={serializedTranslations} readOnly />
        Загрузка переводов...
      </div>
    );
  }

  const currentValue = translations[activeLocale] || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <input type="hidden" name={name} value={translations[SOURCE_LOCALE] || ""} readOnly />
      <input type="hidden" name={config.hiddenFieldName} value={serializedTranslations} readOnly />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {BLOG_EDITOR_LOCALES.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => setActiveLocale(locale)}
              style={{
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: activeLocale === locale ? 700 : 400,
                background: activeLocale === locale ? "#58427C" : "#2a2a3a",
                color: activeLocale === locale ? "#fff" : "#999",
                border: "1px solid #555",
                cursor: "pointer",
              }}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </div>

        <span style={{ fontSize: 11, color: activeLocale === SOURCE_LOCALE ? "#77C3DD" : "#888" }}>
          {activeLocale === SOURCE_LOCALE ? "Основной текст статьи" : "Перевод"}
        </span>
      </div>

      {config.multiline ? (
        <textarea
          value={currentValue}
          onChange={(event) => handleChange(activeLocale, event.target.value)}
          readOnly={isReadonly}
          disabled={isReadonly}
          rows={config.rows}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #555",
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
          value={currentValue}
          onChange={(event) => handleChange(activeLocale, event.target.value)}
          readOnly={isReadonly}
          disabled={isReadonly}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #555",
            fontSize: 14,
            background: isReadonly ? "#1a1a2e" : "#2a2a3a",
            color: "#e0e0e0",
          }}
        />
      )}

      {error && (
        <div style={{ color: "#e53e3e", fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
