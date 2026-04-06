"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

export type AnimateVariant =
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "clip";

const variantClass: Record<AnimateVariant, string> = {
  "fade-up": "animate-on-scroll",
  "slide-left": "animate-slide-left",
  "slide-right": "animate-slide-right",
  scale: "animate-scale",
  clip: "animate-clip",
};

type Props = {
  children: ReactNode;
  variant?: AnimateVariant;
  delay?: number;
  className?: string;
};

export function AnimateOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties | undefined =
    delay > 0
      ? { transitionDelay: visible ? `${delay}ms` : "0ms" }
      : undefined;

  return (
    <div
      ref={ref}
      className={`${variantClass[variant]} ${visible ? "visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
