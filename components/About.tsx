import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { CountUp } from "@/components/ui/CountUp";

export function About() {
  return (
    <section
      id="o-nas"
      className="relative overflow-hidden bg-bg-primary py-[60px] sm:py-[80px] lg:py-[120px]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up" className="mb-12">
          <h2 className="text-text-primary">O nás</h2>
        </AnimateOnScroll>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-16">
          <div className="space-y-8">
            <AnimateOnScroll variant="fade-up">
              <p className="text-text-secondary">
                Advokátska kancelária STRINGS poskytuje právne služby na
                priesečníku práva a technológií. Špecializujeme sa na IT právo,
                ochranu osobných údajov, právo duševného vlastníctva a obchodné
                právo s dôrazom na technologické spoločnosti.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fade-up" delay={80}>
              <p className="text-text-secondary">
                Náš tím má skúsenosti s právnym poradenstvom pre startupy,
                technologické firmy, e-commerce platformy a medzinárodné
                korporácie vstupujúce na slovenský trh.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-up" delay={120}>
              <blockquote className="relative border-l-4 border-accent pl-6 font-heading text-lg font-medium text-text-primary">
                Dôvera vzniká tam, kde sa presnosť stretáva s predvídavosťou —
                v práve, ktoré rozumie technológii.
              </blockquote>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fade-up" delay={160}>
              <div className="grid grid-cols-1 gap-6 border-t border-border-light pt-8 sm:grid-cols-3">
                <div>
                  <p className="font-heading text-3xl font-bold text-accent">
                    <CountUp end={15} suffix="+" />
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    rokov skúseností v TMT
                  </p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-accent">
                    <CountUp end={120} suffix="+" />
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    projektov pre tech klientov
                  </p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-accent">
                    <CountUp end={24} />
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    jurisdikcií v súkromí údajov
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll variant="slide-right" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border-light bg-bg-section-alt shadow-card">
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 11px,
                    rgba(45,212,191,0.4) 11px,
                    rgba(45,212,191,0.4) 12px
                  )`,
                }}
              />
              <div className="absolute inset-4 border border-accent/20" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-heading text-xs font-bold uppercase tracking-widest text-accent">
                  Editorial
                </p>
                <p className="mt-2 font-heading text-xl font-bold text-text-primary">
                  Presnosť · Diskrétnosť · Miera
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-text-secondary">
              [ vizuálna poznámka · sieťová mriežka ]
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
