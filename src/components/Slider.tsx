"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { normalizeImagePath } from "@/lib/pathutils";

interface SliderImage {
  src: string;
  alt?: string;
}

interface ImageSliderProps {
  images: SliderImage[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null);
  if (!Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <PhotoProvider>
      <div className="w-full mx-auto">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{ nextEl, prevEl }}
          loop={images.length > 1} // Бесконечная прокрутка только если картинок больше 1
          // пагинацию вынесу вниз
          pagination={{ 
            clickable: true,
            el: paginationEl, 
          }}
          spaceBetween={10}
          slidesPerView={1}
          className="rounded-[20px]" 
        >
          {/* Мапим данные бд */}
          {images.map((image, index) => (
            <SwiperSlide key={`${image.src}-${index}`} className="relative">
              <div className="relative w-full aspect-video overflow-hidden rounded-[20px]">
                <PhotoView src={normalizeImagePath(image.src)}>
                  <Image
                    src={normalizeImagePath(image.src)}
                    alt={image.alt?.trim() || `Project image ${index + 1}`}
                    fill
                    // Оставлю 100vw, чтобы картинки с БД не сжимались и не пикселили
                    sizes="100vw" 
                    quality={100}
                    className="object-cover cursor-pointer transition-transform hover:scale-105"
                  />
                </PhotoView>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ПАГИНАЦИЯ: тепер ниже слайдера */}
        <div 
          ref={(node) => setPaginationEl(node)}
          className="flex justify-center mt-6 gap-1"
          style={{
            "--swiper-pagination-color": "#58427C",
            "--swiper-pagination-bullet-inactive-color": "#DADADA",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bullet-size": "8px",
            "position": "relative",
            "bottom": "0"
          } as React.CSSProperties}
        />
        
        {/* КНОПКИ: под пагинацией */}
        <div className="flex justify-center mt-6 mb-12 gap-2">
          <button
            ref={(node) => setPrevEl(node)}
            className="flex items-center justify-center w-10 h-10 bg-[var(--color-buttons)] rounded-full group-hover:bg-[#77C3DD] transition-all duration-400 z-10 shrink-0"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button
            ref={(node) => setNextEl(node)}
            className="flex items-center justify-center w-10 h-10 bg-[var(--color-buttons)] rounded-full group-hover:bg-[#77C3DD] transition-all duration-400 z-10 shrink-0"
            aria-label="Next slide"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </PhotoProvider>
  );
};

export default ImageSlider;