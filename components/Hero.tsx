import Link from "next/link";

export function Hero() {
  return (
    <section
      className="hero-root flex flex-col justify-end pb-16 pt-28 sm:pb-20 sm:pt-32"
      aria-label="Úvod"
    >
      <div className="hero-gradient-layer" aria-hidden />
      <div className="hero-grid-layer" aria-hidden />

      <svg
        className="hero-orbital pointer-events-none absolute left-1/2 top-1/2 h-[min(120vw,900px)] w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle
          cx="200"
          cy="200"
          r="160"
          stroke="url(#g1)"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <path
          d="M 40 200 Q 200 80 360 200"
          stroke="url(#g1)"
          strokeWidth="0.5"
          opacity="0.35"
        />
        <path
          d="M 60 260 Q 200 120 340 260"
          stroke="url(#g1)"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="400" y2="400">
            <stop stopColor="#2dd4bf" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <h1 className="hero-title max-w-4xl font-heading font-extrabold text-text-light text-balance">
          Advokáti v dobe kvantovej fyziky
        </h1>
        <p className="hero-subline mt-6 max-w-2xl text-lg text-text-muted-light sm:text-xl">
          Právna prax na hranici technológie, regulácie a inovácií. Spájame právo
          s budúcnosťou.
        </p>
        <div className="hero-cta-wrap mt-10">
          <Link
            href="#kontakt"
            className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-sm bg-accent px-8 py-3 font-heading font-bold text-charcoal shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(45,212,191,0.35)]"
          >
            Poraďte sa s nami
          </Link>
        </div>

        <div className="hero-scroll-hint mt-20 flex flex-col items-center gap-2 text-text-muted-light">
          <span className="text-xs uppercase tracking-[0.25em]">Posunúť</span>
          <svg
            className="h-6 w-6 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
