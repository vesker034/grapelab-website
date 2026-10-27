import type { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
}

export default function PageHero({
  title,
  description,
  eyebrow,
  children,
}: PageHeroProps) {
  return (
    <section className="mx-auto mt-6 w-[min(1180px,88vw)] md:mt-10">
      <div className="relative overflow-hidden rounded-[36px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-7 shadow-[0_24px_70px_rgba(88,66,124,0.12)] md:px-10 md:py-9 lg:px-14 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(88,66,124,0.12),transparent_42%)]" />
        <div className="relative z-10">
          {eyebrow ? (
            <p className="text-sm tracking-[0.08em] text-[var(--color-light-cards-text)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={`max-w-4xl text-3xl font-semibold leading-tight text-[var(--color-primary-text)] md:text-5xl md:leading-[1.02] ${
              eyebrow ? "mt-4" : ""
            }`}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-muted-text)] md:text-[18px]">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
