"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function MobileMenu({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const t = useTranslations();
  const nav = useTranslations("nav");
  const gallery = useTranslations("gallery");
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={nav("menu")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sea-200 text-sea-800"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-sea-950/40"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-1 bg-sand-50 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-serif font-semibold text-sea-800">
                {nav("menu")}
              </span>
              <button
                type="button"
                aria-label={gallery("close")}
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-sea-500 hover:text-sea-800"
              >
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
              </button>
            </div>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                title={`${link.label}, ${t("brand")}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-sea-800 hover:bg-sea-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              title={`${nav("book")}, ${t("brand")}`}
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-sea-700 px-4 py-3 text-center text-base font-semibold text-white"
            >
              {nav("bookNow")}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
