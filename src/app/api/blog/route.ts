import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { resolveBlogPostRawName } from '@/lib/blogLocalization';
import { z } from "zod";

const queryIntWithDefault = (defaultValue: number, min: number, max: number) =>
  z.preprocess(
    (value) => value ?? undefined,
    z.coerce.number().int().min(min).max(max).default(defaultValue)
  );

const BlogQuerySchema = z.object({
  page: queryIntWithDefault(1, 1, 10000),
  limit: queryIntWithDefault(10, 1, 50),
});

const BlogPostSchema = z.object({
  title:           z.string().min(1).max(500),
  excerpt:         z.string().min(1).max(1000),
  content:         z.string().min(1).max(100000),
  publishedAt:     z.string().datetime(),
  isVisible:       z.boolean().default(true),
  bannerImagePath: z.string().max(500).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = BlogQuerySchema.safeParse({
    page:  searchParams.get('page'),
    limit: searchParams.get('limit'),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid query params", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { page, limit } = parsed.data;
  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { isVisible: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({
        where: { isVisible: true },
      }),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, excerpt, content, bannerImagePath, publishedAt, isVisible } = parsed.data;

  try {
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        bannerImagePath,
        publishedAt: new Date(publishedAt),
        isVisible,
      },
    });

    await resolveBlogPostRawName(newPost.id);
    const post = await prisma.blogPost.findUnique({ where: { id: newPost.id } });

    return NextResponse.json(post ?? newPost);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
