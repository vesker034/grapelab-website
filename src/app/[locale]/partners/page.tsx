import PartnersApproachTabs from "@/components/PartnersApproachTabs";
import PartnersBenefitsAccordion from "@/components/PartnersBenefitsAccordion";
import PartnersProcessTimeline from "@/components/PartnersProcessTimeline";
import PartnersWhyStickySection from "@/components/PartnersWhyStickySection";
import RoundedButton from "@/components/RoundedButton";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const formatKeys = [
  "technology",
  "education",
  "research",
  "business",
  "experts",
  "community",
] as const;

const formatNodeDesktopClasses = [
  "left-[7%] top-[6%] w-[284px]",
  "right-[7%] top-[6%] w-[284px]",
  "right-[0%] top-[35%] w-[284px]",
  "right-[7%] bottom-[9%] w-[284px] xl:bottom-[12%]",
  "left-[7%] bottom-[9%] w-[284px] xl:bottom-[12%]",
  "left-[0%] top-[35%] w-[284px]",
] as const;

const formatCardBorderStyle = {
  background:
    "linear-gradient(var(--color-card-inner-bg), var(--color-card-inner-bg)) padding-box, linear-gradient(135deg, rgba(88,66,124,0.96), rgba(119,195,221,0.9)) border-box",
  border: "1.5px solid transparent",
} as const;

const audienceKeys = [
  "itCompanies",
  "startups",
  "business",
  "productTeams",
  "universities",
  "researchGroups",
  "developers",
  "experts",
  "mentors",
  "communities",
] as const;

const proofKeys = ["projects", "formats", "dialogue"] as const;
const heroPillarKeys = ["build", "exchange", "launch"] as const;

