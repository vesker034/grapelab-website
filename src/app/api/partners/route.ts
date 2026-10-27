import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        name: true,
        imagePath: true,
        url: true,
      },
    });
    return NextResponse.json(partners);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
