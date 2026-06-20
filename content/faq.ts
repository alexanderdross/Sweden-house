/**
 * FAQ items. Each has:
 *  - `key`: the suffix for `faq.q<key>` / `faq.a<key>` in messages/<locale>.json
 *  - `slug`: a stable, SEO-friendly URL hash so a question can be deep-linked
 *    and opened directly, e.g. `/en#faq-how-to-book`.
 *
 * Slugs are kept stable across locales so shared links never break.
 */
export interface FaqItem {
  key: string;
  slug: string;
}

export const faqItems: FaqItem[] = [
  { key: "1", slug: "how-to-book" },
  { key: "2", slug: "check-in-check-out" },
  { key: "3", slug: "dog-friendly" },
  { key: "4", slug: "getting-to-flaton" },
  { key: "5", slug: "same-as-airbnb" },
  { key: "6", slug: "whats-included" },
  { key: "7", slug: "swimming-nearby" },
];

/** The id used on each accordion element and in its URL hash. */
export const faqAnchorId = (slug: string) => `faq-${slug}`;
