import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fallbackLocale } from "@/config";
import { z } from "zod";

const LocaleCodeSchema = z.string().min(1).max(2);

const TranslationsSchema = z.record(
  LocaleCodeSchema,
  z.string().max(50000)
).refine(
  (translations) => Object.keys(translations).length > 0,
  { message: "At least one translation is required" }
);

const LocalizationQuerySchema = z.object({
  rawName:  z.string().min(1).max(300),
  sections: z.string().min(1).max(1000),
});

const LocalizationPostSchema = z.object({
  rawName: z.string().min(1).max(300),
  fields:  z.array(
    z.object({
      section:                  z.string().min(1).max(300),
      translations:             TranslationsSchema,
      requiredInFallbackLocale: z.boolean().optional(),
    })
  ).min(1).max(50),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const parsed = LocalizationQuerySchema.safeParse({
    rawName:  searchParams.get("rawName"),
    sections: searchParams.get("sections"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const sections = parsed.data.sections
    .split(",")
    .map((section) => section.trim())
    .filter((section) => section.length > 0)
    .slice(0, 50);

  if (sections.length === 0) {
    return NextResponse.json(
      { error: "Invalid query params", errors: { sections: ["At least one section is required"] } },
      { status: 400 }
    );
  }

  const localizations = await prisma.localization.findMany({
    where: {
      rawName: parsed.data.rawName,
      section: { in: sections },
    },
    select: {
      section: true,
      localeCode: true,
      content: true,
    },
  });

  return NextResponse.json(localizations);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = LocalizationPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { rawName, fields } = parsed.data;

  if (!rawName || !fields) {
    return NextResponse.json({ error: "rawName and fields are required" }, { status: 400 });
  }

  for (const field of fields) {
    const isRequired = field.requiredInFallbackLocale !== false;
    const fallbackContent = field.translations?.[fallbackLocale];

    if (
      isRequired &&
      (typeof fallbackContent !== "string" || fallbackContent.trim().length === 0)
    ) {
      return NextResponse.json(
        {
          error: `Fallback locale "${fallbackLocale}" is required for section "${field.section}"`,
          section: field.section,
          localeCode: fallbackLocale,
        },
        { status: 400 },
      );
    }
  }

  const operations: Promise<unknown>[] = [];

  for (const field of fields) {
    for (const [localeCode, content] of Object.entries(field.translations)) {
      const trimmed = content.trim();

      if (trimmed === "") {
        operations.push(
          prisma.localization.deleteMany({
            where: {
              section: field.section,
              rawName,
              localeCode,
            },
          })
        );
      } else {
        operations.push(
          prisma.localization.upsert({
            where: {
              section_rawName_localeCode: {
                section: field.section,
                rawName,
                localeCode,
              },
            },
            update: { content: trimmed },
            create: {
              section: field.section,
              rawName,
              localeCode,
              content: trimmed,
            },
          })
        );
      }
    }
  }

  await Promise.all(operations);

  return NextResponse.json({ ok: true });
}
