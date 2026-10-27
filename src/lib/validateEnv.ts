let hasValidatedEnv = false;

function isBuildPhase(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build" ||
    (process.argv[1]?.includes("next") === true && process.argv.includes("build"))
  );
}

export function validateCriticalEnv(): void {
  if (hasValidatedEnv) return;
  hasValidatedEnv = true;

  if (isBuildPhase()) {
    return;
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    const msg =
      "NEXTAUTH_SECRET is missing or too short (minimum 32 characters required)";

    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    }

    console.warn(`[env] WARNING: ${msg}`);
  }
}
