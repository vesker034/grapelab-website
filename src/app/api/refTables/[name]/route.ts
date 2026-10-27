import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ALLOWED_REF_TABLE_NAMES = new Set(['contacts', 'stats', 'techstack']);

interface Params {
  params: { name: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = params;

  if (!ALLOWED_REF_TABLE_NAMES.has(name)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    const refTable = await prisma.refTable.findUnique({
      where: { name },
      select: { name: true, content: true },
    });

    if (!refTable) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(refTable);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
