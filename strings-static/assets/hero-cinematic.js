(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  if (document.body.getAttribute('data-page') !== 'index') return;
  var hero = document.querySelector('.hero--prestige');
  if (!hero || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var eyebrow = document.getElementById('hero-eyebrow');
  var title = document.getElementById('hero-title');
  var subline = document.getElementById('hero-subline');
  var techArc = document.getElementById('hero-tech-arc');
  var cta = hero.querySelector('.hero-copy .cta');

  function wrapTitleWords(el) {
    if (!el || el.querySelector('.hero-title-word')) return;
    var text = el.textContent.trim();
    var parts = text.split(/(\s+)/);
    el.textContent = '';
    parts.forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        el.appendChild(document.createTextNode(part));
        return;
      }
      var span = document.createElement('span');
      span.className = 'hero-title-word';
      span.textContent = part;
      el.appendChild(span);
    });
  }

  wrapTitleWords(title);

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (eyebrow) {
    gsap.set(eyebrow, { opacity: 0, y: 18 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.75 }, 0);
  }
  var words = title ? title.querySelectorAll('.hero-title-word') : [];
  if (words.length) {
    gsap.set(words, { opacity: 0, y: 40, transformOrigin: '50% 100%' });
    tl.to(
      words,
      { opacity: 1, y: 0, duration: 0.88, stagger: 0.065 },
      0.14
    );
  } else if (title) {
    gsap.set(title, { opacity: 0, y: 24 });
    tl.to(title, { opacity: 1, y: 0, duration: 0.9 }, 0.14);
  }
  if (subline) {
    gsap.set(subline, { opacity: 0, y: 22 });
    tl.to(subline, { opacity: 1, y: 0, duration: 0.72 }, 0.42);
  }
  if (techArc) {
    gsap.set(techArc, { opacity: 0, y: 14 });
    tl.to(techArc, { opacity: 1, y: 0, duration: 0.58 }, 0.52);
  }
  if (cta) {
    gsap.set(cta, { opacity: 0, y: 16 });
    tl.to(cta, { opacity: 1, y: 0, duration: 0.55 }, 0.68);
  }

  var bg = hero.querySelector('.hero-bg');
  var motif = hero.querySelector('.hero-motif');
  var vignette = hero.querySelector('.hero-vignette');
  var grain = hero.querySelector('.hero-grain');

  if (bg) {
    gsap.to(bg, {
      yPercent: 14,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 }
    });
  }
  if (motif) {
    gsap.to(motif, {
      y: 56,
      rotate: 4,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 }
    });
  }
  if (vignette) {
    gsap.to(vignette, {
      opacity: 0.72,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 }
    });
  }
  if (grain) {
    gsap.to(grain, {
      opacity: 0.06,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 }
    });
  }
})();
