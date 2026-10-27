import RoundedButton from "@/components/RoundedButton";
import { getTranslations } from "next-intl/server";

const formatKeys = ["websites", "apps", "games", "special"] as const;
const modelKeys = ["native", "fixed", "performance", "partnership"] as const;
const advantageKeys = ["audience", "control", "production", "reporting"] as const;
const processKeys = ["inventory", "proposal", "launch"] as const;

export default async function Advertising() {
  const t = await getTranslations("Advertising");

  return (
    <div className="pb-20 md:pb-28">
      <section className="mx-auto mt-6 w-[min(1180px,88vw)] md:mt-10">
        <div className="relative overflow-hidden rounded-[36px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-7 shadow-[0_24px_70px_rgba(88,66,124,0.12)] md:px-10 md:py-9 lg:px-14 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.12),transparent_42%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
            <div className="flex flex-col justify-start lg:pr-6">
              <h1 className="max-w-4xl text-3xl font-semibold leading-[1.12] text-[var(--color-primary-text)] md:text-5xl md:leading-[1.08]">
                {t("title")}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted-text)] md:text-[18px]">
                {t("intro")}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-[rgba(88,66,124,0.14)] bg-site px-4 py-2 text-sm text-[var(--color-primary-text)]">
                  {t("heroTags.products")}
                </span>
                <span className="rounded-full border border-[rgba(88,66,124,0.14)] bg-site px-4 py-2 text-sm text-[var(--color-primary-text)]">
                  {t("heroTags.native")}
                </span>
                <span className="rounded-full border border-[rgba(88,66,124,0.14)] bg-site px-4 py-2 text-sm text-[var(--color-primary-text)]">
                  {t("heroTags.analytics")}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <RoundedButton
                  href="/contacts"
                  variant="filled"
                  className="w-full md:w-[320px]"
                >
                  {t("cta.primary")}
                </RoundedButton>
                <RoundedButton
                  href="/portfolio"
                  variant="outlined"
                  className="w-full md:w-[320px]"
                >
                  {t("cta.secondary")}
                </RoundedButton>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="overflow-hidden rounded-[28px] border border-[rgba(88,66,124,0.16)] bg-site p-5 text-[var(--color-primary-text)] shadow-[0_16px_34px_rgba(88,66,124,0.08)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-light-cards-text)]">
                  {t("stats.inventoryLabel")}
                </div>
                <div className="mt-4 text-[21px] font-semibold leading-[1.3] md:text-2xl">
                  {t("stats.inventoryValue")}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
                  {t("stats.inventoryDescription")}
                </p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[rgba(88,66,124,0.16)] bg-site p-5 text-[var(--color-primary-text)] shadow-[0_16px_34px_rgba(88,66,124,0.08)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-light-cards-text)]">
                  {t("stats.modelsLabel")}
                </div>
                <div className="mt-4 text-[21px] font-semibold leading-[1.3] md:text-2xl">
                  {t("stats.modelsValue")}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
                  {t("stats.modelsDescription")}
                </p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-[rgba(88,66,124,0.16)] bg-site p-5 text-[var(--color-primary-text)] shadow-[0_16px_34px_rgba(88,66,124,0.08)]">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-light-cards-text)]">
                  {t("stats.supportLabel")}
                </div>
                <div className="mt-4 text-[21px] font-semibold leading-[1.3] md:text-2xl">
                  {t("stats.supportValue")}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
                  {t("stats.supportDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-14">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-2xl font-semibold text-[var(--color-primary-text)] md:text-[34px]">
            {t("formats.eyebrow")}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {formatKeys.map((key) => (
            <article
              key={key}
              className="group relative flex overflow-hidden rounded-[28px] p-[1.5px] transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(88,66,124,0.18)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[28px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(88,66,124,1)_0deg,rgba(101,80,145,1)_55deg,rgba(119,195,221,1)_140deg,rgba(141,224,239,1)_190deg,rgba(119,195,221,1)_240deg,rgba(101,80,145,1)_305deg,rgba(88,66,124,1)_360deg)] blur-[1px] transition-transform duration-700 ease-linear group-hover:animate-[spin_8s_linear_infinite]"
              />
              <div className="relative flex h-full w-full flex-col rounded-[28px] bg-card-inner p-6">
                <h3 className="text-[22px] font-semibold leading-[1.3] text-[var(--color-primary-text)]">
                  {t(`formats.items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted-text)]">
                  {t(`formats.items.${key}.description`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] md:px-10 md:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,66,124,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(119,195,221,0.14),transparent_36%)]" />
            <div className="relative z-10">
              <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                {t("models.eyebrow")}
              </p>
              <h2 className="mt-3 max-w-[22ch] text-[22px] font-semibold leading-[1.25] text-[var(--color-primary-text)] md:max-w-[24ch] md:text-[30px]">
                {t("models.title")}
              </h2>
              <div className="mt-5 rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site/90 px-5 py-5 shadow-[0_12px_28px_rgba(88,66,124,0.08)] backdrop-blur-sm">
                <p className="text-base leading-7 text-[var(--color-muted-text)]">
                  {t("models.description")}
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                {modelKeys.map((key, index) => (
                  <div
                    key={key}
                    className="group rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site px-5 py-5 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(88,66,124,0.34)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.16),0_12px_28px_rgba(88,66,124,0.08)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(88,66,124,0.08)] text-sm font-semibold text-[var(--color-primary-text)]">
                        0{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-primary-text)]">
                          {t(`models.items.${key}.title`)}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted-text)]">
                          {t(`models.items.${key}.description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] md:px-10 md:py-10">
            <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-[rgba(119,195,221,0.16)] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[rgba(88,66,124,0.14)] blur-3xl" />
            <div className="relative z-10 flex h-full flex-col">
              <div className="rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site/90 px-5 py-5 shadow-[0_12px_28px_rgba(88,66,124,0.08)] backdrop-blur-sm">
                <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                  {t("advantages.eyebrow")}
                </p>
                <h2 className="mt-3 text-[22px] font-semibold leading-[1.25] text-[var(--color-primary-text)] md:text-[30px]">
                  {t("advantages.title")}
                </h2>
                <p className="mt-3 text-base leading-7 text-[var(--color-muted-text)]">
                  {t("advantages.description")}
                </p>
              </div>

              <div className="mt-6 grid flex-1 auto-rows-fr gap-4 md:grid-cols-2">
                {advantageKeys.map((key, index) => (
                  <div
                    key={key}
                    className={`flex h-full flex-col rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site px-5 py-5 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04),0_12px_30px_rgba(88,66,124,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(88,66,124,0.34)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.16),0_16px_34px_rgba(88,66,124,0.1)] ${
                      index % 2 === 1 ? "md:mt-4" : ""
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-[var(--color-primary-text)]">
                      {t(`advantages.items.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted-text)]">
                      {t(`advantages.items.${key}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="group relative overflow-hidden rounded-[32px] p-[1.5px] shadow-[0_20px_48px_rgba(88,66,124,0.1)] transition-transform duration-300 hover:-translate-y-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[32px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(88,66,124,1)_0deg,rgba(101,80,145,1)_55deg,rgba(119,195,221,1)_140deg,rgba(141,224,239,1)_190deg,rgba(119,195,221,1)_240deg,rgba(101,80,145,1)_305deg,rgba(88,66,124,1)_360deg)] blur-[1px]"
          />
          <div className="relative rounded-[32px] bg-card-inner px-6 py-8 md:px-10 md:py-10">
            <div className="max-w-full">
              <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                {t("process.eyebrow")}
              </p>
              <h2 className="mt-3 max-w-full text-2xl font-semibold text-[var(--color-primary-text)] md:text-[34px]">
                {t("process.title")}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {processKeys.map((key, index) => (
                <article
                  key={key}
                  className="rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site px-5 py-5"
                >
                  <div className="inline-flex items-center rounded-full border border-[rgba(88,66,124,0.12)] bg-[rgba(88,66,124,0.04)] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[var(--color-light-cards-text)]">
                    <span className="text-[var(--color-primary-text)]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--color-primary-text)]">
                    {t(`process.items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted-text)]">
                    {t(`process.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="group relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(88,66,124,0.16)] md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.16),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.55),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                {t("finalCta.eyebrow")}
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-[1.16] text-[var(--color-primary-text)] md:text-[34px] md:leading-[1.12]">
                {t("finalCta.title")}
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--color-muted-text)]">
                {t("finalCta.description")}
              </p>
            </div>
            <RoundedButton
              href="/contacts"
              variant="filled"
              className="w-full md:mt-12 md:w-[320px]"
            >
              {t("finalCta.button")}
            </RoundedButton>
          </div>
        </div>
      </section>
    </div>
  );
}
