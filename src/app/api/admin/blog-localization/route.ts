import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BLOG_LOCALIZATION_SECTIONS, resolveBlogPostRawName } from "@/lib/blogLocalization";
import type { SupportedLocaleLang } from "@/config";

const BLOG_EDITOR_LOCALES: SupportedLocaleLang[] = ["ru", "en", "ar"];

function createEmptyTranslations() {
  return {
    title: { ru: "", en: "", ar: "" },
    excerpt: { ru: "", en: "", ar: "" },
    content: { ru: "", en: "", ar: "" },
  };
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogPostId = Number(request.nextUrl.searchParams.get("blogPostId"));
  if (!Number.isInteger(blogPostId) || blogPostId <= 0) {
    return NextResponse.json({ error: "blogPostId is required" }, { status: 400 });
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: blogPostId },
    select: {
      title: true,
      excerpt: true,
      content: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const rawName = await resolveBlogPostRawName(blogPostId);
  const translations = createEmptyTranslations();

  const rows = await prisma.localization.findMany({
    where: {
      rawName,
      section: {
        in: Object.values(BLOG_LOCALIZATION_SECTIONS),
      },
      localeCode: {
        in: BLOG_EDITOR_LOCALES,
      },
    },
    select: {
      section: true,
      localeCode: true,
      content: true,
    },
  });

  for (const row of rows) {
    const fieldKey = (
      Object.entries(BLOG_LOCALIZATION_SECTIONS).find(
        ([, section]) => section === row.section,
      )?.[0] ?? null
    ) as keyof typeof translations | null;

    if (!fieldKey) {
      continue;
    }

    translations[fieldKey][row.localeCode as SupportedLocaleLang] = row.content;
  }

  return NextResponse.json({
    rawName,
    translations,
    baseValues: {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
    },
  });
}
