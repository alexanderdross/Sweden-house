/**
 * Photo gallery using Next.js static image imports.
 *
 * Static imports let Next.js infer each image's width/height automatically
 * (no layout shift) and generate a blurred placeholder. Images are self-hosted
 * WebP files under /public/images and served via next/image, which lazy-loads
 * them and can negotiate AVIF/WebP per browser.
 *
 * `captionKey` maps to `gallery.captions.<key>` in messages/<locale>.json so
 * every alt text is fully localized.
 */
import type { StaticImageData } from "next/image";
import exterior from "../public/images/exterior.webp";
import kitchen from "../public/images/kitchen.webp";
import kitchenDetail from "../public/images/kitchen-detail.webp";
import living from "../public/images/living.webp";
import dining from "../public/images/dining.webp";
import terrace from "../public/images/terrace.webp";
import bathroom from "../public/images/bathroom.webp";
import fireplace from "../public/images/fireplace.webp";
import bedroom from "../public/images/bedroom.webp";
import bedroomSingle from "../public/images/bedroom-single.webp";
import sea from "../public/images/sea.webp";

export interface GalleryImage {
  src: StaticImageData;
  /** i18n key under `gallery.captions`. Used as the localized alt text. */
  captionKey: string;
}

/** The large hero / Open Graph image. */
export const heroImage = exterior;

export const gallery: GalleryImage[] = [
  { src: exterior, captionKey: "exterior" },
  { src: kitchen, captionKey: "kitchen" },
  { src: living, captionKey: "living" },
  { src: terrace, captionKey: "terrace" },
  { src: dining, captionKey: "dining" },
  { src: bathroom, captionKey: "bathroom" },
  { src: fireplace, captionKey: "fireplace" },
  { src: bedroom, captionKey: "bedroom" },
  { src: bedroomSingle, captionKey: "bedroomSingle" },
  { src: kitchenDetail, captionKey: "kitchenDetail" },
  { src: sea, captionKey: "sea" },
];
