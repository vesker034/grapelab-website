import { translationProvider } from '@/config';
import { prisma } from '@/lib/prisma';
import translate from 'translate';
import { xxHash32 } from 'js-xxhash';

translate.engine = translationProvider;
const seed = 0xcafe;

interface DynamicTranslationConsumer {
  id: number;
  sourceMessage: string;
  sourceLocale: string | null;
}

export async function getDynamicTranslations(scope: string) {
  return async (
    obj: DynamicTranslationConsumer,
    targetLocaleCode: string = 'en'
  ) => {
    if (obj.sourceLocale == targetLocaleCode || !obj.sourceMessage) {
      return obj.sourceMessage;
    }

    const originalHash = xxHash32(obj.sourceMessage, seed).toString(10);

    // Try to find existing translation
    const bufferedTranslation =
      await prisma.dynamicTranslationBuffer.findUnique({
        where: {
          unique_scope_source_locale: {
            scope,
            sourceId: obj.id,
            localeCode: targetLocaleCode,
          },
        },
      });

    // If translation exists and hash matches, return it
    if (
      bufferedTranslation &&
      originalHash === bufferedTranslation.originalMessageHash
    ) {
      return bufferedTranslation.message;
    }

    // Need new translation
    const translated = await translate(
      obj.sourceMessage,
      obj.sourceLocale
        ? {
            from: obj.sourceLocale,
            to: targetLocaleCode,
          }
        : targetLocaleCode
    );

    console.log('Creating/updating translation for review with id: ' + obj.id);

    // Use upsert to handle race conditions
    const updatedTranslation = await prisma.dynamicTranslationBuffer.upsert({
      where: {
        unique_scope_source_locale: {
          scope,
          sourceId: obj.id,
          localeCode: targetLocaleCode,
        },
      },
      update: {
        message: translated,
        originalMessageHash: originalHash,
      },
      create: {
        message: translated,
        scope: scope,
        sourceId: obj.id,
        originalMessageHash: originalHash,
        localeCode: targetLocaleCode,
      },
    });

    return updatedTranslation.message;
  };
}
