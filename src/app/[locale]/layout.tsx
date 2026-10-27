import IntlClientProvider from "@/components/IntlClientProvider";
import { getBrandName, locales } from "@/config";
import { prisma } from "@/lib/prisma";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import type { JsonObject } from "@prisma/client/runtime/library";
import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import "../globals.css";
import { SnowfallFeature } from "@/components/features/SnowfallFeature";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const brandName = getBrandName(locale);
  const t = await getTranslations({ locale, namespace: "Layout" });

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`,
    },
    description: t("description"),
    keywords: ["software", "development", "IT", "solutions", "web", "mobile"],
    icons: {
      icon: "/favicon.ico",
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: Readonly<Props>) {
  const { locale } = await params;

  const messages = await getMessages({ locale });
  let contacts: JsonObject = {};

  try {
    const refTable = await prisma?.refTable.findFirst({
      where: { name: "contacts" },
    });
    contacts = (refTable?.content as JsonObject | undefined) ?? {};
  } catch (error) {
    console.error("Failed to load contacts from database", error);
  }

  const fontClass = locale === "ar" ? "font-arabic" : "font-sans-local";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${fontClass} overflow-x-clip`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`antialiased bg-site text-primary overflow-x-clip`}>
        <SnowfallFeature />
        <div className="content max-w-full overflow-x-clip">
          <IntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer data={contacts} />
            <ScrollToTopButton />
          </IntlClientProvider>
        </div>
      </body>
    </html>
  );
}
