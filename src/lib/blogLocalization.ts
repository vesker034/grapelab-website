import { prisma } from "@/lib/prisma";

export const BLOG_LOCALIZATION_SECTIONS = {
  title: "blog_title",
  excerpt: "blog_excerpt",
  content: "blog_content",
} as const;

const BLOG_LOCALIZATION_SECTION_VALUES = Object.values(BLOG_LOCALIZATION_SECTIONS);

export type BlogLocalizationKey = keyof typeof BLOG_LOCALIZATION_SECTIONS;
export type BlogLocalizationSection =
  (typeof BLOG_LOCALIZATION_SECTIONS)[BlogLocalizationKey];

export type BlogLocalizationRow = {
  rawName: string;
  section: BlogLocalizationSection;
  localeCode: string;
  content: string;
};

export async function getBlogLocalizations(
  rawNames: Array<string | null | undefined>,
  locale: string,
): Promise<BlogLocalizationRow[]> {
  const normalizedRawNames = Array.from(
    new Set(
      rawNames.filter(
        (rawName): rawName is string =>
          typeof rawName === "string" && rawName.trim().length > 0,
      ),
    ),
  );

  if (normalizedRawNames.length === 0) {
    return [];
  }

  return prisma.localization.findMany({
    where: {
      section: {
        in: BLOG_LOCALIZATION_SECTION_VALUES,
      },
      localeCode: {
        equals: locale,
      },
      rawName: {
        in: normalizedRawNames,
      },
    },
    select: {
      rawName: true,
      section: true,
      localeCode: true,
      content: true,
    },
  }) as Promise<BlogLocalizationRow[]>;
}

export function getLocalizedBlogField(
  localizations: BlogLocalizationRow[],
  locale: string,
  rawName: string | null | undefined,
  field: BlogLocalizationKey,
  fallbackValue: string,
): string {
  if (!rawName) {
    return fallbackValue;
  }

  const section = BLOG_LOCALIZATION_SECTIONS[field];

  const directValue = localizations.find(
    (item) =>
      item.rawName === rawName &&
      item.section === section &&
      item.localeCode === locale,
  )?.content;

  if (typeof directValue === "string" && directValue.trim().length > 0) {
    return directValue;
  }

  return fallbackValue;
}

export async function resolveBlogPostRawName(postId: number): Promise<string> {
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    select: { rawName: true },
  });

  if (!post) {
    throw new Error(`BlogPost ${postId} not found`);
  }

  const currentRawName = post.rawName?.trim() || "";

  if (currentRawName) {
    const currentLocalizationCount = await prisma.localization.count({
      where: {
        rawName: currentRawName,
        section: {
          in: BLOG_LOCALIZATION_SECTION_VALUES,
        },
      },
    });

    if (currentLocalizationCount > 0) {
      return currentRawName;
    }
  }

  const totalPosts = await prisma.blogPost.count();

  if (totalPosts === 1) {
    const legacyRows = await prisma.localization.findMany({
      where: {
        section: {
          in: BLOG_LOCALIZATION_SECTION_VALUES,
        },
      },
      select: {
        rawName: true,
      },
      distinct: ["rawName"],
      orderBy: {
        rawName: "asc",
      },
    });

    if (legacyRows.length === 1) {
      const legacyRawName = legacyRows[0]?.rawName?.trim() || "";

      if (legacyRawName && legacyRawName !== currentRawName) {
        await prisma.blogPost.update({
          where: { id: postId },
          data: { rawName: legacyRawName },
        });
        return legacyRawName;
      }

      if (legacyRawName) {
        return legacyRawName;
      }
    }
  }

  if (currentRawName) {
    return currentRawName;
  }

  const generatedRawName = `blog_post_${postId}`;
  await prisma.blogPost.update({
    where: { id: postId },
    data: { rawName: generatedRawName },
  });

  return generatedRawName;
}
