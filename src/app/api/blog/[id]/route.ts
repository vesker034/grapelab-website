import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!/^[1-9]\d*$/.test(params.id)) {
    return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
  }

  const id = Number(params.id);

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id, isVisible: true },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
