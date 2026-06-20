import { useLocale, useTranslations } from "next-intl";
import { property } from "@content/property";
import { faqItems } from "@content/faq";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Structured data (JSON-LD) for rich results:
 *  - LodgingBusiness/VacationRental: name, geo, address, amenities, rating
 *  - FAQPage: every FAQ accordion, eligible for FAQ rich snippets
 */
export default function JsonLd() {
  const locale = useLocale();
  const t = useTranslations();
  const url = `${siteUrl}/${locale}/`;

  const lodging = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "VacationRental"],
    name: t("brand"),
    description: t("meta.description"),
    url,
    image: [
      `${siteUrl}/og.jpg`,
      `${siteUrl}/images/exterior.webp`,
      `${siteUrl}/images/living.webp`,
      `${siteUrl}/images/terrace.webp`,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Flatön, Orust",
      addressRegion: "Västra Götaland County",
      addressCountry: "SE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.coordinates.lat,
      longitude: property.coordinates.lng,
    },
    hasMap: property.googleMapsUrl,
    numberOfRooms: property.bedrooms,
    petsAllowed: true,
    smokingAllowed: false,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: property.maxGuests,
      unitText: "guests",
    },
    amenityFeature: property.amenities.map((key) => ({
      "@type": "LocationFeatureSpecification",
      name: t(`amenities.${key}`),
      value: true,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: 1,
      bestRating: "5",
    },
    sameAs: [property.airbnbUrl],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ key }) => ({
      "@type": "Question",
      name: t(`faq.q${key}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.a${key}`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodging) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
