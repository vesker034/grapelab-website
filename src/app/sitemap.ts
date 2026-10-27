import { MetadataRoute } from 'next';
import { locales } from '@/config';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const baseUrl = 'https://grapelab.ru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '',
    '/contacts',
    '/portfolio',
    '/services',
    '/team',
    '/blog',
    '/partners',
    '/advertising',
    '/community',
    '/privacy-policy',
    '/terms-of-use',
  ];

  const [projects, employees, blogPosts] = await Promise.all([
    prisma.project.findMany({
      where: { isVisible: true },
      select: { id: true },
    }),
    prisma.employee.findMany({
      where: { isVisible: true },
      select: { nickname: true },
    }),
    prisma.blogPost.findMany({
      where: { isVisible: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: path === '' ? 1.0 : 0.7,
    })),
  );

  const portfolioUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/portfolio/${project.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  );

  const employeeUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    employees
      .filter(
        (employee) =>
          typeof employee.nickname === 'string' &&
          employee.nickname.trim().length > 0,
      )
      .map((employee) => ({
        url: `${baseUrl}/${locale}/team/${encodeURIComponent(employee.nickname)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })),
  );

  const blogUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    blogPosts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
  );

  return [...staticUrls, ...portfolioUrls, ...employeeUrls, ...blogUrls];
}
