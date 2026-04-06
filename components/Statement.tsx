import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function Statement() {
  return (
    <section
      className="relative overflow-hidden bg-bg-dark py-[60px] sm:py-[80px] lg:py-[100px]"
      aria-label="Posolstvo"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-graphite/80 via-bg-dark to-charcoal/90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(45,212,191,0.25) 0%, transparent 45%)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 text-center sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up">
          <p className="mx-auto max-w-3xl font-heading text-xl font-semibold leading-relaxed text-text-light sm:text-2xl md:text-3xl">
            Právo nie je statický rámec — je to dynamický systém. STRINGS ho
            aplikuje tam, kde sa technológia mení rýchlejšie ako normy.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll variant="fade-up" delay={100} className="mt-8">
          <span className="inline-block h-px w-24 bg-accent" aria-hidden />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
