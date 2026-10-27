"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

const benefitKeys = [
  "projects",
  "expertise",
  "testing",
  "knowledge",
  "initiatives",
  "growth",
] as const;

export default function PartnersBenefitsAccordion() {
  const t = useTranslations("Partners");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const items = benefitKeys.map((key, index) => ({
    key,
    number: `0${index + 1}`,
    title: t(`benefits.items.${key}.title`),
    text: t(`benefits.items.${key}.description`),
  }));

  return (
    <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
      <div className="rounded-[24px] border border-[#d9d4e3] bg-card-inner dark:border-[rgba(88,66,124,0.22)] px-4 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] md:rounded-[34px] md:px-10 md:py-10">
        <div className="max-w-[1100px]">
          <p className="text-[14px] font-medium tracking-[0.08em] text-[var(--color-light-cards-text)]">
            {t("benefits.eyebrow")}
          </p>
          <h2 className="mt-3 max-w-[940px] text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-primary-text)] md:text-[34px]">
            {t("benefits.title")}
          </h2>
        </div>

        <div className="mt-8 space-y-4">
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const panelId = `partners-benefits-panel-${item.key}`;

            return (
              <div
                key={item.key}
                className={`group rounded-[28px] transition-[box-shadow,transform,border-color] duration-300 ${
                  isActive
                    ? "bg-[linear-gradient(135deg,rgba(88,66,124,0.98),rgba(101,80,145,0.96),rgba(119,195,221,0.92),rgba(141,224,239,0.9))] p-[1.5px] shadow-[0_18px_36px_rgba(88,66,124,0.16)]"
                    : "border border-[rgba(221,216,231,0.95)] dark:border-[rgba(88,66,124,0.22)] hover:-translate-y-0.5 hover:border-[rgba(88,66,124,0.34)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.12),0_12px_28px_rgba(88,66,124,0.08)]"
                }`}
              >
                <div
                  className={`overflow-hidden ${
                    isActive
                      ? "rounded-[26.5px] bg-card-inner"
                      : "rounded-[28px] bg-site"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5 md:px-7 md:py-6 rtl:text-right"
                  >
                    <div className="flex items-start gap-4 md:gap-5 rtl:flex-row-reverse">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold ${
                          isActive
                            ? "border-[rgba(88,66,124,0.22)] bg-[rgba(88,66,124,0.08)] text-[var(--color-primary-text)]"
                            : "border-[rgba(229,225,236,0.98)] bg-site dark:border-[rgba(88,66,124,0.22)] text-[#a7afbd] group-hover:border-[rgba(88,66,124,0.18)] group-hover:bg-[rgba(88,66,124,0.06)] group-hover:text-[var(--color-primary-text)]"
                        }`}
                      >
                        {item.number}
                      </div>

                      <div className="max-w-[54rem]">
                        <div className="text-[16px] font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--color-primary-text)] md:text-[18px]">
                          {item.title}
                        </div>
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[20px] transition-all ${
                        isActive
                          ? "border-[rgba(88,66,124,0.22)] bg-[rgba(88,66,124,0.08)] text-[var(--color-primary-text)]"
                          : "border-[rgba(229,225,236,0.98)] bg-site dark:border-[rgba(88,66,124,0.22)] text-[#a7afbd] group-hover:border-[rgba(88,66,124,0.18)] group-hover:bg-[rgba(88,66,124,0.06)] group-hover:text-[var(--color-primary-text)]"
                      }`}
                    >
                      {isActive ? "−" : "+"}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={panelId}
                        key={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      >
                        <div className="border-t border-[rgba(235,231,240,0.92)] dark:border-[rgba(88,66,124,0.2)] px-5 pb-6 pt-5 md:px-7 md:pb-7 md:pt-6">
                          <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site p-5 shadow-[0_12px_28px_rgba(88,66,124,0.06)] md:p-6">
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.12),transparent_38%)]" />
                            <div className="relative z-10">
                              <div className="max-w-[56rem] text-[18px] leading-8 text-[var(--color-muted-text)] md:text-[20px]">
                                {item.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
