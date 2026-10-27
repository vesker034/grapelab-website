"use client";

import { useTranslations } from "@/lib/localize";

const benefitItems = ["item1", "item2", "item3", "item4", "item5", "item6"] as const;

export default function CommunityBenefits() {
  const t = useTranslations("Community");

  return (
    <section className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <div className="mb-8 md:mb-10">
        <h2 className="text-2xl font-semibold leading-[1.15] text-[var(--color-primary-text)] md:text-[34px]">
          {t("benefits.title")}
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {benefitItems.map((key, i) => (
          <article
            key={key}
            className={`group relative flex overflow-hidden rounded-[24px] p-[1.5px] transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(88,66,124,0.18)] ${
              i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[24px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(88,66,124,1)_0deg,rgba(101,80,145,1)_55deg,rgba(119,195,221,1)_140deg,rgba(141,224,239,1)_190deg,rgba(119,195,221,1)_240deg,rgba(101,80,145,1)_305deg,rgba(88,66,124,1)_360deg)] blur-[1px] transition-transform duration-700 ease-linear group-hover:animate-[spin_8s_linear_infinite]"
            />

            <div className="relative flex h-full w-full flex-col rounded-[24px] bg-card-inner p-5 md:p-6">
              <span className="text-[32px] font-light leading-none text-[rgba(88,66,124,0.2)] dark:text-[rgba(255,255,255,0.18)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[15px] font-medium leading-[1.5] text-[var(--color-primary-text)]">
                {t(`benefits.${key}`)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
