"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BlogCard from "@/components/BlogCard";
import PageNotReady from "@/components/PageNotReady";
import { matchesSearchInFields } from "@/lib/searchUtils";
import { useTranslations } from "@/lib/localize";

const BLOG_RESET_EVENT = "glk:blog-reset-view";

interface BlogSearchPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string | null | undefined;
}

interface BlogSearchListProps {
  posts: BlogSearchPost[];
  title: string;
  noPosts: string;
  searchPlaceholder: string;
  searchNoResults: string;
  initialPage?: number;
  postsPerPage?: number;
}

export default function BlogSearchList({
  posts,
  title,
  noPosts,
  searchPlaceholder,
  searchNoResults,
  initialPage = 1,
  postsPerPage = 5,
}: BlogSearchListProps) {
  const tPaging = useTranslations("paging");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(
    Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1
  );
  const hasActiveSearch = query.trim().length > 0;

  const filteredPosts = useMemo(() => {
    if (!hasActiveSearch) {
      return posts;
    }

    const trimmedQuery = query.trim();

    return posts.filter((post) =>
      matchesSearchInFields(trimmedQuery, [post.title, post.excerpt])
    );
  }, [hasActiveSearch, posts, query]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.sessionStorage.removeItem("force-blog-scroll-top");
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
    if (typeof window === "undefined") {
      return;
    }

    const handleBlogReset = () => {
      setQuery("");
      setCurrentPage(1);
    };

    window.addEventListener(BLOG_RESET_EVENT, handleBlogReset);

    return () => {
      window.removeEventListener(BLOG_RESET_EVENT, handleBlogReset);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

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

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visiblePosts = hasActiveSearch
    ? filteredPosts
    : filteredPosts.slice(
        (safeCurrentPage - 1) * postsPerPage,
        safeCurrentPage * postsPerPage
      );

  if (posts.length === 0) {
    return <PageNotReady text={noPosts} />;
  }

  return (
    <div ref={containerRef}>
      <h1 className="mb-12 text-3xl font-bold">{title}</h1>

      <div className="relative mb-8">
        <div className="group relative overflow-hidden rounded-[20px] p-[1.5px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[20px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(88,66,124,1)_0deg,rgba(101,80,145,1)_55deg,rgba(119,195,221,1)_140deg,rgba(141,224,239,1)_190deg,rgba(119,195,221,1)_240deg,rgba(101,80,145,1)_305deg,rgba(88,66,124,1)_360deg)] blur-[1px] animate-[spin_8s_linear_infinite] group-focus-within:animate-none"
          />
          <div className="relative rounded-[20px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-5 py-4 shadow-[0_8px_24px_rgba(88,66,124,0.08)]">
            <div className="flex items-center gap-3">
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-base leading-6 text-[var(--color-primary-text)] outline-none placeholder:text-[var(--color-muted-text)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="shrink-0 text-muted transition-colors hover:text-[var(--color-primary-text)]"
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

      {filteredPosts.length === 0 ? (
        <div className="rounded-[24px] border border-[rgba(88,66,124,0.16)] bg-card-inner px-6 py-12 text-center shadow-[0_12px_32px_rgba(88,66,124,0.08)]">
          <p className="text-lg text-[var(--color-muted-text)]">{searchNoResults}</p>
        </div>
      ) : (
        <>
          <div className="space-y-0">
            {visiblePosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                imageUrl={post.imageUrl}
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
