import { prisma } from "@/lib/prisma";
import RoundedButton from "@/components/RoundedButton";
import TranslatedText from "@/components/TranslatedText";
import PageNotReady from "@/components/PageNotReady";
import { getLocale, getTranslations } from "next-intl/server";
import { readdir } from "fs/promises";
import path from "path";
import { fallbackLocale } from "@/config";
import ServicesMetrics from "@/components/ServicesMetrics";
import ServiceSearch from "@/components/ServiceSearch";

export const revalidate = 3600;

function getRandomServiceBackground(
  backgrounds: string[],
  excludedBackground?: string
): string | undefined {
  if (backgrounds.length === 0) {
    return undefined;
  }

  const availableBackgrounds =
    excludedBackground && backgrounds.length > 1
      ? backgrounds.filter((background) => background !== excludedBackground)
      : backgrounds;

  const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
  return availableBackgrounds[randomIndex];
}

async function getServiceBackgrounds(): Promise<string[]> {
  const publicDir = path.join(process.cwd(), "public");
  const files = await readdir(publicDir);

  return files
    .filter((fileName) => /^service-back\d+\.webp$/i.test(fileName))
    .map((fileName) => `/${fileName}`);
}

export default async function Services() {
  const locale = await getLocale();
  const t = await getTranslations("Services");
  const serviceBackgrounds = await getServiceBackgrounds();

  const services = await prisma.service.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      features: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  const serviceRawNames = services.map((service) => service.rawName);
  const featureRawNames = services.flatMap((service) =>
    service.features.map((feature) => feature.rawName)
  );

  const localizations = await prisma.localization.findMany({
    where: {
      section: {
        in: [
          "services_name",
          "services_description",
          "services_features",
          "services_tag",
        ],
      },
      localeCode: {
        in: locale === fallbackLocale ? [fallbackLocale] : [locale, fallbackLocale],
      },
      rawName: { in: [...serviceRawNames, ...featureRawNames] },
    },
  });

  const getLocalizedContent = (
    section:
      | "services_name"
      | "services_description"
      | "services_features"
      | "services_tag",
    rawName: string
  ) => {
    const direct = localizations.find(
      (item) =>
        item.section === section &&
        item.rawName === rawName &&
        item.localeCode === locale
    )?.content;

    if (typeof direct === "string" && direct.trim().length > 0) {
      return direct;
    }

    const fallback = localizations.find(
      (item) =>
        item.section === section &&
        item.rawName === rawName &&
        item.localeCode === fallbackLocale
    )?.content;

    if (typeof fallback === "string" && fallback.trim().length > 0) {
      return fallback;
    }

    return null;
  };

  let previousImage: string | undefined;
  const localizedServices = services.reduce<
    Array<{
      title: string;
      description?: string;
      tag?: string;
      image?: string;
      descriptionList: string[];
    }>
  >((acc, service) => {
    const image =
      service.imagePath ?? getRandomServiceBackground(serviceBackgrounds, previousImage);

    previousImage = image;

    const title = getLocalizedContent("services_name", service.rawName);
    if (!title) {
      return acc;
    }

    const description = getLocalizedContent("services_description", service.rawName);
    const tag = getLocalizedContent("services_tag", service.rawName);
    const descriptionList = service.features
      .map((feature) => getLocalizedContent("services_features", feature.rawName))
      .filter((feature): feature is string => Boolean(feature));

    acc.push({
      title,
      description: description ?? undefined,
      tag: tag ?? undefined,
      image,
      descriptionList,
    });

    return acc;
  }, []);

  if (!localizedServices.length) {
    return <PageNotReady />;
  }

  const totalFeatures = localizedServices.reduce(
    (sum, service) => sum + service.descriptionList.length,
    0
  );

  const serviceTexts = localizedServices.map((service) => ({
    ...service,
    deliverablesLabel: t("labels.deliverables", {
      count: service.descriptionList.length,
    }),
  }));
  return (
    <div className="pb-20 md:pb-28">
      <section className="mx-auto mt-6 w-[min(1180px,88vw)] md:mt-10">
        <div className="relative overflow-hidden rounded-[36px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-7 shadow-[0_24px_70px_rgba(88,66,124,0.12)] md:px-10 md:py-9 lg:px-14 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.12),transparent_42%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-center">
            <div className="flex flex-col justify-start lg:pr-6">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-[var(--color-primary-text)] md:text-5xl md:leading-[1.02]">
                <TranslatedText namespace={"Header"} keyText={"services"} />
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted-text)] md:text-[18px]">
                {t("intro")}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <RoundedButton
                  href="/contacts"
                  variant="filled"
                  className="w-full md:w-[320px]"
                >
                  <TranslatedText namespace={"Services"} keyText={"button"} />
                </RoundedButton>
                <RoundedButton
                  href="/portfolio#cases-section"
                  variant="outlined"
                  className="w-full md:w-[320px]"
                >
                  <TranslatedText namespace={"CasesSection"} keyText={"button_moreCases"} />
                </RoundedButton>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <ServicesMetrics
                servicesCount={localizedServices.length}
                featuresCount={totalFeatures}
              />
              <div className="overflow-hidden rounded-[28px] border border-[rgba(88,66,124,0.16)] bg-site p-5 text-[var(--color-primary-text)] shadow-[0_16px_34px_rgba(88,66,124,0.08)]">
                <RoundedButton
                  href="/portfolio#development-process-section"
                  variant="outlined"
                  className="!w-fit px-4 py-2 text-[11px] leading-none tracking-[0.16em]"
                >
                  {t("metrics.model")}
                </RoundedButton>
                <div className="mt-4 max-w-[20ch] text-[21px] font-semibold leading-[1.35] md:text-2xl">
                  {t("metrics.modelValue")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-14">
        <ServiceSearch
          services={serviceTexts}
          texts={{
            searchPlaceholder: t("searchPlaceholder"),
            searchNoResults: t("searchNoResults"),
            labels: {
              studio: t("labels.studio"),
              scope: t("labels.scope"),
            },
          }}
        />
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="group relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(88,66,124,0.16)] md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.16),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.55),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                <TranslatedText namespace={"Header"} keyText={"grapelab"} />
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary-text)] md:text-[34px]">
                {t("ctaTitle")}
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--color-muted-text)]">
                {t("ctaDescription")}
              </p>
            </div>
            <RoundedButton
              href="/contacts"
              variant="filled"
              className="w-full md:mt-12 md:w-[320px]"
            >
              <TranslatedText namespace={"Services"} keyText={"button"} />
            </RoundedButton>
          </div>
        </div>
      </section>
    </div>
  );
}
