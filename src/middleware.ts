import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { defaultLocale, locales } from "./config";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: process.env.NODE_ENV === "development" ? "always" : "as-needed",
});

const ADMIN_PATHS = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminPath) {
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|icons|avatars|.*\\..*).*)",
    "/",
  ],
};
