import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@i18n/routing";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import Location from "@/components/Location";
import AreaGuide from "@/components/AreaGuide";
import BookingSection from "@/components/BookingSection";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Page-level canonical + hreflang alternates (all trailing-slashed). Defined
// here, not in the layout, so the annotations belong to the content page and
// are not inherited by other routes (e.g. the locale not-found page).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}/`]),
  );
  languages["x-default"] = `${siteUrl}/${defaultLocale}/`;

  return {
    alternates: {
      canonical: `${siteUrl}/${locale}/`,
      languages,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Amenities />
        <Location />
        <AreaGuide />
        <BookingSection />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
