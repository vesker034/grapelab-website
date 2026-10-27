"use client";

import Ajv from "ajv";
import { useEffect, useMemo, useRef, useState } from "react";
import { fieldConfigs, type FieldConfigName, type JSONSchema, type JSONTemplate } from "@/schemas";

interface Props {
  name?: string;
  value?: unknown;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  readonly?: boolean;
  schema?: JSONSchema;
  templateValue?: JSONTemplate;
  [key: string]: unknown;
}

type JsonEditorContent = { json?: unknown; text?: string };
type JsonEditorInstance = {
  updateProps: (props: {
    content: JsonEditorContent;
    readOnly: boolean;
    validator?: unknown;
  }) => void;
  destroy: () => void;
};
type CreateAjvValidator = typeof import("vanilla-jsoneditor")["createAjvValidator"];

function parseContent(raw: unknown, template?: unknown): JsonEditorContent {
  if (!raw && raw !== 0) {
    return template !== undefined ? { json: template } : { text: "" };
  }
  if (typeof raw === "string") {
    try {
      return { json: JSON.parse(raw) };
    } catch {
      return { text: raw };
    }
  }
  return { json: raw };
}

function toStr(raw: unknown): string {
  if (!raw && raw !== 0) return "";
  if (typeof raw === "string") return raw;
  return JSON.stringify(raw);
}

function validateJsonBySchema(value: unknown, schema?: JSONSchema): string | null {
  if (!schema) return null;
  if (value === null || value === undefined || String(value).trim() === "") {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return "Невалидный JSON";
  }

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  if (validate(parsed)) return null;

  if (!validate.errors || validate.errors.length === 0) {
    return "JSON не соответствует схеме";
  }

  return validate.errors
    .map((e) => `${e.instancePath || "(корень)"}: ${e.message}`)
    .join("; ");
}

export default function JsonbEditor({
  name,
  value,
  onChange,
  disabled,
  readonly,
  schema: schemaProp,
  templateValue: templateProp,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<JsonEditorInstance | null>(null);
  const onChangeRef = useRef(onChange);
  // Храним createAjvValidator в ref, чтобы переиспользовать в updateProps без реинициализации редактора.
  const createAjvValidatorRef = useRef<CreateAjvValidator | null>(null);
  // Ссылки на hidden input'ы для интеграции с нативной валидацией формы (и сохранением в NextAdmin).
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const validationInputRef = useRef<HTMLInputElement | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const autoConfig = name ? fieldConfigs[name as FieldConfigName] : undefined;
  const schema = schemaProp ?? autoConfig?.schema;
  const templateValue = templateProp ?? autoConfig?.template;

  const content = useMemo(
    () => parseContent(value, templateValue),
    [value, templateValue],
  );

  useEffect(() => {
    const sourceValue = content.json !== undefined ? content.json : content.text;
    setSchemaError(validateJsonBySchema(sourceValue, schema));
  }, [content, schema]);

  // Первичная инициализация JSON-редактора.
  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    import("vanilla-jsoneditor").then(({ createJSONEditor, createAjvValidator }) => {
      if (cancelled || !containerRef.current) return;

      createAjvValidatorRef.current = createAjvValidator;

      editorRef.current = createJSONEditor({
        target: containerRef.current,
        props: {
          content,
          readOnly: !!(disabled || readonly),
          navigationBar: true,
          statusBar: true,
          validator: schema
            ? createAjvValidator({ schema })
            : undefined,
          onChange: (updatedContent: JsonEditorContent) => {
            try {
              let val: string;
              if ("json" in updatedContent && updatedContent.json !== undefined) {
                val = JSON.stringify(updatedContent.json);
                setSchemaError(validateJsonBySchema(updatedContent.json, schema));
              } else if ("text" in updatedContent && updatedContent.text) {
                JSON.parse(updatedContent.text);
                val = updatedContent.text;
                setSchemaError(validateJsonBySchema(updatedContent.text, schema));
              } else {
                return;
              }
              onChangeRef.current?.({ target: { value: val } });
            } catch {
              setSchemaError("Невалидный JSON");
            }
          },
        },
      }) as JsonEditorInstance;
    });

    return () => {
      cancelled = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [content, disabled, readonly, schema]);

  // Обновление пропов редактора при изменении value / disabled / readonly / schema.
  useEffect(() => {
    if (!editorRef.current) return;
    const createAjvValidator = createAjvValidatorRef.current;
    editorRef.current.updateProps({
      content,
      readOnly: !!(disabled || readonly),
      validator:
        schema && createAjvValidator
          ? createAjvValidator({ schema })
          : undefined,
    });
  }, [content, disabled, readonly, schema]);

  // Пробрасываем текущую ошибку в нативную валидацию формы.
  useEffect(() => {
    if (!validationInputRef.current) return;
    validationInputRef.current.setCustomValidity(schemaError ?? "");
  }, [schemaError]);

  // Блокируем submit на уровне формы, если JSON/схема невалидны.
  useEffect(() => {
    const form = hiddenInputRef.current?.form;
    if (!form) return;

    const handleSubmit = (event: Event) => {
      if (!schemaError) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof (event as Event).stopImmediatePropagation === "function") {
        (event as Event).stopImmediatePropagation();
      }
      validationInputRef.current?.reportValidity();
    };

    form.addEventListener("submit", handleSubmit, true);
    return () => form.removeEventListener("submit", handleSubmit, true);
  }, [schemaError]);

  return (
    <div>
      <input ref={hiddenInputRef} type="hidden" name={name} value={toStr(value)} readOnly />
      <input
        ref={validationInputRef}
        type="text"
        value={schemaError ?? ""}
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
      <div ref={containerRef} style={{ minHeight: 300 }} />
      {schemaError && (
        <div style={{ marginTop: 8, color: "#dc2626", fontSize: 13 }}>
          {schemaError}
        </div>
      )}
    </div>
  );
}
