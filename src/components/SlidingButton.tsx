"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { useLocale } from "next-intl";

interface SlidingButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
  revertArrow?: boolean;
}

const SlidingButton = ({
  children,
  className = "",
  revertArrow = false,
  ...props
}: SlidingButtonProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Link
      {...props}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`
        group relative inline-flex items-center h-10
        font-semibold text-[16px]
        text-[var(--color-buttons)] hover:text-white
        transition-colors duration-300 overflow-visible
        gap-3
         ${isRTL ? 'self-end mr-4' : 'ml-4'} 
        ${className}
      `}
    >
      <span
        className='
        flex items-center justify-center w-10 h-10
        bg-[var(--color-buttons)] rounded-full
        group-hover:bg-[#77C3DD] transition-all duration-400 z-10 shrink-0
      '
      >
        {revertArrow ? (
          isRTL ? (
            <ArrowRight className='w-5 h-5 text-white' />
          ) : (
            <ArrowLeft className='w-5 h-5 text-white' />
          )
        ) : (
          isRTL ? (
            <ArrowLeft className='w-5 h-5 text-white' />
          ) : (
            <ArrowRight className='w-5 h-5 text-white' />
          )
        )}
      </span>

      <span className='z-10 whitespace-nowrap leading-none rtl:text-right'>
        {children}
      </span>

      <span
        className={`
          absolute top-1/2 h-10 w-0 bg-[#77C3DD]
          transition-all duration-500 ease-in-out z-0 -translate-y-1/2
          ltr:left-5 ltr:origin-left ltr:group-hover:translate-x-[0.28rem] ltr:group-hover:rounded-r-full
          rtl:right-5 rtl:origin-right rtl:group-hover:-translate-x-[0.28rem] rtl:group-hover:rounded-l-full
          group-hover:w-[calc(100%+0.15rem)]
        `}
        style={{
          transitionProperty:
            'width, height, border-radius, background, transform',
        }}
      />
    </Link>
  );
};

export default SlidingButton;
