import createMiddleware from "next-intl/middleware";
import { routing } from "@i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match the root, locale-prefixed paths, and everything except API routes,
  // Next internals and files with an extension.
  matcher: ["/", "/(sv|en|da|fi|de)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
