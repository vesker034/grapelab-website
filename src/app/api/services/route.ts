import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { z } from "zod";

const ServiceSchema = z.object({
  rawName:   z.string().min(1).max(300),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(9999).default(0),
});

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isVisible: true },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return NextResponse.json(services);
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

  const parsed = ServiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { rawName, isVisible, sortOrder } = parsed.data;

  try {
    const newService = await prisma.service.create({
      data: { rawName, isVisible, sortOrder },
    });

    return NextResponse.json(newService);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
