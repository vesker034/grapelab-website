import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { z } from "zod";

const ProjectEmployeeSchema = z.object({
  projectId:  z.number().int().positive(),
  employeeId: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = ProjectEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { projectId, employeeId } = parsed.data;

    const newProjectEmployee = await prisma.projectEmployee.create({
      data: { projectId, employeeId },
    });

    return NextResponse.json({
      projectId:  newProjectEmployee.projectId,
      employeeId: newProjectEmployee.employeeId,
      createdAt:  newProjectEmployee.createdAt,
      updatedAt:  newProjectEmployee.updatedAt,
    });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const projectEmployees = await prisma.projectEmployee.findMany(); // ищем все данные в бд
    return NextResponse.json(projectEmployees); // возвращаем
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
