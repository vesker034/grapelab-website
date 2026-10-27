import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { Prisma } from "@prisma/client";
import { z } from "zod";

const DateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").refine(
  (value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  },
  { message: "Invalid date" }
);

const ProjectSchema = z.object({
  name:             z.string().min(1).max(500),
  image:            z.string().max(500).optional(),
  startDate:        DateOnlySchema,
  isVisible:        z.boolean(),
  partnerId:        z.number().int().positive().optional().nullable(),
  directionId:      z.number().int().positive().optional().nullable(),
  aspectsList:      z.array(z.string().max(500)).max(50).optional().nullable(),
  galleryImages:    z.array(z.string().max(500)).max(100).optional().nullable(),
  projectTechStack: z.array(z.string().max(100)).max(100).optional().nullable(),
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

  const parsed = ProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, image, startDate, isVisible, partnerId, directionId, aspectsList, galleryImages, projectTechStack } = parsed.data;

  try {
    const newProject = await prisma.project.create({
      data: {
        rawName:          name,
        imagePath:        image,
        startDate:        new Date(`${startDate}T00:00:00.000Z`),
        isVisible,
        partnerId,
        directionId,
        aspectsList:      aspectsList ?? Prisma.JsonNull,
        galleryImages:    galleryImages ?? Prisma.JsonNull,
        projectTechStack: projectTechStack ?? Prisma.JsonNull,
      },
      include: {
        partner: true,
        direction: true,
        employees: {
          include: {
            employee: true,
          },
        },
      },
    });

    return NextResponse.json({
      id:               newProject.id,
      name:             newProject.rawName,
      image:            newProject.imagePath,
      startDate:        newProject.startDate,
      isVisible:        newProject.isVisible,
      partnerId:        newProject.partnerId,
      directionId:      newProject.directionId,
      aspectsList:      newProject.aspectsList,
      galleryImages:    newProject.galleryImages,
      projectTechStack: newProject.projectTechStack,
      createdAt:        newProject.createdAt,
      updatedAt:        newProject.updatedAt,
    });
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isVisible: true },
      select: {
        id:               true,
        rawName:          true,
        imagePath:        true,
        startDate:        true,
        aspectsList:      true,
        galleryImages:    true,
        projectTechStack: true,
        partner: {
          select: {
            id:        true,
            name:      true,
            imagePath: true,
            url:       true,
          },
        },
        employees: {
          select: {
            employee: {
              select: {
                id:        true,
                firstName: true,
                lastName:  true,
                imagePath: true,
                role:      true,
                nickname:  true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(projects);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
