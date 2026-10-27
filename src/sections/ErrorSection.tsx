"use client";

import Image from "next/image";
import grapelogo from "/public/grapelogo.svg";
import { useTranslations } from "@/lib/localize";

interface ErrorSectionProps {
  errorCode?: number;
  errorMessage?: string;
  homeLink?: string;
  homeLinkText?: string;
  reloadAction?: () => void;
  secondaryText?: string;
  reloadText?: string;
}

export default function ErrorSection({
  errorCode = 404,
  homeLink = "/",
  secondaryText = undefined,
  reloadAction = undefined,
}: ErrorSectionProps) {
  // Скорее всего стоит сделать ReadOnly<ErrorSectionProps>
  const showLogo = errorCode.toString()[1] === "0";
  const t = useTranslations("ErrorSection");

  return (
    <section className="bg-[var(--color-site-background)] px-4 md:px-10 lg:px-20 py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-[1200px] mx-auto text-center">
        {/* Блок с кодом ошибки */}
        <div className="mb-8 md:mb-12 lg:mb-16" dir="ltr">
          {showLogo ? (
            <div className="flex justify-center items-center">
              <span
                className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-[var(--color-buttons)]"
              >
                {errorCode.toString()[0]}
              </span>

              {/* Логотип */}
              <div className="mx-2 sm:mx-4 flex items-center justify-center">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
                  <Image
                    src={grapelogo}
                    alt="error code logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <span
                className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-[var(--color-buttons)]"
              >
                {errorCode.toString()[2]}
              </span>
            </div>
          ) : (
            <h1
              className="text-5xl sm:text-6xl md:text-8xl lg:text-[120px] font-bold text-[var(--color-muted-text)]"
            >
              {errorCode}
            </h1>
          )}
        </div>

        {/* Сообщение об ошибке */}
        <h2
          className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold text-[var(--color-primary-text)] mb-6 md:mb-10"
        >
          {t("errorMessage")}
        </h2>

        {secondaryText && (
          <h4 className="text-[var(--color-muted-text)] mb-6 md:mb-10 text-base sm:text-lg">
            {secondaryText}
          </h4>
        )}

        {reloadAction && (
          <div>
            <a
              href="#"
              onClick={reloadAction}
              className="inline-block text-base sm:text-lg md:text-xl lg:text-2xl mb-4 font-bold text-[var(--color-buttons)] hover:opacity-80 transition-opacity no-underline"
            >
              {t("reloadText")}
            </a>
          </div>
        )}

        {/* Ссылка для возврата (без подчеркивания, жирная) */}
        <div>
          <a
            href={homeLink}
            className="inline-block text-base sm:text-lg md:text-xl lg:text-2xl mb-4 font-bold text-[var(--color-buttons)] hover:opacity-80 transition-opacity no-underline"
          >
            {t("homeLinkText")}
          </a>
        </div>
      </div>
    </section>
  );
}
