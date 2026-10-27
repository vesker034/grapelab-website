const MAX_URL_PREFIX = "https://max.ru/";

export function resolveMaxUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  if (
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://")
  ) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("max.ru/")) {
    return `https://${normalizedValue}`;
  }

  return new URL(normalizedValue.replace(/^\/+/, ""), MAX_URL_PREFIX).toString();
}
