"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/lib/localize";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { locales } from "@/config";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import {
  Link as LocaleLink,
  usePathname as useLocalePathname,
  useRouter as useLocaleRouter,
} from "@/i18n/navigation";

const SERVICES_RESET_EVENT = "glk:services-reset-view";
const BLOG_RESET_EVENT = "glk:blog-reset-view";

// Language data with flags and names
const languageData: Record<
  string,
  { name: string; flagCode: string; nativeName: string }
> = {
  en: { name: "English", flagCode: "gb", nativeName: "English" },
  ar: { name: "Arabic", flagCode: "ae", nativeName: "العربية" },
  ru: { name: "Russian", flagCode: "ru", nativeName: "Русский" },
};

const FlagImage = ({ code, size = 28 }: { code: string; size?: number }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`/flags/${code}.svg`}
    alt={code}
    width={size}
    height={size * 0.75}
    style={{ objectFit: "cover", borderRadius: 3 }}
  />
);

// ===== Language Dropdown Component =====
const AdvancedLanguageDropdown: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const locale = useLocale();
  const currentPathname = useLocalePathname();
  const localeRouter = useLocaleRouter();

  const filteredLocales = locales.filter((lng) => {
    const data = languageData[lng];
    if (!data) return false;
    const query = searchQuery.toLowerCase();
    return (
      data.name.toLowerCase().includes(query) ||
      data.nativeName.toLowerCase().includes(query) ||
      lng.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredLocales.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredLocales[highlightedIndex]) {
            setIsOpen(false);
            setSearchQuery("");
            localeRouter.replace(currentPathname, {
              locale: filteredLocales[highlightedIndex],
            });
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentPathname, filteredLocales, highlightedIndex, isOpen, localeRouter]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  const currentLanguage = languageData[locale];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 xl:px-4 py-2 bg-navbar text-white rounded-lg transition-all duration-200 min-w-[80px] xl:min-w-[120px]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {currentLanguage && <FlagImage code={currentLanguage.flagCode} />}
        <span className="font-medium">{locale.toUpperCase()}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={locale === "ar" ? "mr-auto" : "ml-auto"}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 ${locale === "ar" ? "left-0" : "right-0"} w-[280px] max-h-[400px] bg-white rounded-xl shadow-2xl border-2 border-purple-200 overflow-hidden z-50`}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <div className="overflow-y-auto overflow-x-hidden max-h-[370px] custom-scrollbar">
              {filteredLocales.length > 0 ? (
                filteredLocales.map((lng, index) => {
                  const langData = languageData[lng];
                  const isActive = lng === locale;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <motion.div
                      key={lng}
                      whileHover={{ x: locale === "ar" ? -5 : 5 }}
                    >
                      <LocaleLink
                        href={currentPathname}
                        locale={lng}
                        className={`flex items-center gap-3 px-4 py-3 no-underline outline-none transition-colors duration-150 ${
                          isActive
                            ? `bg-purple-50 ${locale === "ar" ? "border-r-4" : "border-l-4"} border-purple-600`
                            : "hover:bg-gray-50"
                        } ${isHighlighted ? "bg-purple-100" : ""}`}
                        onClick={() => {
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <FlagImage code={langData.flagCode} size={32} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold text-sm ${isActive ? "text-purple-700" : "text-gray-700"}`}
                            >
                              {langData.name}
                            </span>
                            {isActive && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                {t("langActive")}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {langData.nativeName}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-gray-400 uppercase">
                          {lng}
                        </span>
                      </LocaleLink>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500"></div>
              )}
            </div>
            <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
              <span className="text-xs text-gray-500">
                {t("langEscHint")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===== Main Header Component =====
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const servicesHref = `/${locale}/services`;
  const isServicesPage = pathname === servicesHref || pathname === "/services";
  const blogHref = `/${locale}/blog`;
  const isBlogPage = pathname === blogHref || pathname === "/blog";

  const handleServicesNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    shouldCloseMenu = false,
  ) => {
    if (shouldCloseMenu) {
      setIsMenuOpen(false);
    }

    if (typeof window === "undefined") {
      return;
    }

    if (isServicesPage) {
      event.preventDefault();
      window.sessionStorage.removeItem("force-services-scroll-top");
      window.dispatchEvent(new Event(SERVICES_RESET_EVENT));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.sessionStorage.setItem("force-services-scroll-top", "1");
  };

  const handleBlogNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    shouldCloseMenu = false,
  ) => {
    if (shouldCloseMenu) {
      setIsMenuOpen(false);
    }

    if (typeof window === "undefined") {
      return;
    }

    if (isBlogPage) {
      event.preventDefault();
      window.sessionStorage.removeItem("force-blog-scroll-top");
      window.dispatchEvent(new Event(BLOG_RESET_EVENT));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.sessionStorage.setItem("force-blog-scroll-top", "1");
  };

  return (
    <div className="pt-8 pb-10 bg-site">
      <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-10">
        <header
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="
            bg-navbar
            h-[100px]
            rounded-[25px]
            shadow-md
            w-full
            max-w-[1854px]
            flex
            items-center
            justify-between
            overflow-visible
            px-4 sm:px-6 md:px-8
          "
        >
          {/* logo */}
          <span className="text-[#E0E0E0] font-semibold text-[20px] sm:text-[22px] md:text-[24px] whitespace-nowrap">
            <Link href={`/${locale}`}>{t("grapelab")}</Link>
          </span>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center text-[14px] xl:text-[18px] 2xl:text-[22px] font-medium text-[#E0E0E0]">
            <div className="flex gap-4 xl:gap-6 2xl:gap-8 rtl:gap-5 rtl:xl:gap-8 rtl:text-right">
              <Link
                href={servicesHref}
                onClick={handleServicesNavigation}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("services")}
              </Link>
              <Link
                href={`/${locale}/portfolio`}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("cases")}
              </Link>
              <Link
                href={`/${locale}/team`}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("team")}
              </Link>
              <Link
                href={blogHref}
                onClick={handleBlogNavigation}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("blog")}
              </Link>
              <Link
                href={`/${locale}/advertising`}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("advertising")}
              </Link>
              <Link
                href={`/${locale}/partners`}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("partners")}
              </Link>
              <Link
                href={`/${locale}/community`}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("community")}
              </Link>
              <Link
                href={`/${locale}/contacts`}
                className="transition-transform duration-200 transform hover:scale-105 hover:text-white"
              >
                {t("contacts")}
              </Link>
            </div>

            {/* Advanced Language Dropdown - Desktop */}
            <div className={locale === "ar" ? "me-4 xl:me-6" : "ms-4 xl:ms-6"}>
              <AdvancedLanguageDropdown />
            </div>

            <div className={locale === "ar" ? "me-3 xl:me-4" : "ms-3 xl:ms-4"}>
              <ThemeToggle />
            </div>
          </nav>

          <button
            className="lg:hidden text-[#E0E0E0] text-3xl focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
          >
            &#9776;
          </button>
        </header>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`fixed top-0 ${locale === "ar" ? "left-0" : "right-0"} h-full w-[250px] bg-navbar z-50 transform ${
          isMenuOpen
            ? "translate-x-0"
            : locale === "ar"
              ? "-translate-x-full"
              : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#ffffff33]">
          <span className="text-[#E0E0E0] font-semibold text-[22px]">
            {t("grapelab")}
          </span>
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-white text-lg rtl:text-right">
          <Link href={servicesHref} onClick={(event) => handleServicesNavigation(event, true)}>
            {t("services")}
          </Link>
          <Link href={`/${locale}/portfolio`} onClick={() => setIsMenuOpen(false)}>
            {t("cases")}
          </Link>
          <Link href={`/${locale}/team`} onClick={() => setIsMenuOpen(false)}>
            {t("team")}
          </Link>
          <Link href={blogHref} onClick={(event) => handleBlogNavigation(event, true)}>
            {t("blog")}
          </Link>
          <Link href={`/${locale}/advertising`} onClick={() => setIsMenuOpen(false)}>
            {t("advertising")}
          </Link>
          <Link href={`/${locale}/partners`} onClick={() => setIsMenuOpen(false)}>
            {t("partners")}
          </Link>
          <Link href={`/${locale}/community`} onClick={() => setIsMenuOpen(false)}>
            {t("community")}
          </Link>
          <Link href={`/${locale}/contacts`} onClick={() => setIsMenuOpen(false)}>
            {t("contacts")}
          </Link>

          {/* Advanced Language Dropdown - Mobile */}
          <div className="mt-4">
            <AdvancedLanguageDropdown className="w-full" />
          </div>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
