import { prisma } from '@/lib/prisma';
import PageHero from '@/components/PageHero';
import DevelopmentProcessSection from '@/sections/DevelopmentProcessSection';
import Cases from '@/sections/ExtendedCasesSection';
import TechnologiesSection from '@/sections/TechnologiesSection';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0;

export default async function Portfolio() {
    const t = await getTranslations('Portfolio');

    const projects = await prisma.project.findMany({
        where: { isVisible: true },
        orderBy: { startDate: 'desc' },
        include: {
            direction: true
        }
    });

    const techstack = await prisma?.refTable.findFirst({
        where: { name: 'techstack' },
    });

    return (
        <div className="pb-20 md:pb-28">
            <PageHero title={t('heroTitle')} description={t('heroIntro')} />
            <DevelopmentProcessSection />
            <Cases data={projects} />
            <TechnologiesSection data={techstack} />
        </div>
    );
}
