import { validateCriticalEnv } from "@/lib/validateEnv";

export async function register() {
  validateCriticalEnv();
}
