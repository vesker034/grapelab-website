"use client"; // Используем клиентский компонент в Next.js

import { normalizeImagePath } from "@/lib/pathutils";
import type { RefTable } from "@prisma/client";
import type { JsonObject, JsonValue } from "@prisma/client/runtime/library";
import Image from "next/image"; // Импорт компонента для оптимизированной загрузки изображений
import { useTranslations } from "use-intl"; // Хук для интернационализации
import { useLocale } from "next-intl";
import clsx from "clsx";
interface TechnologiesSectionProps {
  data: RefTable | null | undefined | JsonValue;
  className?: string;
}

export default function TechnologiesSection({
  data,
  className,
}: TechnologiesSectionProps) {
  let technologies: { icon: string; alt: string }[] = [];

  if (!data) {
    technologies = [];
  } else if ("content" in (data as RefTable)) {
    const content = (data as RefTable).content as JsonObject[];
    technologies = content.map((item) => {
      const icon = typeof item.image_url === "string" ? item.image_url : "";
      const alt = typeof item.alt === "string" ? item.alt : "";
      return { icon, alt };
    });
  } else if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === "string") {
      technologies = (data as string[]).map((techName) => ({
        icon: `/icons/${techName.toLowerCase().replace(/\s+/g, "-")}.png`,
        alt: techName,
      }));
    } else if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      data[0] !== null
    ) {
      technologies = (data as { image_url?: string; alt?: string }[]).map(
        (item) => {
          const icon = typeof item.image_url === "string" ? item.image_url : "";
          const alt = typeof item.alt === "string" ? item.alt : "";
          return { icon, alt };
        }
      );
    }
  } else if (typeof data === "object" && data !== null) {
    if ("image_url" in data || "alt" in data) {
      const icon =
        typeof data.image_url === "string"
          ? data.image_url
          : "";
      const alt =
        typeof data.alt === "string" ? data.alt : "";
      technologies = [{ icon, alt }];
    }
  }

  const t = useTranslations("TechnologiesSection"); // Инициализация переводов для данного раздела

  const locale = useLocale();
  const isRTL = locale === "ar";
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={clsx(className ? className : "container py-16 bg-site")}
    >
      {" "}
      {/* Внешний контейнер с вертикальными отступами и фоном */}
      {/* Контейнер для центрирования и адаптивной ширины */}
      <div
        className={clsx(
          className ? "px-4 mx-auto" : "mx-auto max-w-[1200px] px-4"
        )}
      >
        {/* Заголовок раздела */}
        <h2
          className={`text-[32px] font-semibold mb-16 text-primary ${
            isRTL ? "text-right" : "md:text-left"
          }`}
        >
          {t("title")}
        </h2>

        {/* Сетка для отображения иконок технологий, адаптивное количество колонок */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-8 justify-items-center">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group relative flex w-[70px] flex-col items-center sm:w-[55px] md:w-[90px] lg:w-[100px]"
            >
              <div className="relative h-[70px] w-full transition-all duration-300 group-hover:scale-110 group-hover:animate-wiggle sm:h-[55px] md:h-[90px] lg:h-[100px]">
                <Image
                  src={normalizeImagePath(tech?.icon as string | undefined)}
                  alt={(tech?.alt as string | undefined) ?? ""}
                  fill
                  className="object-contain icon-dark-mode"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {!tech.icon && (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                    <span className="text-xs text-gray-500">?</span>
                  </div>
                )}
              </div>
              {tech.alt ? (
                <span className="mt-2 text-center text-[11px] leading-tight text-muted md:text-xs">
                  {tech.alt}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
