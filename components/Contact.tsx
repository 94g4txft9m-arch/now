import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function Contact() {
  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-bg-dark py-[60px] sm:py-[80px] lg:py-[120px]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,212,191,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up" className="mb-12 text-center">
          <h2 className="text-text-light">Kontakt</h2>
          <p className="mt-3 text-text-muted-light">
            Spojte sa s nami — diskrétne a vecne.
          </p>
        </AnimateOnScroll>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <AnimateOnScroll variant="fade-up" delay={0}>
            <div className="rounded-sm border border-border-dark bg-graphite/40 p-8 backdrop-blur-sm">
              <h3 className="font-heading text-lg font-bold text-text-light">
                Adresa
              </h3>
              <p className="mt-3 text-text-muted-light">
                Šoltésovej 14
                <br />
                811 08 Bratislava
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fade-up" delay={120}>
            <div className="space-y-6 rounded-sm border border-border-dark bg-graphite/40 p-8 backdrop-blur-sm">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-light">
                  Telefón
                </h3>
                <a
                  href="tel:+421254410024"
                  className="mt-2 block text-lg text-accent transition-colors hover:text-text-light"
                >
                  +421 2 5441 0024
                </a>
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-text-light">
                  E-mail
                </h3>
                <a
                  href="mailto:office@strings.legal"
                  className="mt-2 block text-lg text-accent transition-colors hover:text-text-light"
                >
                  office@strings.legal
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
