import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_SOURCE = 20;
const MAX_ATTEMPTS_SOURCE_EMAIL = 5;

// Progressive backoff: 5m -> 30m -> 2h -> 12h
const BACKOFF_MS = [5, 30, 120, 720].map((m) => m * 60 * 1000);

function backoffMs(blockCount: number): number {
  return BACKOFF_MS[Math.min(blockCount, BACKOFF_MS.length - 1)];
}

interface RateLimitRow {
  key: string;
  count: number;
  window_started_at: Date;
  blocked_until: Date | null;
  block_count: number;
}

type TxClient = Prisma.TransactionClient;

async function getLockedRow(tx: TxClient, key: string, now: Date): Promise<RateLimitRow> {
  await tx.$executeRaw`
    INSERT INTO admin_rate_limits (key, count, window_started_at, blocked_until, block_count, updated_at)
    VALUES (${key}, 0, ${now}, NULL, 0, ${now})
    ON CONFLICT (key) DO NOTHING
  `;

  const rows = await tx.$queryRaw<RateLimitRow[]>`
    SELECT key, count, window_started_at, blocked_until, block_count
    FROM admin_rate_limits
    WHERE key = ${key}
    FOR UPDATE
  `;

  return rows[0]!;
}

async function pruneOrResetExpiredRow(
  tx: TxClient,
  row: RateLimitRow,
  now: Date,
): Promise<RateLimitRow | null> {
  const windowExpired = row.window_started_at.getTime() + WINDOW_MS < now.getTime();
  const blockExpired = !row.blocked_until || row.blocked_until <= now;

  if (!windowExpired) {
    return row;
  }

  if (blockExpired) {
    await tx.$executeRaw`
      DELETE FROM admin_rate_limits WHERE key = ${row.key}
    `;
    return null;
  }

  await tx.$executeRaw`
    UPDATE admin_rate_limits
    SET count = 0,
        window_started_at = ${now},
        updated_at = ${now}
    WHERE key = ${row.key}
  `;

  return {
    ...row,
    count: 0,
    window_started_at: now,
  };
}

async function isKeyBlocked(key: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    const row = await getLockedRow(tx, key, now);
    const activeRow = await pruneOrResetExpiredRow(tx, row, now);

    if (!activeRow?.blocked_until) {
      return false;
    }

    return activeRow.blocked_until > now;
  });
}

async function registerFailedAttempt(key: string, limit: number): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    const row = await getLockedRow(tx, key, now);
    const activeRow =
      (await pruneOrResetExpiredRow(tx, row, now)) ?? {
        ...row,
        count: 0,
        window_started_at: now,
        blocked_until: null,
      };

    if (activeRow.blocked_until && activeRow.blocked_until > now) {
      return true;
    }

    const newCount = activeRow.count + 1;
    const willBlock = newCount >= limit;
    const newBlockCount = willBlock ? activeRow.block_count + 1 : activeRow.block_count;
    const newBlockedUntil = willBlock
      ? new Date(now.getTime() + backoffMs(newBlockCount - 1))
      : null;

    await tx.$executeRaw`
      INSERT INTO admin_rate_limits (key, count, window_started_at, blocked_until, block_count, updated_at)
      VALUES (${key}, ${newCount}, ${activeRow.window_started_at}, ${newBlockedUntil}, ${newBlockCount}, ${now})
      ON CONFLICT (key) DO UPDATE
      SET count = EXCLUDED.count,
          window_started_at = EXCLUDED.window_started_at,
          blocked_until = EXCLUDED.blocked_until,
          block_count = EXCLUDED.block_count,
          updated_at = EXCLUDED.updated_at
    `;

    return willBlock;
  });
}

export async function isRateLimited(source: string, email: string): Promise<boolean> {
  const [sourceBlocked, emailBlocked] = await Promise.all([
    isKeyBlocked(`source:${source}`),
    isKeyBlocked(`source-email:${source}:${email}`),
  ]);

  return sourceBlocked || emailBlocked;
}

export async function registerRateLimitFailure(
  source: string,
  email: string,
): Promise<boolean> {
  const [sourceBlocked, emailBlocked] = await Promise.all([
    registerFailedAttempt(`source:${source}`, MAX_ATTEMPTS_SOURCE),
    registerFailedAttempt(`source-email:${source}:${email}`, MAX_ATTEMPTS_SOURCE_EMAIL),
  ]);

  return sourceBlocked || emailBlocked;
}

export async function resetSourceEmail(source: string, email: string): Promise<void> {
  await prisma.adminRateLimit.deleteMany({
    where: { key: `source-email:${source}:${email}` },
  });
}
