import { MetadataRoute } from "next";
import { headers } from "next/headers";

const PREVIEW_HOST = "preview.grapelab.ru";

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const rawHost = headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const host = rawHost.split(":")[0].toLowerCase();
  const proto = headersList.get("x-forwarded-proto") || "https";
  const baseUrl = rawHost ? `${proto}://${rawHost}` : "https://grapelab.ru";

  if (host === PREVIEW_HOST) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

