import gsap from 'https://esm.sh/gsap@3.12.5';
import { ScrollTrigger } from 'https://esm.sh/gsap@3.12.5/ScrollTrigger';
import Lenis from 'https://esm.sh/lenis@1.1.18';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

function initLenis() {
  if (reduced) return null;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;

  if (reduced) {
    el.remove();
    return;
  }

  const word = el.querySelector('.preloader__word');
  const bar = el.querySelector('.preloader__bar-fill');
  const glow = el.querySelector('.preloader__glow');

  const tl = gsap.timeline({
    defaults: { ease: 'power4.inOut' },
    onComplete: () => {
      el.remove();
      document.getElementById('main')?.removeAttribute('aria-hidden');
      ScrollTrigger.refresh();
    },
  });

  tl.fromTo(
    glow,
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
    0
  )
    .fromTo(word, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, 0.2)
    .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0.15)
    .to(word, { y: -24, opacity: 0, duration: 0.55, ease: 'power4.in' }, 1.65)
    .to(bar.parentElement, { opacity: 0, duration: 0.35 }, 1.75)
    .to(
      el,
      {
        clipPath: 'inset(0 0 0 0)',
        duration: 0.01,
      },
      0
    )
    .to(
      el,
      {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1,
        ease: 'power4.inOut',
      },
      2.05
    )
    .to(
      el,
      {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      },
      2.85
    );
}

function splitHeroTitle() {
  const title = document.querySelector('.hero__title');
  if (!title) return;
  const raw = title.textContent.trim();
  const words = raw.split(/\s+/);
  title.innerHTML = words
    .map((w, i) => {
      const gap = i ? ' ml-[0.28em]' : '';
      return `<span class="inline-block overflow-hidden align-bottom${gap}"><span class="hero__word inline-block will-change-transform">${w}</span></span>`;
    })
    .join('');
}

function initHeroReveal() {
  splitHeroTitle();
  const words = document.querySelectorAll('.hero__word');
  const eyebrow = document.querySelector('.hero__eyebrow');
  const sub = document.querySelector('.hero__sub');
  const cta = document.querySelector('.hero__cta');

  if (reduced) {
    gsap.set([words, eyebrow, sub, cta], { clearProps: 'all' });
    return;
  }

  const tl = gsap.timeline({
    delay: 3.38,
    defaults: { ease: 'power4.out' },
  });

  tl.fromTo(eyebrow, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0)
    .fromTo(
      words,
      { yPercent: 110, rotateX: -12 },
      {
        yPercent: 0,
        rotateX: 0,
        duration: 1.25,
        stagger: 0.07,
        ease: 'power4.out',
      },
      0.12
    )
    .fromTo(sub, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.55)
    .fromTo(cta, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, 0.75);
}

function initHeroParallax() {
  const bg = document.querySelector('.hero__bg-image');
  if (!bg || reduced) return;
  gsap.to(bg, {
    yPercent: 18,
    scale: 1.05,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

function initAboutPin() {
  const section = document.querySelector('.about');
  const pinEl = document.querySelector('.about__pin');
  if (!section || !pinEl || reduced) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=220%',
    pin: pinEl,
    pinSpacing: true,
    anticipatePin: 1,
  });

  gsap.utils.toArray('.about__para').forEach((p) => {
    gsap.fromTo(
      p,
      { opacity: 0.12, y: 56, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: p,
          start: 'top 82%',
          end: 'top 48%',
          scrub: 1.2,
        },
      }
    );
  });

  gsap.fromTo(
    '.about__headline',
    { opacity: 0.25, y: 40 },
    {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about__headline',
        start: 'top 78%',
        end: 'top 45%',
        scrub: 1,
      },
    }
  );
}

function initWorkScroll() {
  if (reduced) return;
  document.querySelectorAll('.work-item').forEach((item) => {
    const img = item.querySelector('.work-item__img');
    const card = item.querySelector('.work-item__magnetic');

    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.12, filter: 'brightness(0.6)' },
        {
          scale: 1,
          filter: 'brightness(1)',
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      );
    }

    if (card) {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    const textBlock = item.querySelector('p');
    if (textBlock) {
      gsap.fromTo(
        textBlock,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.12,
          scrollTrigger: {
            trigger: item,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  });
}

function initMagneticWork() {
  if (reduced || !finePointer) return;

  document.querySelectorAll('.work-item__magnetic').forEach((link) => {
    const inner = link.querySelector('.work-item__inner');
    if (!inner) return;

    link.addEventListener('mousemove', (e) => {
      const r = link.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(inner, {
        x: x * 0.12,
        y: y * 0.12,
        duration: 0.65,
        ease: 'power3.out',
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'power4.out',
      });
    });
  });
}

function initFooterReveal() {
  if (reduced) return;
  const head = document.querySelector('.footer__head');
  const row = document.querySelector('.footer__row');
  if (!head) return;

  gsap.fromTo(
    head,
    { y: 120, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: head,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  if (row) {
    gsap.fromTo(
      row,
      { y: 48, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }
}

function initCustomCursor() {
  const dot = document.getElementById('cursor');
  if (!dot || reduced || !finePointer) return;

  document.body.classList.add('is-cursor-custom');
  const inner = dot.querySelector('.cursor-dot__inner');
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;

  const loop = () => {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };

  window.addEventListener(
    'mousemove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  document.querySelectorAll('.interactive, a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (inner) gsap.to(inner, { scale: 2.35, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      if (inner) gsap.to(inner, { scale: 1, duration: 0.65, ease: 'power4.out' });
    });
  });

  requestAnimationFrame(loop);
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  if (reduced) {
    gsap.set(header, { clearProps: 'all' });
    return;
  }

  gsap.fromTo(
    header,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 3.38 }
  );

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom top',
    toggleClass: { className: 'is-scrolled', targets: header },
  });
}

function initMobileMenu() {
  const btn = document.querySelector('[data-menu-toggle]');
  const drawer = document.getElementById('drawer');
  if (!btn || !drawer) return;

  const setOpen = (open) => {
    drawer.classList.toggle('opacity-100', open);
    drawer.classList.toggle('pointer-events-none', !open);
    drawer.classList.toggle('pointer-events-auto', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('overflow-hidden', open);
  };

  btn.addEventListener('click', () => {
    const isOpen = drawer.getAttribute('aria-hidden') === 'false';
    setOpen(!isOpen);
  });

  drawer.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.getAttribute('aria-hidden') === 'false') setOpen(false);
  });
}

function boot() {
  if (!reduced) {
    document.getElementById('main')?.setAttribute('aria-hidden', 'true');
  }
  initLenis();
  initPreloader();
  initHeroReveal();
  initHeroParallax();
  initAboutPin();
  initWorkScroll();
  initMagneticWork();
  initFooterReveal();
  initCustomCursor();
  initHeaderScroll();
  initMobileMenu();

  if (!reduced) {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 400);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
