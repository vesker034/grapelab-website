"use client";

import { useTranslations } from "@/lib/localize";
import { Partner } from "@prisma/client";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLocale } from "next-intl";

interface PartnerProps {
  data: Partner[];
}

export default function PartnerSection({ data }: PartnerProps) {
  const t = useTranslations("PartnerSection");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className={`py-16 bg-site ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="container max-w-[1200px] mx-auto px-4">
        <h2
          className={`text-3xl font-semibold mb-12 text-headings ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("title")}
        </h2>
        <PartnerCarousel partners={data} isRTL={isRTL} />
      </div>
    </section>
  );
}

function PartnerCarousel({
  partners,
  isRTL,
}: {
  partners: Partner[];
  isRTL: boolean;
}) {
  return (
    <div
      className={`partners relative overflow-hidden py-4 ${
        isRTL ? "direction-rtl" : ""
      }`}
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={40}
        slidesPerView="auto"
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: isRTL,
        }}
        allowTouchMove={true}
        onTouchStart={(swiper) => swiper.autoplay.pause()}
        onTouchEnd={(swiper) => swiper.autoplay.resume()}
        className={`w-full h-24 ${isRTL ? "rtl" : ""}`}
      >
        {[...partners, ...partners].map((partner, index) => (
          <SwiperSlide key={`${partner.id}-${index}`} className="!w-auto">
            <div className="relative h-20 w-48 flex items-center justify-center group">
              {partner.imagePath ? (
                <Image
                  src={partner.imagePath}
                  alt={partner.name ?? "Partner logo"}
                  width={150}
                  height={60}
                  className="max-h-12 object-contain"
                />
              ) : partner.url && partner.url.trim() ? (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-light text-textPrimary text-center transition-all duration-300 group-hover:font-medium group-hover:text-primary"
                >
                  {partner.name}
                </a>
              ) : (
                <span className="text-xl font-light text-textPrimary text-center">
                  {partner.name}
                </span>
              )}
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transform -translate-x-1/2 transition-all duration-300 group-hover:w-3/4"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
