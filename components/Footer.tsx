import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import Link from "next/link";

const quick = [
  { href: "#o-nas", label: "O nás" },
  { href: "#oblasti-praxe", label: "Oblasti praxe" },
  { href: "#tim", label: "Tím" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-bg-dark py-12 sm:py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="clip" className="mb-10">
          <div className="h-px w-full max-w-xs bg-accent" />
        </AnimateOnScroll>

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-heading text-lg font-extrabold tracking-[0.2em] text-text-light">
              STRINGS
            </p>
            <p className="mt-4 text-sm text-text-muted-light">
              © 2025 STRINGS. Všetky práva vyhradené.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-3"
            aria-label="Rýchla navigácia v pätičke"
          >
            {quick.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link-underline text-sm text-text-muted-light transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-text-muted-light/80">
          Informácie na tejto stránke majú informatívny charakter a nepredstavujú
          právne poradenstvo. Pre konkrétny prípad nás prosím kontaktujte
          priamo.
        </p>
      </div>
    </footer>
  );
}
