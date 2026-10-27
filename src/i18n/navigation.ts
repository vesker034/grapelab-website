import {createNavigation} from "next-intl/navigation";
import {defaultLocale, locales} from "@/config";

export const {Link, usePathname, useRouter} = createNavigation({
  locales,
  defaultLocale,
  localePrefix: process.env.NODE_ENV === "development" ? "always" : "as-needed",
});
