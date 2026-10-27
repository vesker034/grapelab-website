import type { ChangeEvent } from "react";

/** Уведомляет next-admin об изменении значения без синтетических DOM-событий. */
export function emitNextAdminChange(
  onChange: ((evt: ChangeEvent<HTMLInputElement>) => void) | undefined,
  value: string,
) {
  if (!onChange) return;
  onChange({ target: { value } } as ChangeEvent<HTMLInputElement>);
}
