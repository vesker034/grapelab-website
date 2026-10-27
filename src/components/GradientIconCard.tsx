"use client"; // Обеспечивает работу компонента на клиентской стороне (важно для интерактивного UI в Next.js)

import { FC } from "react";
import Image from "next/image";
import clsx from "clsx"; // Утилита для условного объединения имен классов

// Определяем props, принимаемые компонентом
interface GradientIconCardProps {
  title: string;
  description: string;
  iconSrc: string;
  circlePosition?: "left" | "right"; // Опционально: определяет позицию круга с иконкой
}

// Определение функционального компонента
const GradientIconCard: FC<GradientIconCardProps> = ({
  title,
  description,
  iconSrc,
  circlePosition = "left", // По умолчанию позиция круга слева
}) => {
  const isLeft = circlePosition === "left"; // Определяем, находится ли круг с иконкой слева

  return (
    <div className="relative group transition-all duration-300 hover:-translate-y-1 w-full max-w-[550px]">
      {/* Адаптивный контейнер */}
      <div
        className={clsx(
          "w-full rounded-md p-[2px] bg-gradient-to-r from-[#58427C] to-[#77C3DD]",
          // Адаптивная высота: меньше на мобильных устройствах
          "h-[120px] sm:h-[140px] md:h-[160px]"
        )}
      >
        {/* Внутренняя белая карточка */}
        <div
          className={clsx(
            "relative bg-card-inner w-full h-full rounded-md flex items-center text-headings-draft overflow-hidden",
            // Мобильные: центрированный контент, Десктоп: смещение для круга
            "px-4 sm:px-6",
            "md:pl-6 md:pr-6",
            isLeft ? "xl:pl-[100px] xl:pr-6" : "xl:pl-6 xl:pr-[100px]"
          )}
        >
          {/* Эффект градиента при наведении внутри карточки */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#58427C] via-transparent to-[#77C3DD] opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

          {/* Текстовый контент (заголовок и описание) */}
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Круглый контейнер с иконкой - скрыт на мобильных, виден на больших экранах */}
      <div
        className={clsx(
          "absolute top-0 rounded-full bg-card-inner border-[1px] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105",
          // Цвета градиентной границы
          "border-l-[#58427C] border-t-[#58427C] border-b-[#77C3DD] border-r-[#77C3DD]",
          // Скрыт на мобильных, показан на десктопе
          "hidden xl:flex",
          // Адаптивный размер
          "w-[140px] h-[120px] sm:w-[150px] sm:h-[140px] md:w-[166px] md:h-[160px]",
          // Позиция в зависимости от prop
          isLeft
            ? "-left-[70px] sm:-left-[80px] md:-left-[90px]"
            : "-right-[70px] sm:-right-[80px] md:-right-[90px]"
        )}
      >
        {/* Эффект градиента при наведении внутри круга */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#58427C] via-transparent to-[#77C3DD] opacity-0 group-hover:opacity-15 transition-opacity duration-300 z-0" />

        {/* Сама иконка */}
        <div className="relative z-10">
          <Image
            src={iconSrc}
            alt="icon"
            width={60}
            height={60}
            className="object-contain transition-transform duration-300 group-hover:scale-110 icon-dark-mode"
          />
        </div>
      </div>

    </div>
  );
};

export default GradientIconCard;
