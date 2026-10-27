"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/localize";
import Image from "next/image";
import { FC } from "react";

// Props interface
export interface DevelopmentDirectionCardProps {
  title: string;
  description: string;
  icon?: JSX.Element;
  logoSrc?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  variant?: "default" | "case";
  projectId?: number;
}

// DirectionCard reusable component with variant support
const DevelopmentDirectionCard: FC<DevelopmentDirectionCardProps> = ({
  title,
  description,
  icon,
  logoSrc,
  className = "",
  bgColor = "bg-white",
  textColor = "text-gray-800",
  variant = "default",
  projectId,
}) => {
  const t = useTranslations("DevelopmentDirectionCard");

  // Check if parent component (like CasesSection) passed a custom height
  const hasCustomHeight = className.includes("h-[");
  const heightClass = hasCustomHeight ? "" : "h-[520px]";

  // Case variant (like the "Cases" section)
  if (variant === "case") {
    return (
      <div
        className={`
          group
          w-full max-w-[271px]
          ${heightClass}
          p-[1.5px] rounded-xl shrink-0
          relative overflow-hidden
          transition-transform duration-500 ease-out
          hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(88,66,124,0.18)]
          ${className}
        `}
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 rounded-xl
            bg-[conic-gradient(from_180deg_at_50%_50%,rgba(88,66,124,1)_0deg,rgba(101,80,145,1)_55deg,rgba(119,195,221,1)_140deg,rgba(141,224,239,1)_190deg,rgba(119,195,221,1)_240deg,rgba(101,80,145,1)_305deg,rgba(88,66,124,1)_360deg)]
            blur-[1px] transition-transform duration-700 ease-linear
            group-hover:animate-[spin_5.2s_linear_infinite]
          "
        />
        <Link
          href={projectId ? `/portfolio/${projectId}` : "#"}
          className="
            relative block w-full h-full bg-card-inner rounded-xl
            p-6 flex flex-col justify-between items-center
            text-center overflow-hidden
          "
        >
          {/* Logo */}
          {logoSrc && (
            <div className="relative z-10 w-[120px] h-[120px] flex items-center justify-center shrink-0">
              <Image
                src={logoSrc}
                alt={`${title} logo`}
                width={120}
                height={120}
                className="object-contain icon-dark-mode"
              />
            </div>
          )}

          {/* Texts */}
          <div className="relative z-10 mt-6 flex-1 flex flex-col justify-start">
            <h3
              className="
                text-base font-bold text-primary
                mb-3 leading-tight line-clamp-2 break-words
              "
            >
              {title}
            </h3>

            <p
              className="
                text-sm text-muted leading-relaxed
                line-clamp-5 break-words px-1
              "
            >
              {description}
            </p>
          </div>

          {/* Learn More */}
          {projectId && (
            <div className="relative z-10 w-full pt-4 text-left">
              <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">
                {t("learnMore")}
              </span>
            </div>
          )}
        </Link>
      </div>
    );
  }

  // Default variant (standard usage in other sections)
  return (
    <div
      className={`rounded-lg p-5 shadow-md flex flex-col gap-4 ${bgColor} ${textColor} ${className}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{title}</span>
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={`${title} logo`}
            width={60}
            height={60}
            className="object-contain"
          />
        ) : (
          <div className={`text-3xl ${textColor}`}>{icon}</div>
        )}
      </div>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default DevelopmentDirectionCard;
