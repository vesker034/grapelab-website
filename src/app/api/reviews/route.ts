import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { z } from "zod";

const ReviewSchema = z.object({
  fullName:    z.string().min(1).max(200),
  rate:        z.number().int().min(1).max(5),
  description: z.string().max(2000).optional(),
  dateTime:    z.string().datetime({ offset: true }),
  userLocale:  z.enum(["ru", "en", "ar"]),
});

function parseStaffUserId(sub: unknown): number | null {
  const userId = Number(sub);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }
  return userId;
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

  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { fullName, rate, description, dateTime, userLocale } = parsed.data;
  const addedByUserId = parseStaffUserId(token.sub);

  if (addedByUserId === null) {
    return NextResponse.json({ message: "Invalid session subject" }, { status: 401 });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        fullname:      fullName,
        rate,
        description,
        datetime:      dateTime,
        userLocale,
        addedByUserId,
      },
    });

    return NextResponse.json({
      id:          newReview.id,
      fullName:    newReview.fullname,
      rate:        newReview.rate,
      description: newReview.description,
      dateTime:    newReview.datetime,
      userLocale:  newReview.userLocale,
      addedByUser: newReview.addedByUserId,
      createdAt:   newReview.createdAt,
    });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        fullname: true,
        rate: true,
        description: true,
        userPosition: true,
        datetime: true,
        userLocale: true,
        imagePath: true,
        createdAt: true,
      },
      orderBy: { datetime: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
