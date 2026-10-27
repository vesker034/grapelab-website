"use client"; // Обеспечивает отображение компонента на клиентской стороне в Next.js

import { FC } from "react";
import HorizontalTube from "@/components/HorizontalTube";
import GradientIconCard from "@/components/GradientIconCard";
import { useTranslations } from "@/lib/localize";

// Функциональный компонент, отображающий вертикальный процесс разработки с горизонтальными ответвлениями
const DevelopmentProcessTubeOnly: FC = () => {
  // Данные для этапов процесса

  const t = useTranslations("DevelopmentProcessSection");

  const processSteps = [
    {
      title: t("analyticalWorkshop.title"),
      description: t("analyticalWorkshop.description"),
      iconSrc: "/icons/information.png",
      circlePosition: "right" as const,
    },
    {
      title: t("solutionDesign.title"),
      description: t("solutionDesign.description"),
      iconSrc: "/icons/design-process.png",
      circlePosition: "left" as const,
    },
    {
      title: t("development.title"),
      description: t("development.description"),
      iconSrc: "/icons/web-development.png",
      circlePosition: "right" as const,
    },
    {
      title: t("testing.title"),
      description: t("testing.description"),
      iconSrc: "/icons/test.png",
      circlePosition: "left" as const,
    },
    {
      title: t("launchSupport.title"),
      description: t("launchSupport.description"),
      iconSrc: "/icons/maintenance.png",
      circlePosition: "right" as const,
    },
    {
      title: t("maintenance.title"),
      description: t("maintenance.description"),
      iconSrc: "/icons/server-maintenance.png",
      circlePosition: "left" as const,
    },
  ];

  return (
    <section
      id="development-process-section"
      dir="ltr"
      className="mx-auto mt-10 w-[min(1180px,88vw)] pb-20 md:mt-14"
    >
      <div className="w-full">
        <h2 className="mb-12 text-3xl font-semibold leading-tight text-[var(--color-primary-text)] md:mb-16 md:text-[34px]">
          {t("title")}
        </h2>

        {/* Мобильная версия - простой вертикальный список */}
        <div className="xl:hidden flex justify-center">
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <div key={index} className="w-full">
                <GradientIconCard
                  title={step.title}
                  description={step.description}
                  iconSrc={step.iconSrc}
                  circlePosition={step.circlePosition}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Десктопная версия - оригинальный дизайн с трубами */}
        <div className="hidden xl:block relative h-[930px]">
          {/* Вертикальная центральная труба (стилизованная как тонкая вертикальная труба) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-[920px] w-[8px] z-0 flex flex-col items-center">
            {/* Верхняя заглушка вертикальной трубы */}
            <div className="w-[6px] h-[12px] rounded-t-full border-l-[1.5px] border-r-[1.5px] border-[#58427C] border-r-[#77C3DD] bg-card-inner" />
            {/* Тело трубы */}
            <div className="flex-1 w-[6px] bg-card-inner border-l-[1.5px] border-r-[1.5px] border-[#58427C] border-r-[#77C3DD]" />
            {/* Нижняя заглушка трубы */}
            <div className="w-[6px] h-[12px] rounded-b-full border-l-[1.5px] border-r-[1.5px] border-[#58427C] border-r-[#77C3DD] bg-card-inner" />
          </div>

          {/* --- Первый этап --- */}
          <HorizontalTube
            side="right"
            className="absolute top-[5px] left-1/2 -translate-x-[60px]"
          />
          <div className="absolute top-[-75px] left-1/2 translate-x-[-695px]">
            <GradientIconCard
              title={t("analyticalWorkshop.title")}
              description={t("analyticalWorkshop.description")}
              iconSrc="/icons/information.png"
              circlePosition="right"
            />
          </div>

          {/* --- Второй этап --- */}
          <HorizontalTube
            side="right"
            className="absolute top-[190px] left-1/2 -translate-x-[28px]"
          />
          <div className="absolute top-[118px] left-1/2 -translate-x-[-143px] flex items-center gap-3">
            <GradientIconCard
              title={t("solutionDesign.title")}
              description={t("solutionDesign.description")}
              iconSrc="/icons/design-process.png"
            />
          </div>

          {/* --- Третий этап --- */}
          <HorizontalTube
            side="right"
            className="absolute top-[350px] left-1/2 -translate-x-[60px]"
          />
          <div className="absolute top-[290px] left-1/2 translate-x-[-695px]">
            <GradientIconCard
              title={t("development.title")}
              description={t("development.description")}
              iconSrc="/icons/web-development.png"
              circlePosition="right"
            />
          </div>

          {/* --- Четвертый этап --- */}
          <HorizontalTube
            side="right"
            className="absolute top-[560px] left-1/2 -translate-x-[28px]"
          />
          <div className="absolute top-[500px] left-1/2 -translate-x-[-143px] flex items-center gap-3">
            <GradientIconCard
              title={t("testing.title")}
              description={t("testing.description")}
              iconSrc="/icons/test.png"
            />
          </div>

          {/* --- Пятый этап --- */}
          <HorizontalTube
            side="right"
            className="absolute top-[710px] left-1/2 -translate-x-[60px]"
          />
          <div className="absolute top-[652px] left-1/2 translate-x-[-695px]">
            <GradientIconCard
              title={t("launchSupport.title")}
              description={t("launchSupport.description")}
              iconSrc="/icons/maintenance.png"
              circlePosition="right"
            />
          </div>

          {/* --- Финальный этап --- */}
          <HorizontalTube
            side="right"
            className="absolute top-[878px] left-1/2 -translate-x-[28px]"
          />
          <div className="absolute top-[830px] left-1/2 -translate-x-[-143px] flex items-center gap-3">
            <GradientIconCard
              title={t("maintenance.title")}
              description={t("maintenance.description")}
              iconSrc="/icons/server-maintenance.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentProcessTubeOnly; // Экспорт компонента для использования
