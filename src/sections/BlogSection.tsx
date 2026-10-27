'use client';
import PageNotReady from '@/components/PageNotReady';
import { useTranslations } from '@/lib/localize';
import React, { Children, ReactNode } from 'react';

interface BlogSectionProps {
    children: ReactNode;
}

export default function BlogSection({ children }: BlogSectionProps) {
    const childrenArray = Children.toArray(children);
    const t = useTranslations("BlogSection");

    return childrenArray.length > 0 ? (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <h1 className='text-3xl font-bold mb-12'>{t('title')}</h1>

        {/* Blog Posts */}
        <div className='space-y-0'>{children}</div>
    </div>) : (
        <PageNotReady text={t('noPosts')} />
    );
}