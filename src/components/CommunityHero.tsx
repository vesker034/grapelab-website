"use client";

import { useTranslations } from "@/lib/localize";
import RoundedButton from "@/components/RoundedButton";
import SlidingButton from "@/components/SlidingButton";

const COMMUNITY_URL = "https://grapelabstd.ru";

export default function CommunityHero() {
  const t = useTranslations("Community");
  const points = ["pillar1", "pillar2", "pillar3", "pillar4"] as const;

  return (
    <section className="mx-auto mt-6 w-[min(1180px,88vw)] md:mt-10">
      <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-10 shadow-[0_24px_70px_rgba(88,66,124,0.12)] md:rounded-[36px] md:px-10 md:py-14 lg:rounded-[40px] lg:px-14 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(77,212,232,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(77,212,232,0.04),transparent_34%),linear-gradient(135deg,rgba(37,39,41,0.16),transparent_46%)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div className="max-w-2xl flex-1">
            <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 text-[26px] font-semibold leading-[1.1] text-[var(--color-primary-text)] md:text-[34px] lg:text-[38px]">
              {t("title")}
            </h1>
            <p className="mt-6 text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
              {t("intro1")}
            </p>
            <p className="mt-3 text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
              {t("intro2")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="w-fit">
                <RoundedButton href={COMMUNITY_URL}>
                  {t("cta.primary")}
                </RoundedButton>
              </div>
              <SlidingButton href="#community-about" className="ml-0 rtl:mr-0">
                {t("cta.secondary")}
              </SlidingButton>
            </div>
          </div>

          <div className="flex items-start lg:justify-end">
            <div className="w-full max-w-[440px] rounded-[28px] border border-[rgba(88,66,124,0.14)] bg-white/86 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:bg-[rgba(37,39,41,0.92)] md:rounded-[32px] md:p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-light-cards-text)]">
                {t("heroSide.label")}
              </div>

              <div className="mt-5 space-y-3">
                {points.map((key) => (
                  <div
                    key={key}
                    className="group relative overflow-hidden rounded-[20px] border border-[rgba(88,66,124,0.1)] bg-site px-4 py-4 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(88,66,124,0.28)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.10),0_16px_34px_rgba(88,66,124,0.1)]"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.14),transparent_40%)]" />
                    <div className="pointer-events-none absolute inset-x-5 top-0 h-px -translate-y-2 bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.6),transparent)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />

                    <div className="relative z-10 flex items-start gap-4 transition-transform duration-500 group-hover:translate-y-[-2px]">
                      <div className="mt-[10px] h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-light-cards-text)]" />
                      <div className="text-[15px] leading-7 text-[var(--color-primary-text)] md:text-[17px]">
                        {t(`about.${key}`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[22px] border border-[rgba(88,66,124,0.1)] bg-site px-4 py-4 text-[14px] leading-6 text-[var(--color-muted-text)] shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] md:text-[15px] md:leading-7">
                {t("heroSide.note")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
