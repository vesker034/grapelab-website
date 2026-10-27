import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function getRefTableNamesResponse() {
  try {
    const refTables = await prisma.refTable.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(refTables.map((refTable) => refTable.name));
  } catch (error: unknown) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
