"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Modal behaviour while open: scroll lock, Escape to close, focus trap, and
  // returning focus to the toggle on close.
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    // Move focus into the dialog.
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Return focus to the toggle when the menu closes (but not on first mount).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-label={nav("menu")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sea-200 text-sea-800"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-sea-950/50"
          onClick={close}
        >
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-1 bg-sand-50 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                id="mobile-menu-title"
                className="font-serif font-semibold text-sea-800"
              >
                {nav("menu")}
              </span>
              <button
                ref={closeRef}
                type="button"
                aria-label={gallery("close")}
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sea-500 hover:text-sea-800"
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
            <nav aria-label={nav("menu")} className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  title={`${link.label}, ${t("brand")}`}
                  onClick={close}
                  className="rounded-lg px-3 py-3 text-base font-medium text-sea-800 hover:bg-sea-100"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#booking"
                title={`${nav("book")}, ${t("brand")}`}
                onClick={close}
                className="mt-3 rounded-full bg-sea-700 px-4 py-3 text-center text-base font-semibold text-white hover:bg-sea-800"
              >
                {nav("bookNow")}
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
