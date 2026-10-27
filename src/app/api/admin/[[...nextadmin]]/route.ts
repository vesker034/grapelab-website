import { prisma } from "@/lib/prisma";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import { options } from "../../../admin/options";
import { getToken } from "next-auth/jwt";
import { writeAuditLog } from "@/lib/auditLog";
import type { NextRequest } from "next/server";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options,
});

type AdminRouteContext = { params: Promise<{ nextadmin: string[] }> };

function getClientSource(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function classifyPostAuditEvent(segments: string[]): string | null {
  if (segments.length === 0) return null;

  const [model, second, third] = segments;

  if (model === "options") return null;
  if (second === "order") return `admin_reorder:${model}`;
  if (second === "actions" && third) return `admin_action:${model}:${third}`;
  if (second) return `admin_update:${model}`;

  return `admin_create:${model}`;
}

async function withMutationLog(
  event: string,
  request: NextRequest,
  ctx: AdminRouteContext,
): Promise<Response> {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const source = getClientSource(request);
  const email = typeof token?.email === "string" ? token.email : undefined;

  const response = await run(request, ctx);

  if (response.ok) {
    writeAuditLog(event, source, email);
  }

  return response;
}

export async function POST(request: NextRequest, ctx: AdminRouteContext) {
  const params = await ctx.params;
  const event = classifyPostAuditEvent(params.nextadmin ?? []);

  if (!event) {
    return run(request, ctx);
  }

  return withMutationLog(event, request, ctx);
}

export async function DELETE(request: NextRequest, ctx: AdminRouteContext) {
  const params = await ctx.params;
  const model = params.nextadmin[0] ?? "unknown";
  return withMutationLog(`admin_delete:${model}`, request, ctx);
}

export { run as GET };
