(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var links = document.getElementById('nav-links');
  var scrollLockY = 0;

  function lockScroll() {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollLockY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockY);
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    var currentlyOpen = nav.classList.contains('open');
    if (currentlyOpen === open) return;

    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);

    if (open) {
      lockScroll();
      if (links) {
        links.setAttribute('aria-modal', 'true');
        requestAnimationFrame(function () {
          var first = links.querySelector('a');
          if (first) first.focus({ preventScroll: true });
        });
      }
    } else {
      unlockScroll();
      if (links) links.removeAttribute('aria-modal');
      toggle.focus({ preventScroll: true });
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setNavOpen(false);
      });
    }
    if (links) {
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          setNavOpen(false);
        });
      });
      links.addEventListener('keydown', function (e) {
        if (!nav.classList.contains('open') || e.key !== 'Tab') return;
        var focusables = links.querySelectorAll('a[href]');
        if (focusables.length < 2) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus({ preventScroll: true });
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setNavOpen(false);
    });
  }

  var page = document.body && document.body.getAttribute('data-page');
  var themeByPage = {
    technologie: { h1: 191, h2: 218 },
    gdpr: { h1: 162, h2: 191 },
    business: { h1: 34, h2: 275 },
    'o-nas': { h1: 326, h2: 222 },
    kontakt: { h1: 190, h2: 264 },
    aktuality: { h1: 25, h2: 44 },
    index: { h1: 190, h2: 265 }
  };
  var theme = themeByPage[page] || themeByPage.index;
  if (page) {
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

  function addHeroMotif() {
    if (!page || page === 'index') return;
    var hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.page-motif')) return;
    var motif = document.createElement('div');
    motif.className = 'page-motif';
    motif.setAttribute('aria-hidden', 'true');
    var core = document.createElement('span');
    core.className = 'motif-core';
    motif.appendChild(core);
    hero.appendChild(motif);
  }
  addHeroMotif();

  function setupPageTransitions() {
    if (reduceMotion) return;
    if (document.querySelector('.page-transition-overlay')) return;
    var overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        if (e.defaultPrevented) return;
        if (anchor.target === '_blank') return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var href = anchor.getAttribute('href');
        if (!href || href.indexOf('#') === 0) return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
        var url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        window.setTimeout(function () {
          window.location.href = url.href;
        }, 320);
      });
    });
  }
  setupPageTransitions();

  window.addEventListener('pageshow', function () {
    document.body.classList.remove('is-leaving');
  });

  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  if (!reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip')
      .forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip')
      .forEach(function (el) { el.classList.add('visible'); });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('section.section'));
  sections.forEach(function (section) {
    section.classList.add('section-reveal');
  });
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = sections.indexOf(entry.target);
        var delay = Math.max(0, index) * 70;
        window.setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, delay);
        sectionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  } else {
    sections.forEach(function (section) {
      section.classList.add('is-visible');
    });
  }

  // Subtle grayscale spiral for non-index dark hero sections.
  if (!reduceMotion && page && page !== 'index') {
    var hero = document.querySelector('.hero');
    if (hero && hero.querySelector('.hero-bg') && !hero.querySelector('.hero-soft-spiral-canvas')) {
      var canvas = document.createElement('canvas');
      canvas.className = 'hero-soft-spiral-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      hero.insertBefore(canvas, hero.querySelector('.hero-content'));

      var ctx = canvas.getContext('2d');
      if (ctx) {
        var dpr = 1;
        var w = 0;
        var h = 0;
        var cx = 0;
        var cy = 0;
        var start = performance.now();

        function resize() {
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          w = hero.clientWidth;
          h = hero.clientHeight;
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          cx = w * 0.5;
          cy = h * 0.5;
        }

        function draw(now) {
          var t = (now - start) / 1000;
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'screen';

          // Soft blurred rings.
          for (var i = 0; i < 36; i += 1) {
            var p = i / 36;
            var r = 40 + p * Math.max(w, h) * 0.56;
            var wobble = Math.sin(t * (0.6 + p) + i * 0.72) * (2 + p * 5);
            var rx = r + wobble;
            var ry = (r * (0.72 - p * 0.2)) + wobble * 0.45;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((t * 0.03) + i * 0.07);
            ctx.beginPath();
            ctx.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), i * 0.045, 0, Math.PI * 2);
            ctx.lineWidth = 0.7 + p * 1.15;
            ctx.strokeStyle = 'rgba(233,238,245,' + (0.02 + (1 - p) * 0.085) + ')';
            ctx.stroke();
            ctx.restore();
          }

          requestAnimationFrame(draw);
        }

        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(draw);
      }
    }
  }

  if (!reduceMotion) {
    var overlayCanvas = document.createElement('canvas');
    overlayCanvas.className = 'anime-overlay-canvas';
    overlayCanvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlayCanvas);

    var overlayCtx = overlayCanvas.getContext('2d');
    if (overlayCtx) {
      var overlayDpr = 1;
      var overlayW = 0;
      var overlayH = 0;
      var particles = [];
      var particleCount = Math.min(92, Math.max(42, Math.floor(window.innerWidth / 17)));

      function resetParticle(p, initial) {
        p.x = Math.random() * overlayW;
        p.y = initial ? Math.random() * overlayH : (overlayH + 10 + Math.random() * 140);
        p.radius = 0.8 + Math.random() * 2.6;
        p.speedY = 0.12 + Math.random() * 0.44;
        p.drift = -0.2 + Math.random() * 0.4;
        p.phase = Math.random() * Math.PI * 2;
        p.alpha = 0.13 + Math.random() * 0.3;
        p.hue = Math.random() > 0.5 ? theme.h1 : theme.h2;
      }

      function setupOverlay() {
        overlayDpr = Math.min(window.devicePixelRatio || 1, 2);
        overlayW = window.innerWidth;
        overlayH = window.innerHeight;
        overlayCanvas.width = Math.floor(overlayW * overlayDpr);
        overlayCanvas.height = Math.floor(overlayH * overlayDpr);
        overlayCanvas.style.width = overlayW + 'px';
        overlayCanvas.style.height = overlayH + 'px';
        overlayCtx.setTransform(overlayDpr, 0, 0, overlayDpr, 0, 0);
        particles = [];
        for (var i = 0; i < particleCount; i += 1) {
          var p = {};
          resetParticle(p, true);
          particles.push(p);
        }
      }

      function drawOverlay(now) {
        var t = now * 0.001;
        overlayCtx.clearRect(0, 0, overlayW, overlayH);
        overlayCtx.globalCompositeOperation = 'screen';
        for (var s = 0; s < 3; s += 1) {
          var sy = ((t * (16 + s * 6)) % (overlayH + 220)) - 140;
          var sx = (s + 1) * (overlayW * 0.24);
          var grd = overlayCtx.createLinearGradient(sx - 240, sy - 120, sx + 240, sy + 120);
          grd.addColorStop(0, 'hsla(' + theme.h1 + ', 95%, 70%, 0)');
          grd.addColorStop(0.48, 'hsla(' + theme.h2 + ', 95%, 75%, 0.08)');
          grd.addColorStop(1, 'hsla(' + theme.h1 + ', 95%, 70%, 0)');
          overlayCtx.fillStyle = grd;
          overlayCtx.fillRect(sx - 240, sy - 120, 480, 240);
        }
        for (var i = 0; i < particles.length; i += 1) {
          var p = particles[i];
          p.y -= p.speedY;
          p.x += Math.sin(t + p.phase) * 0.3 + p.drift * 0.15;
          if (p.y < -20 || p.x < -40 || p.x > overlayW + 40) resetParticle(p, false);
          var glow = 10 + p.radius * 7;
          overlayCtx.beginPath();
          overlayCtx.fillStyle = 'hsla(' + p.hue + ', 95%, 74%, ' + p.alpha + ')';
          overlayCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          overlayCtx.shadowBlur = glow;
          overlayCtx.shadowColor = p.hue === 190 ? 'rgba(89,240,255,0.95)' : 'rgba(167,132,255,0.95)';
          overlayCtx.fill();
        }
        overlayCtx.shadowBlur = 0;
        requestAnimationFrame(drawOverlay);
      }

      setupOverlay();
      window.addEventListener('resize', setupOverlay);
      requestAnimationFrame(drawOverlay);
    }
  }

  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      if (reduceMotion) return;
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (py - 0.5) * -7;
      var ry = (px - 0.5) * 9;
      card.style.transform = 'perspective(720px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-8px)';
    });
    card.addEventListener('pointerleave', function () {
      card.style.transform = '';
    });
  });
})();
