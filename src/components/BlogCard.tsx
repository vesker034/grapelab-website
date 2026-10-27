"use client";

import React from "react";
import SlidingButton from "@/components/SlidingButton";
import { useTranslations } from "@/lib/localize";

interface BlogCardProps {
  id: number;
  title: string;
  date: string;
  imageUrl: string | null | undefined;
  excerpt: string;
}

const BlogCard = ({ id, title, date, imageUrl, excerpt }: BlogCardProps) => {
  const t = useTranslations("BlogCard");

  return (
    <div>
      <div className='rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8'>
        {/* Right side - Text content */}
        <div className='flex-1 flex flex-col justify-between min-h-[200px] sm:min-h-[266px] order-2 lg:order-1'>
          <p className='text-primary text-lg sm:text-xl font-semibold leading-snug mb-6 sm:mb-8'>
            {title}
          </p>

          {/* Excerpt */}
          <p className='text-muted text-sm sm:text-base leading-relaxed mb-6 flex-1 line-clamp-3'>
            {excerpt}
          </p>

          <div className='flex items-center justify-between'>
            <SlidingButton href={`/blog/${id}`} className='ml-0'>
              {t("details")}
            </SlidingButton>
            <span className='text-muted text-sm font-medium'>{date}</span>
          </div>
        </div>

        {/* Left side - Image */}
        <div
          className='w-full lg:w-[498.11px] h-[200px] sm:h-[266px] bg-gray-600 rounded-2xl flex-shrink-0 order-1 lg:order-2'
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>

      {/* Separator Line */}
      <div className='flex justify-start mt-8'>
        <div
          className='w-full max-w-[624px] h-[1px] ml-8'
          style={{ backgroundColor: '#58427C' }}
        ></div>
      </div>
    </div>
  );
};

export default BlogCard;
