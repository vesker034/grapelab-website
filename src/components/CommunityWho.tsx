"use client";

import { useTranslations } from "@/lib/localize";

const roles = [
  "role1", "role2", "role3", "role4", "role5",
  "role6", "role7", "role8", "role9", "role13",
  "role11", "role12", "role10",
] as const;

export default function CommunityWho() {
  const t = useTranslations("Community");

  return (
    <section className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.12)] bg-card-inner px-5 py-8 shadow-[0_12px_40px_rgba(88,66,124,0.07)] md:rounded-[32px] md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(119,195,221,0.16),transparent_34%),radial-gradient(circle_at_bottom,rgba(88,66,124,0.14),transparent_36%)] dark:bg-[radial-gradient(circle_at_top,rgba(77,212,232,0.07),transparent_30%),radial-gradient(circle_at_bottom,rgba(77,212,232,0.04),transparent_34%)] md:rounded-[32px]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold leading-[1.15] text-[var(--color-primary-text)] md:text-[34px]">
              {t("who.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
              {t("who.text")}
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-2 content-start lg:h-full lg:self-stretch lg:content-between">
            {roles.map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(88,66,124,0.12)] bg-site px-3 py-2 text-[13px] font-medium text-[var(--color-primary-text)] shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(88,66,124,0.24)] hover:shadow-[0_6px_16px_rgba(88,66,124,0.08)] dark:border-[rgba(255,255,255,0.12)] dark:shadow-none md:px-4 md:py-2.5 md:text-[14px]"
              >
                <span className="text-[var(--color-light-cards-text)]">#</span>
                {t(`who.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
