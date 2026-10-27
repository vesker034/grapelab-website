"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const proofKeys = ["projects", "formats", "dialogue"] as const;

const accentClasses = [
  "bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.14),transparent_42%)]",
  "bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.12),transparent_42%)]",
  "bg-[radial-gradient(circle_at_bottom_right,rgba(119,195,221,0.12),transparent_42%)]",
] as const;

export default function PartnersApproachTabs() {
  const t = useTranslations("Partners");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = proofKeys.map((key, index) => ({
    key,
    number: `0${index + 1}`,
    tag: t(`heroProof.${key}.label`),
    title: t(`heroProof.${key}.value`),
    text: t(`heroProof.${key}.description`),
    accentClass: accentClasses[index],
  }));

  const current = items[activeIndex];

  return (
    <section className="mx-auto mt-8 w-[min(1180px,88vw)] md:mt-10">
      <div className="rounded-[20px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-4 py-5 shadow-[0_20px_48px_rgba(88,66,124,0.1)] sm:rounded-[26px] sm:px-5 md:rounded-[34px] md:px-10 md:py-10">
        <div className="max-w-[1120px]">
          <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
            {t("heroProofSection.eyebrow")}
          </p>
          <h2 className="mt-3 max-w-none text-2xl font-semibold text-[var(--color-primary-text)] md:max-w-[940px] md:text-[34px]">
            {t("heroProofSection.title")}
          </h2>
        </div>

        <div className="mt-8 grid gap-5 px-2 sm:px-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <article
            className={`relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-card-inner p-5 shadow-[0_16px_34px_rgba(88,66,124,0.08)] sm:p-6 md:rounded-[28px] md:p-8 ${current.accentClass}`}
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex min-h-[140px] items-center sm:min-h-[180px] md:min-h-[260px]">
                <p className="max-w-[34rem] text-[14px] leading-6 text-[var(--color-muted-text)] sm:text-[17px] sm:leading-8 md:text-[20px]">
                  {current.text}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-10">
                <div className="text-[42px] font-semibold leading-none tracking-[-0.06em] text-[rgba(88,66,124,0.14)] dark:text-[rgba(255,255,255,0.18)] sm:text-[56px] md:text-[88px]">
                  {current.number}
                </div>
                <div className="h-[2px] w-14 bg-[var(--color-light-cards-text)] sm:w-20" />
              </div>
            </div>
          </article>

          <div className="rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site p-5 shadow-[0_16px_34px_rgba(88,66,124,0.06)] sm:p-6 md:rounded-[28px] md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[rgba(88,66,124,0.12)] bg-[rgba(88,66,124,0.06)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-light-cards-text)] sm:text-[11px]">
                {t("heroProofSection.sideLabel")}
              </span>
              <span className="h-px min-w-[80px] flex-1 bg-[linear-gradient(90deg,rgba(88,66,124,0.2),rgba(119,195,221,0.2),transparent)]" />
            </div>
            <div className="mt-6 space-y-4">
              {items.map((item, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`w-full rounded-[20px] border p-4 text-left transition-all duration-300 sm:rounded-[22px] sm:p-5 ${
                      isActive
                        ? "border-[rgba(119,195,221,0.34)] bg-site shadow-[0_10px_24px_rgba(119,195,221,0.14)]"
                        : "border-[rgba(88,66,124,0.1)] bg-card-inner hover:border-[rgba(119,195,221,0.22)]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-light-cards-text)] sm:text-[11px]">
                          {item.tag}
                        </div>
                        <div className="mt-3 max-w-none text-base font-semibold leading-[1.25] text-[var(--color-primary-text)] sm:max-w-[320px]">
                          {item.title}
                        </div>
                      </div>
                      <div
                        className={`shrink-0 text-[28px] font-semibold leading-none tracking-[-0.05em] sm:text-[34px] ${
                          isActive
                            ? "text-[var(--color-light-cards-text)]"
                            : "text-[rgba(88,66,124,0.14)] dark:text-[rgba(255,255,255,0.18)]"
                        }`}
                      >
                        {item.number}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
