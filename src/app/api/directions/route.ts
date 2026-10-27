import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { z } from "zod";

const directionOrder = [
  "web_dev",
  "mobile_apps",
  "qa_testing",
  "ui_ux_design",
  "desktop_solutions",
  "software_design",
  "rd",
  "game_dev",
] as const;

const directionOrderMap = new Map<string, number>(
  directionOrder.map((rawName, index) => [rawName, index]),
);

const DirectionSchema = z.object({
  name:          z.string().min(1).max(300),
  duration_days: z.number().int().min(1).max(3650),
});

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

  const parsed = DirectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, duration_days } = parsed.data;

  try {
    const newDirection = await prisma.devDirection.create({
      data: {
        rawName:      name,
        durationDays: duration_days,
      },
    });

    return NextResponse.json({
      id:            newDirection.id,
      rawName:       newDirection.rawName,
      duration_days: newDirection.durationDays,
      createdAt:     newDirection.createdAt,
      updatedAt:     newDirection.updatedAt,
    });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const directions = (await prisma.devDirection.findMany({
      select: {
        id: true,
        rawName: true,
        shortName: true,
        durationDays: true,
        imagePath: true,
      },
    })).sort(
      (a, b) =>
        (directionOrderMap.get(a.rawName) ?? Number.MAX_SAFE_INTEGER) -
        (directionOrderMap.get(b.rawName) ?? Number.MAX_SAFE_INTEGER),
    );
    return NextResponse.json(directions);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
