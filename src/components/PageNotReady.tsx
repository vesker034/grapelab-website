"use client";

import Image from "next/image";
import React from "react";
import grapelogo from "/public/grapelogo.svg";
import { useTranslations } from "@/lib/localize";

export default function PageNotReady({text}: {text?: string}) {
  const t = useTranslations("ErrorSection");
  return (
    <div className="flex flex-col items-center gap-6 w-[80%] mx-auto ">
      <Image
        src={grapelogo}
        alt="error code logo"
        height={0}
        width={0}
        className="
              w-[40px]
              sm:w-[200px]
              md:w-[100px]
              lg:w-[200px]
              xl:w-[300px]
              h-auto
              m-auto
              object-contain"
      />
      <h3 className="!my-0 sm:text-lg md:text-xl lg:text-2xl text-[var(--color-primary-text)]">
        {text ? text : t("pageNotReady")}
      </h3>
      <a
        href={"/"}
        className="inline-block text-base sm:text-lg md:text-xl lg:text-2xl mb-4 font-bold text-[var(--color-buttons)] hover:opacity-80 transition-opacity no-underline"
      >
        {t("homeLinkText")}
      </a>
    </div>
  );
}
