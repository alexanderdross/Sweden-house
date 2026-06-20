"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { faqItems, faqAnchorId } from "@content/faq";

export default function Faq() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<Set<string>>(new Set());

  // Open the accordion referenced by the URL hash (e.g. #faq-how-to-book),
  // both on first load and when the hash changes (in-page links, back/forward).
  const applyHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const match = faqItems.find((i) => faqAnchorId(i.slug) === hash);
    if (!match) return;
    setOpen((prev) => new Set(prev).add(match.slug));
    requestAnimationFrame(() => {
      document
        .getElementById(faqAnchorId(match.slug))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  useEffect(() => {
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [applyHash]);

  const toggle = useCallback((slug: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      // Reflect the open question in the URL for sharing/deep-linking.
      const url = next.has(slug)
        ? `#${faqAnchorId(slug)}`
        : window.location.pathname + window.location.search;
      window.history.replaceState(null, "", url);
      return next;
    });
  }, []);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h2 className="font-serif text-3xl font-semibold text-sea-900 sm:text-4xl">
        {t("heading")}
      </h2>
      <div className="mt-8 divide-y divide-sea-100 rounded-2xl border border-sea-100 bg-white shadow-sm">
        {faqItems.map(({ key, slug }) => {
          const question = t(`q${key}`);
          const isOpen = open.has(slug);
          return (
            <details
              key={slug}
              id={faqAnchorId(slug)}
              open={isOpen}
              className="group scroll-mt-24 px-6 py-5"
            >
              <summary
                title={`${question}, ${t("titleSuffix")}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggle(slug);
                }}
                className="flex cursor-pointer list-none items-center justify-between gap-4"
              >
                <h3 className="font-medium text-sea-900">{question}</h3>
                <span
                  className="text-sea-400 transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-sea-700">
                {t(`a${key}`)}
              </p>
            </details>
          );
        })}
      </div>
    </section>
  );
}
