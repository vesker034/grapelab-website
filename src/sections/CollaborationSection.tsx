"use client";

import { useTranslations } from "@/lib/localize";
import RoundedButton from "../components/RoundedButton";

const Collaboration = () => {
  const t = useTranslations("CollaborationSection");

  return (
    <section className="mx-auto mt-10 w-[min(1180px,88vw)] pb-16 md:mt-16 md:pb-20">
      <div className="group relative overflow-hidden rounded-[32px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-8 shadow-[0_20px_48px_rgba(88,66,124,0.1)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_58px_rgba(88,66,124,0.16)] md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.16),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(119,195,221,0.65),rgba(88,66,124,0.55),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold leading-[1.16] text-[var(--color-primary-text)] mb-8 md:text-[34px] md:leading-[1.12]">
            {t("title")}
          </h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <RoundedButton href="/contacts" variant="filled" className="w-full sm:w-auto">
              {t("button_joinTeam")}
            </RoundedButton>
            <RoundedButton href="/contacts" variant="outlined" className="w-full sm:w-auto">
              {t("button_discussProject")}
            </RoundedButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
