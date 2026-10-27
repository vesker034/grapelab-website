import { prisma } from '@/lib/prisma';
import PageHero from '@/components/PageHero';
import ContactSection from '@/sections/ContactSection';
import MapSection from '@/sections/MapSection';
import type { JsonObject } from '@prisma/client/runtime/library';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function Contacts() {
  const t = await getTranslations('ContactSection');
  const refTable = await prisma?.refTable.findFirst({
    where: { name: 'contacts' },
  });
  const contacts = refTable?.content as JsonObject;

  return (
    <div className="pb-20 md:pb-28">
      <PageHero title={t('title')} description={t('intro')} />
      <ContactSection data={contacts} hideTitle />
      <MapSection />
    </div>
  );
}
