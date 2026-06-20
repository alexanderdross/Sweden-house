import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Prefer modern formats; Next negotiates AVIF/WebP per browser.
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
