"use client";

import { timeZone } from '@/config';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactNode } from 'react';

interface Props {
  locale: string;
  messages: ReturnType<typeof useMessages>;
  children: ReactNode;
}

export default function IntlClientProvider({
  locale,
  messages,
  children,
}: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      onError={(error) => {
        console.error(error.originalMessage); // остальные ошибки логируем
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
