import { prisma } from "@/lib/prisma";

// Auth events: login_success | login_failed | login_blocked
// Mutation events: admin_create:<model> | admin_update:<model> | admin_delete:<model>
export type AuditEvent = string;

const AUDIT_LOG_RETENTION_DAYS = 180;
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

let lastCleanupAt = 0;
let cleanupPromise: Promise<void> | null = null;

function shouldRunCleanup(now: number): boolean {
  return !cleanupPromise && now - lastCleanupAt >= CLEANUP_INTERVAL_MS;
}

function runAuditLogCleanup(now: number): void {
  if (!shouldRunCleanup(now)) {
    return;
  }

  lastCleanupAt = now;
  const cutoff = new Date(now - AUDIT_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);

  cleanupPromise = prisma.adminAuditLog
    .deleteMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
    })
    .then(() => undefined)
    .catch((err) => console.error("[audit] Failed to cleanup old logs:", err))
    .finally(() => {
      cleanupPromise = null;
    });
}

export function writeAuditLog(
  event: AuditEvent,
  source: string,
  email?: string,
): void {
  runAuditLogCleanup(Date.now());

  prisma.adminAuditLog
    .create({ data: { event, source, email } })
    .catch((err) => console.error("[audit] Failed to write log:", err));
}
