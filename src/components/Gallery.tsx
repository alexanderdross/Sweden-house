import Image from "next/image";
import { useTranslations } from "next-intl";
import { gallery } from "@content/gallery";

export default function Gallery() {
  const t = useTranslations("gallery");

  return (
    <section id="gallery" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
          {t("heading")}
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.map((image, index) => (
            <figure
              key={image.captionKey}
              className={`group relative overflow-hidden rounded-2xl bg-sand-100 ${
                index === 0 ? "col-span-2 row-span-2 lg:col-span-2" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={t(`captions.${image.captionKey}`)}
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sea-950/70 to-transparent p-3 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                {t(`captions.${image.captionKey}`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
