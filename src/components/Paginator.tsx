'use client';
import { useTranslations } from "@/lib/localize";
import SlidingButton from "./SlidingButton";

interface PaginatorProps {
    href: string;
    totalPages: number;
    currentPage: number;
}

export default function Paginator({ href, totalPages, currentPage }: PaginatorProps) {
    const t = useTranslations("paging");
    const hasMore = currentPage < totalPages;
    const hasPrevious = currentPage > 1;

    return (
      <div className='flex justify-center mt-12'>
        {hasPrevious && (
          <SlidingButton
            revertArrow={true}
            href={`${href}?page=${currentPage - 1}`}
            className='ml-0'
          >
            {t('previous')}
          </SlidingButton>
        )}
        {hasMore && (
          <SlidingButton
            href={`${href}?page=${currentPage + 1}`}
            className='ml-0'
          >
            {t('next')}
          </SlidingButton>
        )}
      </div>
    );
}