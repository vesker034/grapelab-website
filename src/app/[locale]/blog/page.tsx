import React from "react";
import { prisma } from "@/lib/prisma";
import BlogSearchList from "@/components/BlogSearchList";
import PageHero from "@/components/PageHero";
import { getLocale, getTranslations } from "next-intl/server";
import { getBlogLocalizations, getLocalizedBlogField } from "@/lib/blogLocalization";

export const revalidate = 600;

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = await getLocale();
  const tBlogSection = await getTranslations("BlogSection");
  const currentPage = Number(searchParams.page) || 1;

  const blogPosts = await prisma.blogPost.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      rawName: true,
      title: true,
      excerpt: true,
      bannerImagePath: true,
      publishedAt: true,
    },
  });

  const localizations = await getBlogLocalizations(
    blogPosts.map((post) => post.rawName),
    locale,
  );

  const localizedPosts = blogPosts.map((post) => ({
    id: post.id,
    title: getLocalizedBlogField(
      localizations,
      locale,
      post.rawName,
      "title",
      post.title,
    ),
    excerpt: getLocalizedBlogField(
      localizations,
      locale,
      post.rawName,
      "excerpt",
      post.excerpt,
    ),
    date: post.publishedAt.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    imageUrl: post.bannerImagePath,
  }));

  return (
    <div className={localizedPosts.length ? "min-h-screen pb-20 md:pb-28" : ""}>
      <PageHero title={tBlogSection("title")} description={tBlogSection("intro")} />
      <div className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-14">
        <BlogSearchList
          posts={localizedPosts}
          initialPage={currentPage}
          noPosts={tBlogSection("noPosts")}
          searchPlaceholder={tBlogSection("searchPlaceholder")}
          searchNoResults={tBlogSection("searchNoResults")}
        />
      </div>
    </div>
  );
}
