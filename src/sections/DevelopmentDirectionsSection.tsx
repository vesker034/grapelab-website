"use client";

import DevelopmentDirectionCard from "@/components/DevAreaCard";
import { useTranslations } from "@/lib/localize";
import { normalizeImagePath } from "@/lib/pathutils";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

interface DevDirectionRenderedCard {
  name: string;
  description: string | null;
  imagePath: string | null;
}

const hoverEffect = {
  rest: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const layout = [0, 0, 1, 1, 2, 2, 0, 0, 0];

const styles = [
  (
    cardData: DevDirectionRenderedCard,
    _t: ReturnType<typeof useTranslations>,
    index: number,
  ) => (
    <motion.div
      key={index}
      variants={hoverEffect}
      initial="rest"
      whileHover="hover"
      className="w-full col-span-1 lg:col-span-1 h-full rounded-lg"
    >
      <DevelopmentDirectionCard
        title={cardData.name}
        description={cardData.description ?? ""}
        logoSrc={normalizeImagePath(cardData?.imagePath as string | undefined)}
        className="w-full h-full"
        bgColor="bg-[#58427C]"
        textColor="text-white"
      />
    </motion.div>
  ),

  (
    cardData: DevDirectionRenderedCard,
    _t: ReturnType<typeof useTranslations>,
    index: number,
  ) => (
    <motion.div
      variants={hoverEffect}
      key={index}
      initial="rest"
      whileHover="hover"
      className="w-full col-span-1 lg:col-span-1 lg:row-span-2 bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[2px] rounded-lg"
    >
      <div className="h-full bg-card-inner text-headings-draft rounded-md p-6 flex flex-col justify-between items-center text-center overflow-hidden">
        <div className="flex flex-col items-center flex-1">
          <Image
            src={normalizeImagePath(cardData?.imagePath as string | undefined)}
            alt={cardData.name}
            width={180}
            height={180}
            className="object-contain mb-6"
          />
          <h3 className="text-base font-bold mb-3 leading-tight line-clamp-2 break-words text-primary">
            {cardData.name}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-5 break-words px-1 text-muted">
            {cardData.description ?? ""}
          </p>
        </div>
      </div>
    </motion.div>
  ),

  (
    cardData: DevDirectionRenderedCard,
    _t: ReturnType<typeof useTranslations>,
    index: number,
  ) => (
    <motion.div
      key={index}
      variants={hoverEffect}
      initial="rest"
      whileHover="hover"
      className="w-full col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-b from-[#58427C] to-[#77C3DD] p-[1.5px] rounded-lg"
    >
      <div className="h-full bg-card-inner rounded-md p-6 flex flex-col md:flex-row items-center md:justify-between overflow-hidden">
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <h3 className="text-base font-bold mb-3 leading-tight line-clamp-2 break-words text-primary">
            {cardData.name}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-5 break-words text-muted">
            {cardData.description ?? ""}
          </p>
        </div>
        <Image
          src={normalizeImagePath(cardData?.imagePath as string | undefined)}
          alt={cardData.name}
          width={170}
          height={170}
          className="object-contain mt-6 md:mt-0 md:ml-6"
        />
      </div>
    </motion.div>
  ),
];

interface DevelopmentDirectionsSectionProps {
  data: DevDirectionRenderedCard[];
}

const DevelopmentDirectionsSection: FC<DevelopmentDirectionsSectionProps> = ({
  data,
}) => {
  const t = useTranslations("DevelopmentDirectionsSection");

  return (
    <section className="max-w-[1200px] mx-auto py-12 px-4 select-none">
      <h2 className="font-semibold mb-10 text-textPrimary text-[30px] sm:text-[32px] md:text-[36px] leading-[36px]">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((card, index) =>
          styles[layout[index % layout.length]](card, t, index),
        )}
      </div>
    </section>
  );
};

export default DevelopmentDirectionsSection;
