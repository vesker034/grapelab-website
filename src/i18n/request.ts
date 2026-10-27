import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import deepmerge from "deepmerge";
import { fallbackLocale, locales, SKIP_DB, timeZone } from "@/config";
import { prisma } from "@/lib/prisma";

interface LocalizationData {
  section: string;
  rawName: string;
  localeCode: string;
  content: string;
}

interface NestedLocalizationObject {
  [key: string]: string | NestedLocalizationObject;
}

// Преобразует плоские локализации из БД (section + rawName) во вложенный объект messages
const buildMessages = (
  localizations: LocalizationData[],
): NestedLocalizationObject => {
  const messages: NestedLocalizationObject = {};

  localizations.forEach((localization) => {
    const fullKey = `${localization.section}.${localization.rawName}`;
    const keys = fullKey.split(".");
    let currentLevel = messages;

    keys.forEach((key, index) => {
      if (index < keys.length - 1) {
        if (!currentLevel[key] || typeof currentLevel[key] !== "object") {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      } else {
        currentLevel[key] = localization.content;
      }
    });
  });

  return messages;
};

// Загружает переводы из JSON-файла локали.
// Если файла нет, возвращает пустой объект, чтобы продолжить fallback-цепочку.
const loadFromJSON = async (
  locale: string,
): Promise<NestedLocalizationObject> => {
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return messages || {};
  } catch (error) {
    console.warn(`JSON translations not found for locale: ${locale}`);
    if (error instanceof Error) {
      console.error("JSON error details:", error.message);
    }
    return {};
  }
};

// Загружает переводы из БД для конкретной локали.
// При ошибке возвращает пустой объект, чтобы не ломать рендер.
const loadFromDatabase = async (
  locale: string,
): Promise<NestedLocalizationObject> => {
  try {
    const localizations = await prisma.localization.findMany({
      where: { localeCode: locale },
      select: {
        section: true,
        rawName: true,
        localeCode: true,
        content: true,
      },
    });

    return buildMessages(localizations);
  } catch (error) {
    console.warn(`DB translations failed to load for locale: ${locale}`);
    console.error("DB error details:", error);
    return {};
  }
};

// Аварийный минимум переводов на случай, если JSON и БД недоступны.
const createEmergencyFallback = (
  locale: string,
): NestedLocalizationObject => {
  const isRussian = locale === "ru";
  const isArabic = locale === "ar";

  return {
    Header: {
      grapelab: "GrapeLab",
      cases: isRussian ? "Кейсы" : isArabic ? "المشاريع" : "Cases",
      team: isRussian ? "Команда" : isArabic ? "الفريق" : "Team",
      contacts: isRussian ? "Контакты" : isArabic ? "اتصل بنا" : "Contacts",
    },
    Hero: {
      title: isRussian
        ? "Разработка ПО"
        : isArabic
          ? "حلول تطوير البرمجيات"
          : "Software Development",
      button: isRussian ? "Связаться" : isArabic ? "ناقش مشروعك" : "Contact Us",
    },
    ErrorSection: {
      errorMessage: isRussian
        ? "Страница не найдена"
        : isArabic
          ? "الصفحة غير موجودة"
          : "Page not found",
    },
  };
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Получаем локаль текущего запроса.
  const locale = await requestLocale;

  // Проверяем, что локаль поддерживается конфигом.
  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  try {
    console.log(`Loading translations for locale: ${locale}`);

    // Единая fallback-цепочка для всех локалей:
    // fallbackLocale JSON + fallbackLocale DB + locale JSON + locale DB
    // Более поздние источники имеют приоритет (locale поверх fallback).
    const [
      defaultJsonMessages,
      defaultDbMessages,
      localeJsonMessages,
      localeDbMessages,
    ] = await Promise.all([
      loadFromJSON(fallbackLocale),
      SKIP_DB ? Promise.resolve({}) : loadFromDatabase(fallbackLocale),
      loadFromJSON(locale),
      SKIP_DB ? Promise.resolve({}) : loadFromDatabase(locale),
    ]);

    const messages = deepmerge.all([
      defaultJsonMessages,
      defaultDbMessages,
      localeJsonMessages,
      localeDbMessages,
    ]);

    console.log(
      `Translations loaded. JSON keys: ${Object.keys(localeJsonMessages).length}, DB keys: ${Object.keys(localeDbMessages).length}`,
    );

    return {
      locale,
      timeZone,
      messages,
    };
  } catch (error) {
    console.error(`Critical translation load error for ${locale}:`);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }

    return {
      locale,
      timeZone,
      messages: createEmergencyFallback(locale),
    };
  }
});
