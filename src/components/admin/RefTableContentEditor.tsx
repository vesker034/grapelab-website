"use client";

import { useState, useEffect } from "react";
import JsonbEditor from "./JsonbEditor";
import { fieldConfigs, type FieldConfigName } from "@/schemas";

interface Props {
  name?: string;
  value?: unknown;
  onChange?: (e: { target: { value: string } }) => void;
  disabled?: boolean;
  readonly?: boolean;
  [key: string]: unknown;
}

export default function RefTableContentEditor(props: Props) {
  const [refName, setRefName] = useState<string>("");

  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;

    const nameInput = form.querySelector<HTMLInputElement>("input[name='name']");
    if (!nameInput) return;

    setRefName(nameInput.value);

    const handler = () => setRefName(nameInput.value);
    nameInput.addEventListener("input", handler);
    return () => nameInput.removeEventListener("input", handler);
  }, []);

  const config = refName ? fieldConfigs[refName as FieldConfigName] : undefined;

  return (
    <JsonbEditor
      {...props}
      schema={config?.schema}
      templateValue={config?.template}
    />
  );
}
