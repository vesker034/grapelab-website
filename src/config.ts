export const locales = ["en", "ru", "ar"] as const;
export type SupportedLocaleLang = (typeof locales)[number];
export const defaultLocale: SupportedLocaleLang = "ru";
export const fallbackLocale: SupportedLocaleLang = "en";
export const getBrandName = (locale: string): string =>
  locale === "ru" ? "ГрейпЛаб" : "GrapeLab";

export const timeZone = "Europe/Volgograd";
export const translationProvider = "google";
export const SKIP_DB = process.env.SKIP_DB === 'true';
