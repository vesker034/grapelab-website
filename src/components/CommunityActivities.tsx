"use client";

import { useTranslations } from "@/lib/localize";

const activityRow1 = [
  "item1", "item2", "item3", "item4", "item5",
] as const;

const activityRow2 = [
  "item6", "item7", "item8", "item9", "item5",
] as const;

const marqueeCopies = [0, 1, 2, 3] as const;

export default function CommunityActivities() {
  const t = useTranslations("Community");
  const marqueeRowClass =
    "flex min-w-max items-center transform-gpu will-change-transform motion-safe:animate-[marquee_72s_linear_infinite]";
  const marqueeRowReverseClass =
    "flex min-w-max items-center transform-gpu will-change-transform motion-safe:animate-[marqueeReverse_80s_linear_infinite]";
  const marqueeGroupClass = "flex shrink-0 items-center gap-3 pr-3 md:gap-4 md:pr-4";

  return (
    <section className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-25%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-25%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div>
        <h2 className="text-2xl font-semibold leading-[1.15] text-[var(--color-primary-text)] md:text-[34px]">
          {t("activities.title")}
        </h2>
      </div>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-card-inner py-5 shadow-[0_12px_32px_rgba(88,66,124,0.06)] dark:border-[rgba(255,255,255,0.10)] md:rounded-[28px] md:py-7">
        <div className="overflow-hidden">
          <div className={marqueeRowClass}>
            {marqueeCopies.map((copyIndex) => (
              <div key={copyIndex} className={marqueeGroupClass}>
                {activityRow1.map((key, index) => (
                  <div
                    key={`${copyIndex}-${key}-${index}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(88,66,124,0.12)] bg-site px-4 py-3 text-[14px] font-medium leading-none text-[var(--color-primary-text)] shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] md:px-5 md:py-4 md:text-[16px]"
                  >
                    <span className="text-[var(--color-light-cards-text)]">#</span>
                    {t(`activities.${key}`)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden md:mt-5">
          <div className={marqueeRowReverseClass}>
            {marqueeCopies.map((copyIndex) => (
              <div key={copyIndex} className={marqueeGroupClass}>
                {activityRow2.map((key, index) => (
                  <div
                    key={`${copyIndex}-${key}-reverse-${index}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(88,66,124,0.12)] bg-site px-4 py-3 text-[14px] font-medium leading-none text-[var(--color-primary-text)] shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] md:px-5 md:py-4 md:text-[16px]"
                  >
                    <span className="text-[var(--color-light-cards-text)]">#</span>
                    {t(`activities.${key}`)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
