"use client";

import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const VISIBILITY_OFFSET = 520;
const FOOTER_PREHIDE_OFFSET = 24;

export default function ScrollToTopButton() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const footer = document.querySelector("[data-site-footer-start]");
      const footerReached =
        footer instanceof HTMLElement
          ? footer.getBoundingClientRect().top <=
            window.innerHeight + FOOTER_PREHIDE_OFFSET
          : false;

      setIsVisible(window.scrollY > VISIBILITY_OFFSET && !footerReached);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [pathname]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("scrollToTop")}
      title={t("scrollToTop")}
      className={`group fixed z-50 hidden items-center justify-center overflow-hidden rounded-full border border-[rgba(119,195,221,0.28)] bg-[var(--color-buttons)] text-white shadow-[0_16px_40px_rgba(88,66,124,0.24)] backdrop-blur-md transition-all duration-300 hover:border-[var(--color-light-cards-text)] hover:shadow-[0_18px_42px_rgba(119,195,221,0.18)] dark:border-[rgba(88,66,124,0.22)] dark:bg-card-inner dark:shadow-[0_16px_34px_rgba(0,0,0,0.24)] lg:bottom-8 lg:right-8 lg:flex lg:h-14 lg:w-14 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(88,66,124,0.96),rgba(124,92,170,0.92))] transition-opacity duration-300 group-hover:opacity-0 dark:bg-[linear-gradient(145deg,rgba(45,38,64,0.98),rgba(58,43,85,0.94))]" />
      <span className="pointer-events-none absolute inset-0 bg-[var(--color-light-cards-text)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(119,195,221,0.22),transparent_42%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.10),transparent_48%)] opacity-80 dark:bg-[radial-gradient(circle_at_top,rgba(119,195,221,0.07),transparent_34%),radial-gradient(circle_at_bottom,rgba(124,92,170,0.12),transparent_38%)]" />
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(119,195,221,0.28),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_42%)]" />
      <ChevronUp className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 md:h-6 md:w-6" />
    </button>
  );
}
