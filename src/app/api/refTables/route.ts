import { getRefTableNamesResponse } from "@/lib/refTablesApi";

export async function GET() {
  return getRefTableNamesResponse();
}
