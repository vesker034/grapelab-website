"use client";

import { FC } from "react";
import clsx from "clsx";

// Определяем props, которые принимает компонент
interface HorizontalTubeProps {
  side?: "left" | "right"; // Опционально: определяет выравнивание трубы
  className?: string; // Опционально: позволяет добавить дополнительные классы
}

// Определение функционального компонента
const HorizontalTube: FC<HorizontalTubeProps> = ({
  side = "right", // По умолчанию сторона "right"
  className = "", // По умолчанию className - пустая строка
}) => {
  const isRight = side === "right"; // Определяем направление выравнивания

  return (
    <div
      className={clsx(
        "relative h-[6px] flex items-center", // Контейнер трубы с фиксированной высотой
        // Адаптивная ширина: меньше на мобильных, оригинальная на десктопе
        "w-[40px] sm:w-[50px] md:w-[70px]",
        isRight ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2", // Адаптивные отступы
        className
      )}
    >
      <div className="flex items-center w-full max-w-[500px]">
        {/* Начальная заглушка трубы (скругленная слева) */}
        <div className="h-[6px] w-[6px] rounded-l-full bg-[#f6f6fb] border-t-[1.5px] border-b-[1.5px] border-l-[1.5px] border-[#58427C] border-b-[#77C3DD]" />

        {/* Средняя часть трубы */}
        <div className="flex-1 h-[6px] bg-[#f6f6fb] border-t-[1.5px] border-b-[1.5px] border-[#58427C] border-b-[#77C3DD]" />

        {/* Конечная заглушка трубы (скругленная справа) */}
        <div className="h-[6px] w-[6px] rounded-r-full bg-[#f6f6fb] border-t-[1.5px] border-b-[1.5px] border-r-[1.5px] border-[#58427C] border-b-[#77C3DD]" />
      </div>
    </div>
  );
};

export default HorizontalTube;
