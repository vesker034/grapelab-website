"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import { matchesSearchInFields } from "@/lib/searchUtils";
import { useTranslations } from "@/lib/localize";

const SERVICES_RESET_EVENT = "glk:services-reset-view";

interface LocalizedService {
  title: string;
  description?: string;
  tag?: string;
  image?: string;
  descriptionList: string[];
  deliverablesLabel?: string;
}

interface ServiceSearchProps {
  services: LocalizedService[];
  texts: {
    searchPlaceholder: string;
    searchNoResults: string;
    labels: {
      studio: string;
      scope: string;
    };
  };
}

export default function ServiceSearch({ services, texts }: ServiceSearchProps) {
  const tPaging = useTranslations("paging");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const hasActiveSearch = query.trim().length > 0;

  const filteredServices = useMemo(() => {
    if (!hasActiveSearch) return services;

    const trimmedQuery = query.trim();

    return services.filter((service) =>
      matchesSearchInFields(trimmedQuery, [
        service.title,
        service.tag,
        service.description,
        service.deliverablesLabel,
        ...service.descriptionList,
      ])
    );
  }, [hasActiveSearch, services, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleServicesReset = () => {
      setQuery("");
      setCurrentPage(1);
    };

    window.addEventListener(SERVICES_RESET_EVENT, handleServicesReset);

    return () => {
      window.removeEventListener(SERVICES_RESET_EVENT, handleServicesReset);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.sessionStorage.removeItem("force-services-scroll-top");
    scrollToTop();

    const animationFrameId = window.requestAnimationFrame(scrollToTop);
    const timeoutId = window.setTimeout(scrollToTop, 80);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (hasActiveSearch) {
      return;
    }

    const top = containerRef.current?.getBoundingClientRect().top;
    if (typeof top !== "number") {
      return;
    }

    window.scrollTo({
      top: window.scrollY + top - 24,
      behavior: "smooth",
    });
  }, [currentPage, hasActiveSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / postsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleServices = hasActiveSearch
    ? filteredServices
    : filteredServices.slice(
        (safeCurrentPage - 1) * postsPerPage,
        safeCurrentPage * postsPerPage
      );

  return (
    <div ref={containerRef}>
      {/* Строка поиска */}
      <div className="relative mb-8">
        <div className="group relative rounded-[20px] p-[1.5px] overflow-hidden">
          {/* Вращающаяся рамка при фокусе */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[20px]
              bg-[conic-gradient(from_180deg_at_50%_50%,rgba(88,66,124,1)_0deg,rgba(101,80,145,1)_55deg,rgba(119,195,221,1)_140deg,rgba(141,224,239,1)_190deg,rgba(119,195,221,1)_240deg,rgba(101,80,145,1)_305deg,rgba(88,66,124,1)_360deg)]
              blur-[1px] animate-[spin_8s_linear_infinite]
              group-focus-within:animate-none"
          />
          <div className="relative rounded-[20px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-4 shadow-[0_8px_24px_rgba(88,66,124,0.08)]">
            <div className="flex items-center gap-3">
              {/* Иконка поиска */}
              <svg
                className="h-5 w-5 shrink-0 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={texts.searchPlaceholder}
                className="w-full bg-transparent text-base leading-6 text-[var(--color-primary-text)] outline-none placeholder:text-[var(--color-muted-text)]"
              />
              {/* Кнопка очистки */}
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="shrink-0 text-muted hover:text-[var(--color-primary-text)] transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Результаты */}
      {filteredServices.length === 0 ? (
        <div className="rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-12 text-center shadow-[0_12px_32px_rgba(88,66,124,0.08)]">
          <p className="text-lg text-[var(--color-muted-text)]">
            {texts.searchNoResults}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:gap-10">
            {visibleServices.map((item, index) => (
              <ServiceCard
                key={`${item.title}-${index}`}
                title={item.title}
                tag={item.tag}
                description={item.description}
                descriptionList={item.descriptionList}
                image={item.image}
                index={index}
                studioLabel={texts.labels.studio}
                scopeLabel={texts.labels.scope}
                deliverablesLabel={item.deliverablesLabel ?? ""}
              />
            ))}
          </div>

          {!hasActiveSearch && totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-4">
              {safeCurrentPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="inline-flex h-10 items-center rounded-full border border-[var(--color-buttons)] px-5 text-[16px] font-semibold text-[var(--color-buttons)] transition-colors hover:bg-[var(--color-buttons)] hover:text-white"
                >
                  {tPaging("previous")}
                </button>
              )}
              {safeCurrentPage < totalPages && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="inline-flex h-10 items-center rounded-full border border-[var(--color-buttons)] px-5 text-[16px] font-semibold text-[var(--color-buttons)] transition-colors hover:bg-[var(--color-buttons)] hover:text-white"
                >
                  {tPaging("next")}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
