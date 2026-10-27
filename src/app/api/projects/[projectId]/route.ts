import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = parseInt(params.projectId);

  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        direction: true,
        partner: true,
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const techstack = await prisma.refTable.findFirst({
      where: { name: "techstack" },
    });

    const uniqueRoles = Array.from(
      new Set(
        project.employees
          .map(({ employee }) => employee.role)
          .filter((role): role is string => !!role)
      )
    );

    return NextResponse.json({
      project,
      techstack,
      uniqueRoles,
    });
  } catch (error) {
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
