import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const ALLOWED_SCOPES = new Set([
  "blog",
  "devdirections",
  "employees",
  "general",
  "partners",
  "projects",
  "reviews",
  "services",
  "services_categories",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

function hasValidMagicBytes(buf: Buffer, mimeType: string): boolean {
  switch (mimeType) {
    case "image/jpeg":
      return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "image/png":
      return (
        buf.length >= 8 &&
        buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
        buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
      );
    case "image/webp":
      return (
        buf.length >= 12 &&
        buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
      );
    case "image/gif":
      // GIF87a или GIF89a
      return (
        buf.length >= 6 &&
        buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38 &&
        (buf[4] === 0x37 || buf[4] === 0x39) && buf[5] === 0x61
      );
    default:
      return false;
  }
}

function sanitizeSvg(raw: string): string | null {
  // Базовая структурная проверка: SVG должен содержать тег <svg
  if (!/<svg[\s>]/i.test(raw)) return null;

  const { window } = new JSDOM("");
  const purify = DOMPurify(window as unknown as Window & typeof globalThis);

  const clean = purify.sanitize(raw, {
    USE_PROFILES: { svg: true, svgFilters: true },
    // Явно запрещаем всё, что может исполнять код
    FORBID_TAGS: ["script", "use"],
    FORBID_ATTR: [
      "onload", "onerror", "onclick", "onmouseover", "onfocus",
      "onmouseenter", "onmouseleave", "onanimationstart", "onanimationend",
    ],
  });

  // Если после санации SVG-тег исчез — файл был некорректным
  if (!/<svg[\s>]/i.test(clean)) return null;

  return clean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const rawScope = (formData.get("scope") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_SCOPES.has(rawScope)) {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
    }
    const scope = rawScope;

    const ext = MIME_TO_EXT[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Максимальный размер 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let fileToWrite: Buffer;

    if (file.type === "image/svg+xml") {
      const raw = buffer.toString("utf8");
      const clean = sanitizeSvg(raw);
      if (clean === null) {
        return NextResponse.json({ error: "Invalid SVG content" }, { status: 400 });
      }
      fileToWrite = Buffer.from(clean, "utf8");
    } else {
      if (!hasValidMagicBytes(buffer, file.type)) {
        return NextResponse.json({ error: "Invalid file content" }, { status: 400 });
      }
      fileToWrite = buffer;
    }

    // Генерируем уникальное имя файла (расширение из MIME, не из имени файла)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${random}${ext}`;

    // Сохраняем в ./public/uploads/<scope>/
    const baseDir = path.resolve(process.cwd(), "public", "uploads");
    const uploadDir = path.resolve(baseDir, scope);

    if (!uploadDir.startsWith(baseDir + path.sep)) {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
    }

    fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.resolve(uploadDir, filename);
    fs.writeFileSync(filePath, fileToWrite);

    // Возвращаем путь через API-роут (не зависит от кеша статики Next.js при старте)
    const relativeScope = path.relative(baseDir, uploadDir);
    const publicPath = `/api/uploads/${relativeScope}/${filename}`;
    return NextResponse.json({ path: publicPath });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
