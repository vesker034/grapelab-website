import { useTranslations } from "@/lib/localize";
import { resolveMaxUrl } from "@/lib/contactLinks";
import type { JsonObject } from "@prisma/client/runtime/library";
import Image from "next/image";
import { FC } from "react";
import { useLocale } from "next-intl"; //

interface ContactsSectionProps {
  data: JsonObject;
  hideTitle?: boolean;
}

const Contacts: FC<ContactsSectionProps> = ({ data, hideTitle = false }) => {
  const t = useTranslations("ContactSection");
  const locale = useLocale(); //
  const isRTL = locale === "ar"; //
  const maxUrl = resolveMaxUrl(data.max);

  const workhours: number[] = (data.workhours as number[]) || [9, 18];
  let workdays: string[] = (data.workdays as string[]) || [
    "from_monday",
    "from_friday",
  ];
  const dayoff: string | null = data.dayoff
    ? t("workingHours." + data.dayoff)
    : null;
  const breakhours: number[] | null = data.breakhours as number[] | null;

  workdays = workdays.map((day) => {
    return t("workingHours." + day);
  });

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className={`container bg-site ${hideTitle ? "pb-12 pt-0" : "py-12"}`}
    >
      <div className="max-w-[1200px] mx-auto px-4">
        {!hideTitle ? (
          <h2
            className={`text-[36px] font-semibold text-headings mb-8 leading-[100%] ${
              isRTL ? "text-right" : "md:text-left"
            }`}
          >
            {t("title")}
          </h2>
        ) : null}

        <div
          className={`flex flex-col lg:flex-row justify-between items-center lg:items-start gap-y-8 lg:gap-x-8 ${
            isRTL ? "text-right" : "lg:text-left"
          }`}
        >
          <div className="w-full lg:w-72 lg:shrink-0 text-[18px] md:text-[20px] font-normal leading-[30px] text-muted">
            <p>
              {t("workingHours.line1")}
              <br />
              {t("workingHours.from")} {workdays[0] ?? t("from_monday")}{" "}
              {t("workingHours.to_days")} {workdays[1] ?? t("from_friday")}
              <br />
              {dayoff ? t("workingHours.dayoff") + " - " + dayoff : ""}
              <br />
              {t("workingHours.from")} {workhours[0] ?? 9}{" "}
              {t("workingHours.to_hours")} {workhours[1] ?? 18}
              <br />
              {breakhours
                ? [
                    t("workingHours.break"),
                    t("workingHours.from"),
                    breakhours[0],
                    t("workingHours.to_hours"),
                    breakhours[1],
                  ].join(" ")
                : ""}
            </p>
          </div>

          <div className="w-full lg:w-[222px] lg:shrink-0 text-[18px] md:text-[20px] leading-[30px]">
            <p className="font-semibold text-buttons mb-1">{t("callUs")}</p>
            <p className="mb-3 text-muted font-normal">
              {data.phone ? (
                <a
                  href={`tel:${data.phone}`}
                  className="text-muted hover:underline"
                >
                  {data.phone as string}
                </a>
              ) : (
                ""
              )}
            </p>

            <p className="font-semibold text-buttons mb-1">{t("writeUs")}</p>
            <p className="mb-3 text-muted font-normal">
              {data.email ? (
                <a
                  href={`mailto:${data.email}`}
                  className="text-muted hover:underline"
                >
                  {data.email as string}
                </a>
              ) : (
                ""
              )}
            </p>

            <p className="font-semibold text-buttons mb-1">{t("visitUs")}</p>
            <p className="text-muted font-normal">
              {t(data.address as string) ?? ""}
            </p>
          </div>

          {/* Правая колонка с соцсетями */}
          <div className="w-full lg:flex-1 lg:max-w-[480px]">
            <h3 className="text-[20px] font-semibold mb-2 text-buttons leading-[30px]">
              {t("socialMedia")}
            </h3>
            <div className="flex gap-4">
              <a
                href={
                  (data.telegram as string)
                    ? `https://t.me/${data.telegram}`
                    : "#"
                }
                target="_blank"
              >
                <Image
                  src="/icons/contacts_telegram.svg"
                  alt="Telegram"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] lg:w-[100px] lg:h-[80px] icon-dark-mode"
                />
              </a>
              <a
                href={(data.vk as string) ? `https://vk.me/${data.vk}` : "#"}
                target="_blank"
              >
                <Image
                  src="/icons/contacts_vk.svg"
                  alt="VK"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] lg:w-[100px] lg:h-[80px] icon-dark-mode"
                />
              </a>
              <a
                href={(data.email as string) ? `mailto:${data.email}` : "#"}
                target="_blank"
              >
                <Image
                  src="/icons/contacts_email.svg"
                  alt="Email"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] lg:w-[100px] lg:h-[80px] icon-dark-mode"
                />
              </a>
              <a
                href={maxUrl ?? "#"}
                target="_blank"
              >
                <Image
                  src="/icons/contacts_max.svg"
                  alt="Max"
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] lg:w-[100px] lg:h-[80px] icon-dark-mode"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
