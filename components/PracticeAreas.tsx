import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

function IconTech() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-accent" aria-hidden>
      <rect
        x="8"
        y="10"
        width="32"
        height="28"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16 18h16M16 24h10M16 30h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="14" r="3" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function IconPrivacy() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-accent" aria-hidden>
      <path
        d="M24 8L10 14v12c0 9 6 16 14 18 8-2 14-9 14-18V14L24 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18 24l4 4 8-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBusiness() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-accent" aria-hidden>
      <rect
        x="10"
        y="18"
        width="28"
        height="22"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16 18V14a8 8 0 0116 0v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M24 26v6M20 29h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLitigation() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-accent" aria-hidden>
      <path
        d="M14 38h20M18 38V22l6-10 6 10v16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 22h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

const areas = [
  {
    title: "Technológie",
    body: "Právne poradenstvo pre technologické spoločnosti — IT zmluvy, licencie softvéru, SaaS podmienky, cloudové služby, blockchain a smart kontrakty. Pomáhame firmám navigovať právne výzvy digitálnej ekonomiky.",
    Icon: IconTech,
    featured: true,
  },
  {
    title: "GDPR a Privacy",
    body: "Komplexné služby v oblasti ochrany osobných údajov — GDPR audity, príprava dokumentácie, riešenie bezpečnostných incidentov, DPO služby, medzinárodné prenosy údajov. Zabezpečujeme súlad s najprísnejšími štandardmi.",
    Icon: IconPrivacy,
    featured: false,
  },
  {
    title: "Business a podnikanie",
    body: "Korporátne právo pre rastúce firmy — zakladanie spoločností, fúzie a akvizície, investičné kolá, obchodné zmluvy, corporate governance. Od seed fázy po exit.",
    Icon: IconBusiness,
    featured: false,
  },
  {
    title: "Litigation",
    body: "Zastupovanie v sporoch s technologickým rozmerom — porušenie IP práv, doménové spory, nekalosúťažné konanie, spory z IT zmlúv, cezhraničné spory.",
    Icon: IconLitigation,
    featured: false,
  },
] as const;

export function PracticeAreas() {
  const [featured, gdpr, business, litigation] = areas;
  const FeaturedIcon = featured.Icon;
  const GdprIcon = gdpr.Icon;
  const BusinessIcon = business.Icon;
  const LitigationIcon = litigation.Icon;

  return (
    <section
      id="oblasti-praxe"
      className="relative bg-bg-section-alt py-[60px] sm:py-[80px] lg:py-[120px]"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up" className="mb-14 max-w-2xl">
          <h2 className="text-text-primary">Oblasti praxe</h2>
          <p className="mt-4 text-text-secondary">
            Špecializované právne kompetencie pre digitálnu ekonomiku — od
            zmlúv po súdne konanie.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" className="mb-10">
          <article className="group relative overflow-hidden rounded-sm border border-border-light bg-bg-card p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-card-hover md:p-10 lg:p-12">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br from-accent/10 to-accent-secondary/5 opacity-60 transition-opacity group-hover:opacity-100" />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
              <FeaturedIcon />
              <div>
                <h3 className="text-text-primary">{featured.title}</h3>
                <p className="mt-4 text-text-secondary">{featured.body}</p>
              </div>
            </div>
          </article>
        </AnimateOnScroll>

        <div className="grid gap-8 lg:grid-cols-2">
          <AnimateOnScroll variant="fade-up" delay={120}>
            <article className="group h-full rounded-sm border border-border-light bg-bg-card p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-card-hover">
              <GdprIcon />
              <h3 className="mt-6 text-text-primary">{gdpr.title}</h3>
              <p className="mt-3 text-text-secondary">{gdpr.body}</p>
            </article>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fade-up" delay={240}>
            <article className="group h-full rounded-sm border border-border-light bg-bg-card p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-card-hover">
              <BusinessIcon />
              <h3 className="mt-6 text-text-primary">{business.title}</h3>
              <p className="mt-3 text-text-secondary">{business.body}</p>
            </article>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll variant="fade-up" delay={360} className="mt-8">
          <article className="group relative overflow-hidden rounded-sm border border-border-light bg-bg-card p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-card-hover md:flex md:gap-10 md:p-10">
            <div className="shrink-0">
              <LitigationIcon />
            </div>
            <div>
              <h3 className="text-text-primary">{litigation.title}</h3>
              <p className="mt-3 text-text-secondary">{litigation.body}</p>
            </div>
            <div className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rounded-full border border-accent/10" />
          </article>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
