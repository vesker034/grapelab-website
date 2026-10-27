'use client';

import { useTranslations } from "@/lib/localize";
import ErrorSection from "@/sections/ErrorSection";


type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  const t = useTranslations("service");
  
  return (
    <ErrorSection 
        errorCode={500}
        errorMessage={t("internalServerError")}
        secondaryText={error.message}
        reloadAction={reset}
    />
  );
}
