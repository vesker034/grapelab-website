"use client";

import { useTranslations } from "@/lib/localize";
import RoundedButton from "@/components/RoundedButton";

const COMMUNITY_URL = "https://grapelabstd.ru";

export default function CommunityCTA() {
  const t = useTranslations("Community");

  return (
    <section className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <div
        className="group relative overflow-hidden rounded-[24px] px-6 py-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(88,66,124,0.18)] md:rounded-[36px] md:px-12 md:py-14 lg:px-16 lg:py-16"
        style={{
          background:
            "linear-gradient(var(--color-card-inner-bg), var(--color-card-inner-bg)) padding-box, " +
            "linear-gradient(135deg, rgba(88,66,124,0.96), rgba(119,195,221,0.9)) border-box",
          border: "1.5px solid transparent",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.14),transparent_40%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top_left,rgba(77,212,232,0.08),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(77,212,232,0.04),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.55),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold leading-[1.12] text-[var(--color-primary-text)] md:text-[34px] md:leading-[1.1]">
              {t("finalCta.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
              {t("finalCta.text")}
            </p>
          </div>

          <div className="w-full max-w-[280px] md:flex md:shrink-0 md:justify-end">
            <RoundedButton href={COMMUNITY_URL} className="w-full">
              {t("finalCta.primary")}
            </RoundedButton>
          </div>
        </div>
      </div>
    </section>
  );
}
