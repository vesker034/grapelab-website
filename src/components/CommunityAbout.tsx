"use client";

import { useTranslations } from "@/lib/localize";

export default function CommunityAbout() {
  const t = useTranslations("Community");
  const pillars = [
    { key: "pillar1", number: "01", className: "sm:col-span-2" },
    { key: "pillar2", number: "02", className: "" },
    { key: "pillar3", number: "03", className: "" },
    { key: "pillar4", number: "04", className: "sm:col-span-2" },
  ] as const;

  return (
    <section id="community-about" className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <div className="relative rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-6 shadow-[0_20px_56px_rgba(88,66,124,0.08)] md:rounded-[34px] md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.1),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(77,212,232,0.06),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(77,212,232,0.03),transparent_36%)] md:rounded-[34px]" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:items-start">
          <div className="lg:order-2 lg:sticky lg:top-8 lg:self-start">
            <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.1)] bg-site p-5 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] md:rounded-[30px] md:p-6 lg:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.10),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.12),transparent_54%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(77,212,232,0.07),transparent_34%),linear-gradient(145deg,rgba(37,39,41,0.10),transparent_56%)]" />

              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-light-cards-text)]">
                  {t("eyebrow")}
                </p>
                <h2 className="mt-4 text-2xl font-semibold leading-[1.15] text-[var(--color-primary-text)] md:text-[34px]">
                  {t("about.title")}
                </h2>
                <p className="mt-5 text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
                  {t("about.text")}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:order-1">
            <div className="w-full rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-white/82 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm dark:bg-[rgba(37,39,41,0.92)] md:rounded-[30px] md:p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-light-cards-text)]">
                {t("about.panelLabel")}
              </div>

              <div className="mt-4 rounded-[22px] border border-[rgba(88,66,124,0.1)] bg-site px-4 py-5 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] md:rounded-[26px] md:px-5 md:py-6">
                <p className="text-[20px] font-semibold leading-[1.2] text-[var(--color-primary-text)] md:text-[24px] md:leading-[1.18]">
                  {t("about.manifesto")}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.key}
                    className={`group relative overflow-hidden rounded-[20px] border border-[rgba(88,66,124,0.1)] bg-site px-4 py-4 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(88,66,124,0.24)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.10),0_16px_36px_rgba(88,66,124,0.10)] md:px-5 md:py-5 ${pillar.className}`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.12),transparent_42%)]" />

                    <div className="relative z-10">
                      <span className="block text-[26px] font-semibold leading-none tracking-[-0.05em] text-[rgba(88,66,124,0.18)] dark:text-[rgba(255,255,255,0.18)] md:text-[30px]">
                        {pillar.number}
                      </span>
                      <p className="mt-3 text-[15px] font-medium leading-[1.45] text-[var(--color-primary-text)] md:text-[16px]">
                        {t(`about.${pillar.key}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
