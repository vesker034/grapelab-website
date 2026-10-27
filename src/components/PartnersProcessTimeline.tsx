import { useTranslations } from "next-intl";

const processKeys = ["idea", "alignment", "format", "launch"] as const;

export default function PartnersProcessTimeline() {
  const t = useTranslations("Partners");

  const steps = processKeys.map((key, index) => ({
    key,
    number: `0${index + 1}`,
    title: t(`process.items.${key}.title`),
    text: t(`process.items.${key}.description`),
  }));

  return (
    <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
      <div className="relative rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-4 py-5 shadow-[0_18px_44px_rgba(88,66,124,0.1)] md:rounded-[34px] md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.12),transparent_34%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-8">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="relative overflow-hidden rounded-[20px] border border-[rgba(88,66,124,0.14)] bg-site p-5 shadow-[0_18px_38px_rgba(88,66,124,0.08)] md:rounded-[30px] md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.12),transparent_38%)]" />
              <div className="relative z-10">
                <p className="text-[14px] font-medium tracking-[0.08em] text-[var(--color-light-cards-text)]">
                  {t("process.eyebrow")}
                </p>
                <h2 className="mt-3 max-w-[28rem] text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-primary-text)] md:text-[34px]">
                  {t("process.title")}
                </h2>
                <p className="mt-5 max-w-[34rem] text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
                  {t("process.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute bottom-6 left-[23px] top-6 w-px bg-[linear-gradient(180deg,rgba(88,66,124,0.44),rgba(119,195,221,0.28),rgba(88,66,124,0.12))] rtl:left-auto rtl:right-[23px]" />

            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.key}
                  className="group relative pl-16 rtl:pl-0 rtl:pr-16"
                >
                  <div className="absolute left-0 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(88,66,124,0.16)] bg-site text-[13px] font-semibold tracking-[0.12em] text-[var(--color-primary-text)] shadow-[0_10px_24px_rgba(88,66,124,0.08)] rtl:left-auto rtl:right-0">
                    {step.number}
                  </div>

                  <article className="rounded-[28px] border border-[rgba(88,66,124,0.14)] bg-site p-5 shadow-[0_10px_24px_rgba(88,66,124,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(88,66,124,0.24)] hover:shadow-[0_16px_32px_rgba(88,66,124,0.08)] md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <h3 className="max-w-[38rem] text-[17px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-primary-text)] sm:text-[20px] md:text-[26px]">
                        {step.title}
                      </h3>
                      <div className="hidden text-[30px] font-semibold leading-none tracking-[-0.05em] text-[rgba(88,66,124,0.16)] dark:text-[rgba(255,255,255,0.18)] sm:block md:text-[42px]">
                        {step.number}
                      </div>
                    </div>

                    <p className="mt-4 max-w-[42rem] text-[15px] leading-7 text-[var(--color-muted-text)] md:text-[17px]">
                      {step.text}
                    </p>

                    <div className="mt-5 h-px w-12 bg-[linear-gradient(90deg,rgba(88,66,124,0.72),rgba(119,195,221,0.44))]" />
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
