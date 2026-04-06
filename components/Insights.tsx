import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import Link from "next/link";

const posts = [
  {
    date: "2024",
    title: "Príprava nového autorského zákona",
    excerpt:
      "Nový autorský zákon prináša zásadné zmeny pre digitálny obsah, AI-generované diela a online platformy. Analyzujeme kľúčové dopady pre technologické firmy.",
  },
  {
    date: "2024",
    title: "Registrujete domény? Pozor na právne riziká",
    excerpt:
      "Registrácia doménových mien môže viesť k sporom o ochranné známky. Prinášame prehľad rizík a odporúčania pre firmy.",
  },
  {
    date: "2024",
    title: "AI Act — nová regulácia umelej inteligencie v EÚ",
    excerpt:
      "Európsky AI Act vstupuje do platnosti. Čo to znamená pre vývojárov, deployers a používateľov AI systémov na Slovensku?",
  },
];

export function Insights() {
  return (
    <section
      id="aktuality"
      className="relative bg-bg-section-alt py-[60px] sm:py-[80px] lg:py-[120px]"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up" className="mb-12">
          <h2 className="text-text-primary">Aktuality</h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Vybrané témy z digitálneho práva a regulácie technológií.
          </p>
        </AnimateOnScroll>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <AnimateOnScroll
              key={post.title}
              variant="fade-up"
              delay={i * 120}
            >
              <article className="group flex h-full flex-col rounded-sm border border-border-light bg-bg-card p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card-hover">
                <time
                  dateTime={post.date}
                  className="text-xs font-semibold uppercase tracking-widest text-accent"
                >
                  {post.date}
                </time>
                <h3 className="mt-4 font-heading text-xl font-bold text-text-primary">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-text-secondary">{post.excerpt}</p>
                <Link
                  href="#kontakt"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-text-primary"
                >
                  Čítať viac
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
