"use client";

import { useTranslations } from "@/lib/localize";
import { useLocale } from "next-intl";

const YANDEX_MAP_SRC =
  "https://yandex.ru/map-widget/v1/?display-text=%D0%92%D0%BE%D0%BB%D0%B3%D0%BE%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D0%BF%D1%80-%D0%BA%D1%82%20%D0%B8%D0%BC%20%D0%92.%D0%98.%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0%2C%2028%D0%90&ll=44.52406017693866%2C48.71273201094517&mode=search&sll=44.52406017693866%2C48.71273201094517&sspn=0.012%2C0.008&text=%D0%92%D0%BE%D0%BB%D0%B3%D0%BE%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D0%BF%D1%80-%D0%BA%D1%82%20%D0%B8%D0%BC%20%D0%92.%D0%98.%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0%2C%2028%D0%90&utm_source=share&z=17";

export default function MapSection() {
  const t = useTranslations("MapSection");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="container py-10 sm:py-12 md:py-16 bg-site"
    >
      <div className="mx-auto px-4 max-w-[1200px]">
        <h2
          className={`text-[32px] font-semibold mb-8 md:mb-12 text-primary ${
            isRTL ? "text-right" : "md:text-left"
          }`}
        >
          {t("title")}
        </h2>

        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl border border-[#D1CFE2] shadow-md overflow-hidden">
          <iframe
            title={`Yandex Maps - ${t("title")}`}
            src={YANDEX_MAP_SRC}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
