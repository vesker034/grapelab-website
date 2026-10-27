import { getDynamicTranslations } from '@/lib/dynamicTranslations';
import { Prisma } from '@prisma/client';

const REVIEW_TRANSLATION_CONCURRENCY = 4;

type Review = Prisma.ReviewGetPayload<Record<string, never>>;

export async function getTranslatedReviews(reviews: Review[], locale: string) {
  const translateDescription = await getDynamicTranslations('reviews');
  const translateFullname = await getDynamicTranslations('review_fullname');
  const translateUserPosition = await getDynamicTranslations('review_user_position');

  const translatedReviews: Review[] = [];

  for (let i = 0; i < reviews.length; i += REVIEW_TRANSLATION_CONCURRENCY) {
    const batch = reviews.slice(i, i + REVIEW_TRANSLATION_CONCURRENCY);
    const translatedBatch = await Promise.all(
      batch.map(async (review) => {
        const [description, fullname, userPosition] = await Promise.all([
          translateDescription(
            { id: review.id, sourceMessage: review.description ?? '', sourceLocale: review.userLocale },
            locale,
          ),
          translateFullname(
            { id: review.id, sourceMessage: review.fullname, sourceLocale: review.userLocale },
            locale,
          ),
          translateUserPosition(
            { id: review.id, sourceMessage: review.userPosition ?? '', sourceLocale: review.userLocale },
            locale,
          ),
        ]);

        return { ...review, description, fullname, userPosition };
      }),
    );

    translatedReviews.push(...translatedBatch);
  }

  return translatedReviews;
}
