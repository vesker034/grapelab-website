"use client";

import TranslatedText from "@/components/TranslatedText";
import AnimatedCounter from "@/components/AnimatedCounter";

interface ServicesMetricsProps {
  servicesCount: number;
  featuresCount: number;
}

export default function ServicesMetrics({
  servicesCount,
  featuresCount,
}: ServicesMetricsProps) {
  return (
    <>
      <div className="rounded-[28px] border border-[rgba(88,66,124,0.16)] bg-site p-5 shadow-[0_16px_34px_rgba(88,66,124,0.08)]">
        <div className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted-text)]">
          <TranslatedText namespace={"Services"} keyText={"metrics.services"} />
        </div>
        <div className="mt-3 text-4xl font-semibold text-[var(--color-navbar)]">
          <AnimatedCounter end={servicesCount} />
        </div>
      </div>
      <div className="rounded-[28px] border border-[rgba(88,66,124,0.16)] bg-site p-5 shadow-[0_16px_34px_rgba(88,66,124,0.08)]">
        <div className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted-text)]">
          <TranslatedText namespace={"Services"} keyText={"metrics.features"} />
        </div>
        <div className="mt-3 text-4xl font-semibold text-[var(--color-navbar)]">
          <AnimatedCounter end={featuresCount} />
        </div>
      </div>
    </>
  );
}
