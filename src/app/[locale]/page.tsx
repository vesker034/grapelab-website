// Главная страница

import { getTranslatedReviews } from '@/lib/getTranslatedReviews';
import { fallbackLocale } from '@/config';
import { prisma } from '@/lib/prisma';
import CasesSection from '@/sections/CasesSection';
import DevelopmentDirectionsSection from '@/sections/DevelopmentDirectionsSection';
import Hero from '@/sections/Hero';
import Partners from '@/sections/PartnerSection';
import ReviewSection from '@/sections/ReviewSection';
import { getLocale } from 'next-intl/server';

export const revalidate = 300;

const directionOrder = [
  'web_dev',
  'mobile_apps',
  'qa_testing',
  'ui_ux_design',
  'desktop_solutions',
  'software_design',
  'rd',
  'game_dev',
] as const;

const directionOrderMap = new Map<string, number>(
  directionOrder.map((rawName, index) => [rawName, index]),
);

export default async function Home() {
  const locale = await getLocale();

  // Берём все devDirections (ключи)
  const devDirections = (await prisma.devDirection.findMany()).sort(
    (a, b) =>
      (directionOrderMap.get(a.rawName) ?? Number.MAX_SAFE_INTEGER) -
      (directionOrderMap.get(b.rawName) ?? Number.MAX_SAFE_INTEGER),
  );
  // Берём все локализации по ключам и текущему языка
  const rawNames = devDirections.map((d) => d.rawName);
  const localizations = await prisma.localization.findMany({
    where: {
      section: { in: ['devdirections', 'devdirections_description'] },
      localeCode: { in: locale === fallbackLocale ? [fallbackLocale] : [locale, fallbackLocale] },
      rawName: { in: rawNames },
    },
  });

  const getLocalizedContent = (
    section: 'devdirections' | 'devdirections_description',
    rawName: string,
  ) => {
    const direct = localizations.find(
      (l) => l.section === section && l.rawName === rawName && l.localeCode === locale,
    )?.content;

    if (typeof direct === 'string' && direct.trim().length > 0) {
      return direct;
    }

    return (
      localizations.find(
        (l) =>
          l.section === section &&
          l.rawName === rawName &&
          l.localeCode === fallbackLocale,
      )?.content ?? null
    );
  };

  // получает переведённое название из translations по raw_name
  const nameMap = new Map(
      rawNames.map((rawName) => [rawName, getLocalizedContent('devdirections', rawName)])
  );
  // получает переведённое описание из translations по raw_name
  const descMap = new Map(
      rawNames.map((rawName) => [rawName, getLocalizedContent('devdirections_description', rawName)])
  );
  // переведённое поля name, description
  const devDirectionsLocalized = devDirections.map((d) => ({
    name: nameMap.get(d.rawName) ?? d.rawName,
    description: descMap.get(d.rawName) ?? null,
    imagePath: d.imagePath,
  }));

  // Получаем проекты напрямую как массив
  const projects = await prisma.project.findMany({
      where: { isVisible: true },
      include: { direction: true },
      orderBy: { startDate: 'desc' }
  });
  const partners = await prisma?.partner.findMany();
  const reviews = await prisma?.review.findMany();

  const translatedReviews = await getTranslatedReviews(reviews, locale);

  return (
      <>
        <Hero />
        <DevelopmentDirectionsSection data={devDirectionsLocalized} />
        <CasesSection data={projects} />
        <Partners data={partners} />
        <ReviewSection data={translatedReviews} />
      </>
  );
}
