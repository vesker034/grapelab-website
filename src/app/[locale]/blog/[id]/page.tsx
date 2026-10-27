import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlogPostSection from '@/sections/BlogPostSection';
import { getLocale } from 'next-intl/server';
import { getBlogLocalizations, getLocalizedBlogField } from '@/lib/blogLocalization';

export const revalidate = 600;

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = await getLocale();
  const postId = parseInt(params.id);

  // Проверка валидности ID
  if (isNaN(postId)) {
    notFound();
  }

  // Получаем пост из базы данных
  const post = await prisma.blogPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      rawName: true,
      title: true,
      excerpt: true,
      content: true,
      bannerImagePath: true,
      publishedAt: true,
      isVisible: true,
    },
  });

  // Если пост не найден или не видимый
  if (!post || !post.isVisible) {
    notFound();
  }

  const localizations = await getBlogLocalizations([post.rawName], locale);
  const localizedTitle = getLocalizedBlogField(
    localizations,
    locale,
    post.rawName,
    'title',
    post.title,
  );
  const localizedExcerpt = getLocalizedBlogField(
    localizations,
    locale,
    post.rawName,
    'excerpt',
    post.excerpt,
  );
  const localizedContent = getLocalizedBlogField(
    localizations,
    locale,
    post.rawName,
    'content',
    post.content,
  );

  // Форматируем данные для компонента
  const blogPostData = {
    title: localizedTitle,
    date: post.publishedAt.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    subtitle: localizedExcerpt,
    imageUrl: post.bannerImagePath || '',
    content: localizedContent,
  };

  return <BlogPostSection data={blogPostData} />;
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const locale = await getLocale();
  const postId = parseInt(params.id);

  if (isNaN(postId)) {
    return {
      title: 'Пост не найден',
    };
  }

  const post = await prisma.blogPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      rawName: true,
      title: true,
      excerpt: true,
      bannerImagePath: true,
    },
  });

  if (!post) {
    return {
      title: 'Пост не найден',
    };
  }

  const localizations = await getBlogLocalizations([post.rawName], locale);
  const localizedTitle = getLocalizedBlogField(
    localizations,
    locale,
    post.rawName,
    'title',
    post.title,
  );
  const localizedExcerpt = getLocalizedBlogField(
    localizations,
    locale,
    post.rawName,
    'excerpt',
    post.excerpt,
  );

  return {
    title: localizedTitle,
    description: localizedExcerpt,
    openGraph: {
      title: localizedTitle,
      description: localizedExcerpt,
      images: post.bannerImagePath ? [post.bannerImagePath] : [],
    },
  };
}
