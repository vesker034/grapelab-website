"use client";

import { useTranslations } from "@/lib/localize";
import { normalizeImagePath } from "@/lib/pathutils";
import { Review } from "@prisma/client";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ReviewSectionProps {
  data: Review[];
}

export default function Reviews({ data }: ReviewSectionProps) {
  const t = useTranslations("ReviewSection");

  return (
    <div className="container max-w-[1200px] relative mx-auto px-4 overflow-hidden py-8 bg-site">
      <h2 className="text-2xl sm:text-3xl md:text-[32px] font-semibold text-primary mb-6">
        {t("title")}
      </h2>

      <Swiper
        initialSlide={1}
        modules={[Navigation, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: false,
        }}
        navigation={{
          nextEl: ".review-next",
          prevEl: ".review-prev",
        }}
        className="!py-6 sm:!py-8 md:!py-10"
      >
        {data.map((review) => (
          <SwiperSlide
            key={review.id}
            className="w-full max-w-[90%] sm:!w-[450px] md:!w-[602px] !h-auto transition-all duration-300 px-4 sm:px-0"
          >
            {({ isActive }) => (
              <div
                className={`w-full h-full transition-all duration-300 ${
                  isActive ? "scale-100 opacity-100" : "scale-90 opacity-80"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-r from-primary to-accent rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-[2px]">
                  <div className="w-full h-full bg-card-inner p-6 sm:p-8 md:p-10 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] shadow-md flex flex-col justify-between">
                    <div>
                      <p className="text-primary text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-8">
                        {review.description}
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mt-4 md:mt-0">
                      <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-3">
                        <div className="w-[64px] h-[64px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200 shadow-md shadow-gray-300">
                          {review.imagePath ? (
                            <Image
                              src={normalizeImagePath(review.imagePath)}
                              alt={review.fullname}
                              width={64}
                              height={64}
                              className="object-cover object-[center_20%] w-full h-full"
                            />
                          ) : (
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="#D1D5DB"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
                              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-primary leading-tight">
                            {review.fullname}
                          </p>
                          <p className="text-sm text-accent leading-tight">
                            {review.userPosition}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center md:justify-end">
                        <div className="bg-gradient-to-r from-primary to-accent rounded-full p-[2px]">
                          <div className="h-[44px] md:h-[48px] rounded-[24px] bg-card-inner flex items-center justify-center px-4">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="#58427C"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div dir="ltr" className="flex justify-center mt-12 gap-4">
        <button className="review-prev p-3 rounded-full bg-primary hover:bg-[#462f6b] transition">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="review-next p-3 rounded-full bg-primary hover:bg-[#462f6b] transition">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
