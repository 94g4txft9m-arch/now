"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";

const PHOTO =
  "https://www.akmotuzova.sk/wp-content/uploads/2019/01/foto-zuzana-motuzova.jpg";

export function Team() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="tim"
      className="relative overflow-hidden bg-bg-primary py-[60px] sm:py-[80px] lg:py-[120px]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(135deg, transparent 40%, rgba(99,102,241,0.15) 100%)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fade-up" className="mb-12">
          <h2 className="text-text-primary">Tím</h2>
        </AnimateOnScroll>

        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <AnimateOnScroll variant="scale" className="order-2 lg:order-1">
            <ParallaxLayer strength={0.14} className="relative mx-auto max-w-md lg:mx-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border-light bg-bg-section-alt shadow-card">
                {!imgError ? (
                  <Image
                    src={PHOTO}
                    alt="JUDr. Zuzana Motúzová"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    unoptimized
                    onError={() => setImgError(true)}
                    priority
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-graphite p-8 text-center">
                    <span className="font-heading text-sm font-bold uppercase tracking-widest text-accent">
                      NAHRADIŤ REÁLNOU FOTOGRAFIOU
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-3 border border-white/10" />
              </div>
            </ParallaxLayer>
          </AnimateOnScroll>

          <AnimateOnScroll
            variant="slide-right"
            className="order-1 space-y-6 lg:order-2"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Managing partner
              </p>
              <h3 className="mt-2 text-text-primary">
                JUDr. Zuzana Motúzová
              </h3>
              <p className="mt-1 font-medium text-text-secondary">
                Zakladateľka a managing partner
              </p>
            </div>
            <p className="text-text-secondary">
              Zuzana sa špecializuje na IT právo, ochranu osobných údajov a
              právo duševného vlastníctva. Má rozsiahle skúsenosti s právnym
              poradenstvom pre technologické spoločnosti, startupy a
              medzinárodné korporácie. Pred založením kancelárie pôsobila v
              renomovaných advokátskych kanceláriách so zameraním na TMT
              (Technology, Media & Telecommunications) sektor. Je členkou
              Slovenskej advokátskej komory a pravidelne prednáša na
              konferenciách o digitálnom práve.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
