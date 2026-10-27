"use client";

import DevelopmentDirectionCard from "@/components/DevAreaCard";
import SlidingButton from "@/components/SlidingButton";
import { useTranslations } from "@/lib/localize";
import { normalizeImagePath } from "@/lib/pathutils";
import { Project } from "@prisma/client";
import { useRef, useState, useEffect, FC } from "react";
import { useLocale } from "next-intl";

interface CasesSectionProps {
  data: Project[];
}

const CasesSection: FC<CasesSectionProps> = ({ data }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const tCases = useTranslations("CasesSection");
  const tTitles = useTranslations("CasesSection_title");
  const tDescriptions = useTranslations("CasesSection_description");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const items = data.map((project) => ({
    projectId: project.id,
    title: project.rawName ?? "",
    description: project.rawName ?? "",
    logoSrc: project.imagePath || "",
  }));

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visibleItems = isMobile || showAll ? items : items.slice(0, 4);

  const handleToggleShowAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAll((prev) => !prev);
  };

  useEffect(() => {
    if (!showAll && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showAll]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "scrollRestoration" in window.history
    ) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      className={`container max-w-[1200px] mx-auto px-4 md:pl-12 py-12 select-none ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <h2 className="font-semibold text-[30px] sm:text-[32px] md:text-[36px] leading-[36px] text-textPrimary mb-8">
        {tCases("title")}
      </h2>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        className={`flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide
          ${isDragging ? "cursor-grabbing" : "cursor-grab"} select-none
          ${isRTL ? "flex-row-reverse" : ""}
        `}
      >
        {visibleItems.map((item, i) => (
          <DevelopmentDirectionCard
            key={i}
            projectId={item.projectId}
            title={tTitles(item.title)}
            description={tDescriptions(item.description)}
            logoSrc={normalizeImagePath(item.logoSrc)}
            variant="case"
            className="w-[280px] min-w-[280px] h-[455px] flex-shrink-0 snap-start"
          />
        ))}
      </div>
      {items.length > 4 && (
        <div className="hide-on-mobile flex mt-12 justify-center">
          <SlidingButton href="#" onClick={handleToggleShowAll}>
            {showAll ? tCases("button_lessCases") : tCases("button_moreCases")}
          </SlidingButton>
        </div>
      )}
    </section>
  );
};

export default CasesSection;
