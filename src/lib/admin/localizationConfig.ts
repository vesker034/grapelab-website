import { locales } from "@/config";

export interface LocalizationFieldDef {
  key: string;
  section: string;
  label: string;
  multiline?: boolean;
  requiredInFallbackLocale?: boolean;
}

export interface ModelLocalizationConfig {
  fields: LocalizationFieldDef[];
  rawNameRequired?: boolean;
  rawNameLabel?: string;
}

export const localizationConfig: Record<string, ModelLocalizationConfig> = {
  DevDirection: {
    fields: [
      { key: "name", section: "devdirections", label: "Название" },
      { key: "description", section: "devdirections_description", label: "Описание", multiline: true },
    ],
  },
  Service: {
    fields: [
      { key: "name", section: "services_name", label: "Название" },
      { key: "description", section: "services_description", label: "Описание", multiline: true },
      { key: "tag", section: "services_tag", label: "Тег" },
    ],
  },
  ServiceFeature: {
    fields: [
      { key: "name", section: "services_features", label: "Название" },
    ],
  },
  Project: {
    fields: [
      { key: "name", section: "CasesSection_title", label: "Название" },
      { key: "description", section: "CasesSection_description", label: "Описание" },
      {
        key: "heroContent",
        section: "project_hero",
        label: "Hero-текст",
        multiline: true,
        requiredInFallbackLocale: false,
      },
      {
        key: "calloutContent",
        section: "project_callout",
        label: "Callout-текст",
        multiline: true,
        requiredInFallbackLocale: false,
      },
    ],
  },
  Employee: {
    rawNameRequired: true,
    rawNameLabel: "Никнейм",
    fields: [
      { key: "firstName",       section: "employees_firstName",       label: "Имя" },
      { key: "lastName",        section: "employees_lastName",        label: "Фамилия" },
      { key: "siteDescription", section: "employees_siteDescription", label: "Описание на сайте", multiline: true },
    ],
  },
  BlogPost: {
    rawNameRequired: true,
    rawNameLabel: "Системный ключ",
    fields: [
      {
        key: "title",
        section: "blog_title",
        label: "Заголовок",
        requiredInFallbackLocale: false,
      },
      {
        key: "excerpt",
        section: "blog_excerpt",
        label: "Анонс",
        multiline: true,
        requiredInFallbackLocale: false,
      },
      {
        key: "content",
        section: "blog_content",
        label: "Содержимое",
        multiline: true,
        requiredInFallbackLocale: false,
      },
    ],
  },
};

export const supportedLocales = locales;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
