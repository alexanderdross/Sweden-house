import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Canonical URLs end with a trailing slash (e.g. /en/), and Next redirects
  // non-slashed paths to the slashed version.
  trailingSlash: true,
  images: {
    // Prefer modern formats; Next negotiates AVIF/WebP per browser.
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
