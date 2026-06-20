import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@i18n/routing";
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
