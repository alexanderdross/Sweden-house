import Image from "next/image";
import { useTranslations } from "next-intl";
import { heroImage } from "@content/gallery";

export default function Hero() {
  const t = useTranslations("hero");
  const tg = useTranslations("gallery");

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Image
        src={heroImage}
        alt={tg("captions.exterior")}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-sea-950/55 via-sea-950/35 to-sea-950/70" />
      <div className="mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl text-white">
          <h1 className="font-serif text-4xl font-semibold leading-tight drop-shadow-sm sm:text-5xl md:text-6xl">
            {t("tagline")}
          </h1>
          <p className="mt-5 text-lg text-white/90 sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#booking"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-sea-900 shadow-md transition hover:bg-sand-100"
            >
              {t("cta")}
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-white/70 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
