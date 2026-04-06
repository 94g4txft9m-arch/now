"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#o-nas", label: "O nás" },
  { href: "#oblasti-praxe", label: "Oblasti praxe" },
  { href: "#tim", label: "Tím" },
  { href: "#aktuality", label: "Aktuality" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
        solid || open
          ? "bg-bg-dark/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="relative z-50 mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-heading text-xl font-extrabold tracking-[0.2em] text-text-light transition-colors hover:text-accent"
        >
          STRINGS
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hlavná navigácia">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link-underline min-h-[44px] py-2 font-body text-sm font-medium text-text-light/90 transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-text-light md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-transform ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-full rounded bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-full rounded bg-current transition-transform ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-bg-dark transition-all duration-500 ease-smooth md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ paddingTop: "4.5rem" }}
      >
        <nav
          className="flex flex-1 flex-col items-center justify-center gap-6 px-6"
          aria-label="Mobilná navigácia"
        >
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-heading text-2xl font-bold text-text-light transition-all duration-300 hover:text-accent"
              style={{
                transform: open ? "translateY(0)" : "translateY(12px)",
                opacity: open ? 1 : 0,
                transitionDelay: open ? `${80 + i * 60}ms` : "0ms",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
