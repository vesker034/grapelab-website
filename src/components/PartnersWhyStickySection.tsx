"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const principleKeys = [
  "practicalWork",
  "collaboration",
  "results",
  "environment",
] as const;

const accentLineClasses = [
  "bg-[var(--color-light-cards-text)]",
  "bg-[var(--color-buttons)]",
  "bg-[rgba(141,224,239,1)]",
  "bg-[rgba(101,80,145,1)]",
] as const;

export default function PartnersWhyStickySection() {
  const t = useTranslations("Partners");
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const autoplayIntervalRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);

  const principles = principleKeys.map((key, index) => ({
    key,
    number: `0${index + 1}`,
    title: t(`why.items.${key}.title`),
    text: t(`why.items.${key}.description`),
    card: t(`why.cards.${key}`),
    accentLineClass: accentLineClasses[index],
  }));

  const active = principles[activeIndex];

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      window.clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) return;
    autoplayIntervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % principles.length);
    }, 6200);
  }, [principles.length]);

  const resetAutoplay = useCallback(() => {
    stopAutoplay();
    startAutoplay();
  }, [stopAutoplay, startAutoplay]);

  const changeSlide = (direction: number) => {
    setActiveIndex((prev) => {
      if (direction > 0) return Math.min(prev + 1, principles.length - 1);
      if (direction < 0) return Math.max(prev - 1, 0);
      return prev;
    });
    resetAutoplay();
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      stopAutoplay();
    };
  }, [principles.length, stopAutoplay, startAutoplay]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const endY = event.changedTouches[0]?.clientY ?? 0;
    const diff = touchStartYRef.current - endY;

    if (Math.abs(diff) < 40) return;
    changeSlide(diff > 0 ? 1 : -1);
  };

  return (
    <section
      ref={sectionRef}
      className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-8">
        <div className="lg:sticky lg:top-8 lg:h-[640px]">
          <div className="relative h-full overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-6 shadow-[0_20px_48px_rgba(88,66,124,0.1)] md:rounded-[34px] md:px-10 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(119,195,221,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(119,195,221,0.08),transparent_30%)] dark:bg-none" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <h2 className="max-w-[20ch] text-2xl font-semibold leading-[1.08] text-[var(--color-primary-text)] md:text-[34px]">
                  {t("why.title")}
                </h2>
                <p className="mt-6 max-w-[34rem] text-base leading-8 text-[var(--color-muted-text)] md:text-[18px]">
                  {t("why.description")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-8 md:max-w-[440px]">
                {principles.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-[16px] border border-[rgba(88,66,124,0.12)] bg-site p-3 md:rounded-[20px] md:p-4"
                  >
                    <div className="text-[12px] font-semibold text-[var(--color-light-cards-text)]">
                      {item.number}
                    </div>
                    <div className="mt-2 text-[14px] leading-5 text-[var(--color-muted-text)]">
                      {item.card}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-card-inner px-5 py-4 shadow-[0_10px_24px_rgba(88,66,124,0.05)]">
            <span className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
              {t("why.panelHint")}
            </span>
            <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-light-cards-text)]">
              {active.number} / 04
            </span>
          </div>

          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[460px] overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner p-2 shadow-[0_16px_38px_rgba(88,66,124,0.08)] sm:rounded-[30px] md:h-[520px] md:p-3"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.1),transparent_32%)]" />

            <AnimatePresence mode="wait">
              <motion.article
                key={active.number}
                initial={{ opacity: 0, y: 90 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -90 }}
                transition={{ duration: 0.42, ease: "easeInOut" }}
                className="absolute inset-2 flex h-[calc(100%-1rem)] flex-col rounded-[22px] border border-[rgba(88,66,124,0.14)] bg-site p-4 shadow-[0_12px_28px_rgba(88,66,124,0.06)] sm:rounded-[28px] sm:p-6 md:inset-3 md:h-[calc(100%-1.5rem)] md:p-8"
              >
                <div className="max-w-[560px]">
                  <h3 className="text-[20px] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--color-primary-text)] sm:text-[26px] md:text-[42px]">
                    {active.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-6 text-[var(--color-muted-text)] sm:mt-5 sm:text-[16px] sm:leading-7 md:text-[20px] md:leading-8">
                    {active.text}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-4 pt-4 rtl:flex-row-reverse sm:pt-8 md:pt-10">
                  <div
                    className={`h-[2px] flex-1 rounded-full ${active.accentLineClass}`}
                  />
                  <Image
                    src="/grapelogo.svg"
                    alt="GrapeLab"
                    width={52}
                    height={52}
                    className="icon-dark-mode h-10 w-10 shrink-0 object-contain opacity-85 md:h-12 md:w-12"
                  />
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            {principles.map((item, index) => (
              <button
                key={item.number}
                type="button"
                onClick={() => { setActiveIndex(index); resetAutoplay(); }}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-[var(--color-light-cards-text)]"
                    : "bg-[rgba(88,66,124,0.14)]"
                }`}
                aria-label={`${t("why.principleLabel")} ${item.number}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
