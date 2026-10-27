"use client";

import clsx from "clsx";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  tag?: string;
  description?: string;
  descriptionList: string[];
  image?: string;
  index: number;
  highlight?: string;
  studioLabel: string;
  scopeLabel: string;
  deliverablesLabel: string;
}

const ServiceCard = ({
  title,
  tag,
  description,
  descriptionList,
  image,
  index,
  highlight,
  studioLabel,
  scopeLabel,
  deliverablesLabel,
}: ServiceCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <article className="group relative isolate overflow-hidden rounded-[32px] bg-card-inner shadow-[0_24px_60px_rgba(88,66,124,0.12)] [clip-path:inset(0_round_32px)] [transform:translateZ(0)] transition-transform duration-500 hover:-translate-y-1 after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[32px] after:shadow-[inset_0_0_0_1.5px_rgba(88,66,124,0.24)]">
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-[linear-gradient(90deg,rgba(119,195,221,0),rgba(119,195,221,0.95),rgba(88,66,124,0))]" />
      <div
        className={clsx(
          "grid gap-0 lg:min-h-[540px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
          !isEven && "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        )}
      >
        <div
          className={clsx(
            "relative min-h-[260px] overflow-hidden",
            !isEven && "lg:order-2"
          )}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#7bc8df_0%,#5c4682_100%)]" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,7,16,0.06)_0%,rgba(11,7,16,0.55)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_44%)]" />

          {tag ? (
            <div className="absolute left-6 top-6 text-white md:left-8 md:top-8">
              <span className="text-xs font-semibold tracking-[0.04em] text-white md:text-sm">
                {tag}
              </span>
            </div>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
            <div className="max-w-xl rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,rgba(8,6,13,0.08),rgba(8,6,13,0.38))] p-5 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold leading-tight md:text-[34px]">
                {title}
              </h2>
              {highlight ? (
                <p className="mt-3 text-sm leading-6 text-white/82 md:text-base">
                  {highlight}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "relative flex flex-col justify-between bg-card-inner p-6 md:p-8 lg:p-10",
            !isEven && "lg:order-1"
          )}
        >
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[rgba(119,195,221,0.18)] blur-3xl" />
          <div className="relative z-10">
            {description ? (
              <p className="max-w-2xl text-base leading-7 text-[var(--color-muted-text)] md:text-[17px]">
                {description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {descriptionList.map((item, featureIndex) => (
                <div
                  key={`${title}-${featureIndex}`}
                  className="inline-flex items-start gap-3 rounded-[20px] border border-[rgba(88,66,124,0.16)] bg-site px-4 py-3 text-sm leading-6 text-[var(--color-primary-text)] shadow-[0_10px_24px_rgba(88,66,124,0.08)] md:text-[15px]"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-light-cards-text)] shadow-[0_0_0_5px_rgba(119,195,221,0.16)]" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          </div>

          <div
            className={clsx(
              "relative z-10 mt-8 grid gap-4 border-t border-[rgba(88,66,124,0.12)] pt-6 text-[13px] uppercase tracking-[0.18em] text-[var(--color-muted-text)]",
              tag ? "md:grid-cols-2" : "md:grid-cols-1"
            )}
          >
            {tag ? (
              <div>
                <span className="block text-[11px] text-[var(--color-light-cards-text)]">
                  {studioLabel}
                </span>
                <span className="mt-2 block font-medium text-[var(--color-primary-text)]">
                  {tag}
                </span>
              </div>
            ) : null}
            <div>
              <span className="block text-[11px] text-[var(--color-light-cards-text)]">
                {scopeLabel}
              </span>
              <span className="mt-2 block font-medium text-[var(--color-primary-text)]">
                {deliverablesLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
