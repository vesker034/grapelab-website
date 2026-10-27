import { prisma } from "@/lib/prisma";
import Image from "next/image";
import TechnologiesSection from "@/sections/TechnologiesSection";
import TeamSection from "@/sections/TeamSection";
import TranslatedText from "@/components/TranslatedText";
import ImageSlider from "@/components/Slider";
import PageNotReady from "@/components/PageNotReady";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { JsonValue } from "@prisma/client/runtime/library";
import type { Metadata } from "next";
import { getBrandName } from "@/config";

export const revalidate = 600;

type SupportedLocale = "en" | "ru" | "ar";

type LocalizedValue = Partial<Record<SupportedLocale, string>>;

interface AspectItem {
  title?: LocalizedValue | string;
  description?: LocalizedValue | string;
}

interface GalleryImageItem {
  image_url?: string;
  alt?: string;
}

function getLocalizedText(value: unknown, locale: SupportedLocale): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  const localized = value as LocalizedValue;
  const localeOrder: SupportedLocale[] = [locale, "ru", "en", "ar"];

  for (const code of localeOrder) {
    const candidate = localized[code];
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return "";
}

function parseAspectsList(rawValue: JsonValue | null, locale: SupportedLocale) {
  if (!Array.isArray(rawValue)) return [];

  return rawValue
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const aspect = item as AspectItem;
      const title = getLocalizedText(aspect.title, locale);
      const description = getLocalizedText(aspect.description, locale);

      if (!title && !description) return null;
      return { title, description };
    })
    .filter((item): item is { title: string; description: string } => item !== null);
}

function parseGalleryImages(rawValue: JsonValue | null) {
  if (!Array.isArray(rawValue)) return [];

  return rawValue
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const image = item as GalleryImageItem;
      if (typeof image.image_url !== "string" || image.image_url.trim().length === 0) {
        return null;
      }

      return {
        src: image.image_url,
        alt: typeof image.alt === "string" ? image.alt : "",
      };
    })
    .filter((item): item is { src: string; alt: string } => item !== null);
}

function toNonEmptyString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; projectId: string };
}): Promise<Metadata> {
  const brandName = getBrandName(params.locale);
  const projectId = Number.parseInt(params.projectId, 10);

  if (Number.isNaN(projectId)) {
    return { title: brandName };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, rawName: true },
  });

  if (!project) {
    return { title: brandName };
  }

  let pageTitle = project.rawName?.trim() || "";

  try {
    const tProjectName = await getTranslations("CasesSection_title");
    if (project.rawName && tProjectName.has(project.rawName)) {
      const localized = tProjectName(project.rawName).trim();
      if (localized.length > 0) {
        pageTitle = localized;
      }
    }
  } catch {
    // fallback to rawName/default title
  }

  if (!pageTitle) {
    pageTitle = params.locale === "ru" ? `Проект #${project.id}` : `Project #${project.id}`;
  }

  return {
    title: {
      absolute: `${pageTitle} | ${brandName}`,
    },
  };
}

export default async function PortfolioCasePage({
  params,
}: {
  params: { locale: string; projectId: string };
}) {
  const locale = params.locale as SupportedLocale;
  const projectId = Number.parseInt(params.projectId, 10);

  if (Number.isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      employees: {
        include: {
          employee: true,
        },
      },
      partner: true,
    },
  });

  if (!project) {
    notFound();
  }

  const [tHero, tCallout, tProjectName] = await Promise.all([
    getTranslations("project_hero"),
    getTranslations("project_callout"),
    getTranslations("CasesSection_title"),
  ]);

  const titleContent = project.rawName ? tProjectName(project.rawName) : null;
  const heroContent = project.rawName ? tHero(project.rawName) : "";
  const calloutContent = project.rawName ? tCallout(project.rawName) : "";

  const aspectsList = parseAspectsList(project.aspectsList, locale);
  const galleryImages = parseGalleryImages(project.galleryImages);
  const techStack =
    Array.isArray(project.projectTechStack) && project.projectTechStack.length > 0
      ? project.projectTechStack
      : null;
  const employees = project.employees ?? [];

  const hasTitle = tProjectName.has(project.rawName ?? "") && toNonEmptyString(titleContent).length > 0;
  const hasHero = tHero.has(project.rawName ?? "") && toNonEmptyString(heroContent).length > 0;
  const hasCallout = tCallout.has(project.rawName ?? "") && toNonEmptyString(calloutContent).length > 0;
  const hasAspects = aspectsList.length > 0;
  const hasSlider = galleryImages.length > 0;
  const hasTeam = employees.length > 0;
  const hasTechStack = Array.isArray(techStack) && techStack.length > 0;
  const hasPartner = Boolean(
    project.partner &&
      (toNonEmptyString(project.partner.imagePath).length > 0 ||
        toNonEmptyString(project.partner.name).length > 0 ||
        toNonEmptyString(project.partner.url).length > 0)
  );

  const hasAnySection =
    hasHero ||
    hasCallout ||
    hasAspects ||
    hasSlider ||
    hasTeam ||
    hasTechStack ||
    hasPartner;

  if (!hasAnySection) {
    return <PageNotReady />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {hasTitle && <h1 className="text-3xl font-bold mb-4">{titleContent}</h1>}

      {hasSlider && <ImageSlider images={galleryImages} />}

      {hasCallout && (
        <div className="mb-6 rounded-[25px] border border-3 border-[var(--color-navbar)] px-16 py-8">
          <p>{calloutContent}</p>
        </div>
      )}

      {hasHero && (
        <div className="mb-6">
          <p>{heroContent}</p>
        </div>
      )}

      {hasAspects && (
        <div className="space-y-4">
          {aspectsList.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex items-center gap-6 border-b-[3px] border-[var(--color-navbar)] py-4"
            >
              <span className="text-[60px] italic font-bold text-[var(--color-navbar)]">
                {index + 1}.
              </span>
              <div className="space-y-2">
                {item.title && <h2 className="text-xl font-semibold">{item.title}</h2>}
                {item.description && <p>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasTeam && (
        <TeamSection
          initialData={employees.map(({ employee }) => employee)}
          hasMoreInitial={false}
          enableFilters={false}
          title={<TranslatedText namespace={"Portfolio"} keyText={"team"} />}
          className="mx-auto"
        />
      )}

      {hasTechStack && (
        <TechnologiesSection
          data={techStack}
          className="py-16 bg-background"
        />
      )}

      {hasPartner && project.partner && (
        <section className="py-8">
          <h2 className="text-[32px] font-semibold mb-8 text-primary">
            <TranslatedText namespace={"Portfolio"} keyText={"partner"} />
          </h2>
          <div className="rounded-[25px] border-[3px] border-[var(--color-navbar)] px-6 py-6 md:px-10 md:py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 text-textPrimary">
                {toNonEmptyString(project.partner.name).length > 0 && (
                  <p className="text-xl font-semibold">{project.partner.name}</p>
                )}
                {toNonEmptyString(project.partner.url).length > 0 && (
                  <a
                    href={project.partner.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-buttons)] hover:underline break-all"
                  >
                    {project.partner.url}
                  </a>
                )}
              </div>
              {toNonEmptyString(project.partner.imagePath).length > 0 && (
                <div className="relative h-[110px] w-[200px] shrink-0 md:h-[140px] md:w-[240px]">
                  <Image
                    src={`/${project.partner.imagePath}`}
                    alt={project.rawName ?? ""}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
