"use client";

import { useTranslations } from "@/lib/localize";
import grapelogo from "../../public/grapelogo.svg";
import grapelogoNewYear from "../../public/grapelogoNewYear.png";
import { isFeatureEnabled } from "@/features/featureRegistry";

const joinRoles = ["role1", "role2", "role3", "role4", "role5", "role6", "role7"] as const;

export default function CommunityJoin() {
  const t = useTranslations("Community");
  const logoSrc = isFeatureEnabled("newYearLogo")
    ? grapelogoNewYear.src
    : grapelogo.src;

  return (
    <section className="mx-auto mt-14 w-[min(1180px,88vw)] md:mt-20">
      <div className="relative overflow-hidden rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-8 shadow-[0_20px_56px_rgba(88,66,124,0.08)] md:rounded-[34px] md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.10),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(77,212,232,0.07),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(77,212,232,0.03),transparent_38%)]" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16 lg:items-stretch">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold leading-[1.15] text-[var(--color-primary-text)] md:text-[34px]">
            {t("join.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
            {t("join.text")}
          </p>
          <div className="mt-auto hidden items-center justify-start pb-2 pl-4 pt-10 lg:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="GrapeLab"
              className="logo-float-animation icon-dark-mode h-28 w-28 object-contain transform-gpu opacity-70 xl:h-36 xl:w-36"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {joinRoles.map((key, i) => (
            <div
              key={key}
              className="group relative overflow-hidden rounded-[14px] border border-[rgba(88,66,124,0.1)] bg-site px-4 py-3.5 shadow-[inset_0_0_0_1px_rgba(88,66,124,0.04)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[rgba(88,66,124,0.28)] hover:shadow-[inset_0_0_0_1px_rgba(88,66,124,0.10),0_12px_28px_rgba(88,66,124,0.10)]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.12),transparent_42%)]" />
              <div className="pointer-events-none absolute inset-x-4 top-0 h-px -translate-y-2 bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.6),transparent)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
              <div className="relative z-10 flex items-center gap-4 transition-transform duration-500 group-hover:translate-y-[-1px]">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(88,66,124,0.08)] text-[12px] font-semibold text-[var(--color-primary-text)] transition-all duration-300 group-hover:bg-[rgba(88,66,124,0.14)] dark:bg-[rgba(119,195,221,0.12)] dark:group-hover:bg-[rgba(119,195,221,0.20)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium text-[var(--color-primary-text)]">
                {t(`join.${key}`)}
              </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
