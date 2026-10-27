"use client";
import { resolveMaxUrl } from "@/lib/contactLinks";
import { useTranslations } from "@/lib/localize";
import type { JsonObject } from "@prisma/client/runtime/library";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import React from "react";
interface FooterProps {
  data?: JsonObject;
}
const Footer: React.FC<FooterProps> = ({ data }) => {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const contacts = data ?? {};
  const maxUrl = resolveMaxUrl(contacts.max);
  return (
    <div
      data-site-footer-start
      className='bg-site px-4 sm:px-6 md:px-8 lg:px-10 mb-16'
    >
      <footer
        data-site-footer
        className='bg-footer text-textWhite py-10 rounded-[20px] w-full max-w-[1854px] mx-auto mt-16 px-4 sm:px-6 md:px-10'
      >
        <div className='flex flex-col md:flex-row justify-between gap-10'>
          {/* Левая колонка */}
          <div className='flex-1'>
            <h2 className='text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.1] font-semibold mb-4'>
              {t('grapelabTitle')}
            </h2>
            <p className='text-[14px] lg:text-[16px] xl:text-[18px] leading-[1.6] mb-6'>
              {t('description')}
            </p>
            <div className='flex space-x-4 rtl:space-x-reverse'>
              <a
                href={
                  (contacts.telegram as string)
                    ? `https://t.me/${contacts.telegram}`
                    : '#'
                }
                target='_blank'
              >
                <Image
                  src='/icons/telegram.svg'
                  alt='Telegram'
                  width={40}
                  height={40}
                />
              </a>
              <a
                href={(contacts.phone as string) ? `tel:${contacts.phone}` : '#'}
                target='_blank'
              >
                <Image
                  src='/icons/phone.svg'
                  alt='Phone'
                  width={40}
                  height={40}
                />
              </a>
              <a
                href={(contacts.vk as string) ? `https://vk.com/${contacts.vk}` : '#'}
                target='_blank'
              >
                <Image src='/icons/vk.svg' alt='VK' width={40} height={40} />
              </a>
              <a
                href={(contacts.email as string) ? `mailto:${contacts.email}` : '#'}
                target='_blank'
              >
                <Image
                  src='/icons/email.svg'
                  alt='Email'
                  width={40}
                  height={40}
                />
              </a>
              <a
                href={maxUrl ?? '#'}
                target='_blank'
              >
                <Image src='/icons/max.svg' alt='Max' width={40} height={40} />
              </a>
            </div>
          </div>
          {/* Средняя колонка (Навигация) */}
          <div className='flex-1 max-w-xs'>
            <h3 className='text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[24px] font-semibold mb-2'>
              {t('link.navigation')}
            </h3>
            <ul className='text-[14px] lg:text-[16px] xl:text-[18px] leading-[1.7] font-normal space-y-1'>
              <li>
                <Link href={`/${locale}/services`} className="hover:underline">
                  {t("link.services")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/portfolio`} className="hover:underline">
                  {t("link.cases")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/team`} className='hover:underline'>
                  {t('link.team')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className='hover:underline'>
                  {t('link.blog')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/advertising`} className='hover:underline'>
                  {t('link.advertising')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/partners`} className='hover:underline'>
                  {t('link.partners')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/community`} className='hover:underline'>
                  {t('link.community')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contacts`} className='hover:underline'>
                  {t('link.contacts')}
                </Link>
              </li>
            </ul>
          </div>
          {/* Правая колонка (Контакты) */}
          <div className='flex-1 max-w-xs'>
            <h3 className='text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[24px] font-semibold mb-2'>
              {t('link.contacts')}
            </h3>
            <p
              dir='ltr'
              className='text-[14px] lg:text-[16px] xl:text-[18px] leading-[1.7] font-normal text-start md:text-left'
            >
              {contacts.phone ? (
                <a
                  href={`tel:${contacts.phone}`}
                  className='text-white hover:underline'
                >
                  {contacts.phone as string}
                </a>
              ) : (
                ''
              )}
            </p>
            <p className='text-[14px] lg:text-[16px] xl:text-[18px] leading-[1.7] font-normal'>
              {contacts.email ? (
                <a
                  href={`mailto:${contacts.email}`}
                  className='text-white hover:underline'
                >
                  {contacts.email as string}
                </a>
              ) : (
                ''
              )}
            </p>
          </div>
        </div>
        <hr className='my-8 border-white/20' />
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center text-[12px] sm:text-[14px] text-white/80 gap-4'>
          <p>{t('copyright')}</p>
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0'>
            <Link href={`/${locale}/privacy-policy`} className='hover:underline'>
              {t('privacyPolicy')}
            </Link>
            <Link href={`/${locale}/terms-of-use`} className='hover:underline'>
              {t('TermsOfService')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Footer;
