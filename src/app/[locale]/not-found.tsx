'use client';

import { useTranslations } from "@/lib/localize";
import ErrorBlock from "@/sections/ErrorSection";

export default function NotFound() {
  const t = useTranslations("service");

  return (
    <ErrorBlock
      errorCode={404}
      errorMessage={t("notFound")}
    />
  );
}