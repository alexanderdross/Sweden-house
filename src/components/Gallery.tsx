"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { gallery } from "@content/gallery";

export default function Gallery() {
  const t = useTranslations("gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const show = useCallback(
    (dir: number) =>
      setOpenIndex((i) =>
        i === null ? i : (i + dir + gallery.length) % gallery.length,
      ),
    [],
  );

  // Keyboard controls + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(1);
      else if (e.key === "ArrowLeft") show(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, show]);

  const caption = (i: number) => t(`captions.${gallery[i].captionKey}`);

  return (
    <section id="gallery" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
          {t("heading")}
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {gallery.map((image, index) => (
            <button
              key={image.captionKey}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={caption(index)}
              className={`group relative overflow-hidden rounded-2xl bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sea-500 ${
                index === 0 ? "col-span-2 row-span-2 lg:col-span-2" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={caption(index)}
                placeholder="blur"
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="aspect-[4/3] h-full w-full cursor-pointer object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-sea-950/0 transition group-hover:bg-sea-950/10" />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-sea-950/70 to-transparent p-3 text-left text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                {caption(index)}
              </figcaption>
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption(openIndex)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sea-950/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <CloseIcon />
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              show(-1);
            }}
            aria-label={t("previous")}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-6"
          >
            <ChevronIcon className="rotate-180" />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              show(1);
            }}
            aria-label={t("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-6"
          >
            <ChevronIcon />
          </button>

          {/* Image */}
          <div
            className="relative flex max-h-[85vh] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[openIndex].src}
              alt={caption(openIndex)}
              placeholder="blur"
              sizes="100vw"
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
          <p className="mt-4 text-center text-sm text-white/90">
            {caption(openIndex)}
            <span className="ml-2 text-white/50">
              {openIndex + 1} / {gallery.length}
            </span>
          </p>
        </div>
      )}
    </section>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-6 w-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}
