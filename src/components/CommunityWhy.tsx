"use client";

import { useTranslations } from "@/lib/localize";
import grapelogo from "../../public/grapelogo.svg";
import grapelogoNewYear from "../../public/grapelogoNewYear.png";
import { isFeatureEnabled } from "@/features/featureRegistry";

export default function CommunityWhy() {
  const t = useTranslations("Community");
  const logoSrc = isFeatureEnabled("newYearLogo")
    ? grapelogoNewYear.src
    : grapelogo.src;

  return (
    <section className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.18)] bg-card-inner px-6 py-10 shadow-[0_16px_48px_rgba(88,66,124,0.10)] md:rounded-[32px] md:px-12 md:py-14 lg:px-16 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(88,66,124,0.16),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(119,195,221,0.10),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(77,212,232,0.07),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(77,212,232,0.05),transparent_50%)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:gap-8 xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-10">
          <div className="max-w-[760px] text-left">
            <h2 className="text-2xl font-semibold leading-[1.15] text-[var(--color-primary-text)] md:text-[34px]">
              {t("why.title")}
            </h2>
            <p className="mt-6 text-base leading-8 text-[var(--color-muted-text)] md:text-[17px]">
              {t("why.text1")}
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--color-muted-text)] md:text-[17px]">
              {t("why.text2")}
            </p>
          </div>

          <div className="flex justify-center lg:justify-center lg:self-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="GrapeLab"
              className="logo-float-animation icon-dark-mode h-28 w-28 object-contain transform-gpu sm:h-32 sm:w-32 md:h-36 md:w-36 xl:h-40 xl:w-40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