export default async function PartnersPage() {
  const t = await getTranslations("Partners");

  return (
    <div className="pb-20 md:pb-28">
      <section className="mx-auto mt-6 w-[min(1180px,88vw)] md:mt-10">
        <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-6 shadow-[0_24px_70px_rgba(88,66,124,0.12)] md:rounded-[36px] md:px-10 md:py-10 lg:rounded-[40px] lg:px-14 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.16),transparent_32%),radial-gradient(circle_at_center_right,rgba(88,66,124,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.22),transparent_48%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.07),transparent_26%),radial-gradient(circle_at_center_right,rgba(124,92,170,0.12),transparent_32%),linear-gradient(135deg,rgba(45,38,64,0.18),transparent_44%)]" />
          <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] xl:items-stretch">
            <div className="flex h-full flex-col xl:pr-6">
              <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-[1.08] text-[var(--color-primary-text)] md:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted-text)] md:text-[18px]">
                {t("intro")}
              </p>

              <div className="mt-auto pt-8">
                <div className="rounded-[20px] border border-[rgba(88,66,124,0.14)] bg-site/85 p-3 shadow-[0_14px_32px_rgba(88,66,124,0.08)] backdrop-blur-sm md:rounded-[28px] md:p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-light-cards-text)]">
                    {t("heroTagsLabel")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {audienceKeys.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(88,66,124,0.12)] bg-site px-3 py-2 text-[13px] font-medium leading-5 text-[var(--color-primary-text)] shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(88,66,124,0.24)] hover:shadow-[0_10px_24px_rgba(88,66,124,0.08)] md:px-5 md:py-3 md:text-[15px]"
                      >
                        <span className="text-[var(--color-light-cards-text)]">#</span>
                        <span>{t(`heroTags.${key}`)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex h-full flex-col">
              <div className="flex h-full flex-col rounded-[20px] border border-[rgba(88,66,124,0.16)] bg-card-inner p-4 shadow-[0_24px_48px_rgba(88,66,124,0.12)] md:rounded-[32px] md:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-full border border-[rgba(88,66,124,0.12)] bg-[rgba(88,66,124,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-light-cards-text)]">
                    {t("heroPanel.badge")}
                  </span>
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(88,66,124,0.2),rgba(119,195,221,0.2),transparent)]" />
                </div>

                <h2 className="mt-5 max-w-[18ch] text-[24px] font-semibold leading-[1.18] text-[var(--color-primary-text)] md:text-[32px]">
                  {t("heroPanel.title")}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted-text)] md:text-[15px]">
                  {t("heroPanel.description")}
                </p>

                <div className="mt-6 grid gap-3">
                  {heroPillarKeys.map((key, index) => (
                    <div
                      key={key}
                      className="flex items-start gap-4 rounded-[22px] border border-[rgba(88,66,124,0.1)] bg-site px-4 py-4 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(88,66,124,0.08)] text-sm font-semibold text-[var(--color-primary-text)]">
                        0{index + 1}
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[var(--color-primary-text)]">
                          {t(`heroPanel.items.${key}.title`)}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-[var(--color-muted-text)]">
                          {t(`heroPanel.items.${key}.description`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto grid gap-3 pt-6 md:grid-cols-2">
                  <RoundedButton
                    href="/contacts"
                    variant="filled"
                    className="w-full"
                  >
                    {t("cta.primary")}
                  </RoundedButton>
                  <RoundedButton
                    href="/portfolio"
                    variant="outlined"
                    className="w-full"
                  >
                    {t("cta.secondary")}
                  </RoundedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnersApproachTabs />

      <PartnersWhyStickySection />

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="mb-10 max-w-3xl dark:hidden lg:dark:block">
          <h2 className="text-2xl font-semibold text-[var(--color-primary-text)] md:text-[34px]">
            {t("formats.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--color-muted-text)]">
            {t("formats.description")}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-6 shadow-[0_20px_60px_rgba(88,66,124,0.1)] md:px-8 md:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(119,195,221,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.1),transparent_30%)]" />

          <div className="relative z-10 grid gap-4 lg:hidden">
            <div className="relative overflow-hidden rounded-[30px] border border-[rgba(88,66,124,0.16)] bg-site px-6 py-6 shadow-[0_18px_40px_rgba(88,66,124,0.08)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(119,195,221,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(88,66,124,0.12),transparent_34%)]" />
              <div className="relative z-10">
                <div className="inline-flex rounded-full border border-[rgba(88,66,124,0.12)] bg-[rgba(88,66,124,0.06)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-light-cards-text)]">
                  GrapeLab
                </div>
                <h3 className="mt-5 text-[28px] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--color-primary-text)]">
                  {t("formats.title")}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted-text)]">
                  {t("formats.description")}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {formatKeys.map((key) => (
                <article
                  key={key}
                  className="rounded-[26px] p-5 shadow-[0_12px_32px_rgba(88,66,124,0.08)] backdrop-blur-sm"
                  style={formatCardBorderStyle}
                >
                  <h3 className="text-xl font-semibold leading-[1.18] tracking-[-0.03em] text-[var(--color-primary-text)]">
                    {t(`formats.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
                    {t(`formats.items.${key}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative z-10 hidden p-2 lg:block lg:h-[940px] xl:h-[1040px] xl:p-4">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1200 860"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M316 174C420 236 488 302 562 392" stroke="rgba(119,195,221,0.34)" strokeWidth="2" />
              <path d="M884 184C786 236 722 306 648 390" stroke="rgba(119,195,221,0.34)" strokeWidth="2" />
              <path d="M302 630C422 596 500 534 566 460" stroke="rgba(101,80,145,0.24)" strokeWidth="2" />
              <path d="M898 636C780 592 706 532 642 458" stroke="rgba(101,80,145,0.24)" strokeWidth="2" />
              <path d="M926 390C824 402 742 410 664 420" stroke="rgba(119,195,221,0.28)" strokeWidth="2" />
              <path d="M274 416C382 418 470 420 536 422" stroke="rgba(119,195,221,0.28)" strokeWidth="2" />
            </svg>

            {formatKeys.map((key, index) => (
              <article
                key={key}
                className={`absolute flex h-[252px] flex-col overflow-hidden rounded-[28px] p-5 shadow-[0_14px_40px_rgba(88,66,124,0.09)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 ${formatNodeDesktopClasses[index]}`}
                style={formatCardBorderStyle}
              >
                <h3 className="text-[23px] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--color-primary-text)]">
                  {t(`formats.items.${key}.title`)}
                </h3>
                <p className="mt-3 overflow-hidden text-sm leading-6 text-[var(--color-muted-text)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                  {t(`formats.items.${key}.description`)}
                </p>
              </article>
            ))}

            <div className="absolute left-1/2 top-1/2 z-20 flex h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <Image
                src="/grapelogo.svg"
                alt="GrapeLab"
                width={168}
                height={168}
                className="logo-float-animation icon-dark-mode relative z-10 h-36 w-36 object-contain transform-gpu xl:h-[168px] xl:w-[168px]"
              />
            </div>
          </div>
        </div>
      </section>

      <PartnersBenefitsAccordion />

      <PartnersProcessTimeline />

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] md:px-10 md:py-10">
            <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-[rgba(119,195,221,0.16)] blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[rgba(88,66,124,0.14)] blur-3xl" />
            <div className="relative z-10 flex h-full flex-col">
              <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
                {t("trust.eyebrow")}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-primary-text)] md:text-[34px]">
                {t("trust.title")}
              </h2>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {proofKeys.map((key) => (
                  <div
                    key={key}
                    className="group relative h-full overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.14)] bg-site px-5 py-5 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(88,66,124,0.3)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.12),0_16px_34px_rgba(88,66,124,0.1)] md:px-6 md:py-6"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.14),transparent_40%)]" />
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px -translate-y-2 bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.7),rgba(88,66,124,0.5),transparent)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />

                    <div className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-2px]">
                      <div className="text-xl font-semibold text-[var(--color-primary-text)]">
                        {t(`trust.items.${key}.value`)}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-muted-text)]">
                        {t(`trust.items.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1180px,88vw)] md:mt-16">
        <div className="group relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(88,66,124,0.16)] md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.16),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.55),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold leading-[1.16] text-[var(--color-primary-text)] md:text-[34px] md:leading-[1.12]">
                {t("finalCta.title")}
              </h2>
            </div>

            <div className="w-full max-w-[360px] md:flex md:justify-end">
              <RoundedButton href="/contacts" className="w-full">
                {t("finalCta.button")}
              </RoundedButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
