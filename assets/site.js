(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var page = document.body && document.body.getAttribute('data-page');
  var scrollLockY = 0;

  function lockScroll() {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollLockY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollLockY);
  }

  function isMobileNavLayout() {
    return window.matchMedia('(max-width: 980px)').matches;
  }

  function mobileNavFocusables() {
    if (!nav || !toggle) return [];
    var panel = nav.querySelector('.links');
    var list = [toggle];
    if (panel) panel.querySelectorAll('a[href]').forEach(function (a) { list.push(a); });
    return list;
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
    if (open && isMobileNavLayout()) {
      window.setTimeout(function () {
        var panel = nav.querySelector('.links a[href]');
        if (panel) panel.focus();
      }, 0);
    } else if (!open) toggle.focus();
  }

  function setupMobileNav() {
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        setNavOpen(!nav.classList.contains('open'));
      });
    }
    if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
    window.addEventListener(
      'resize',
      function () {
        if (nav && nav.classList.contains('open') && !isMobileNavLayout()) setNavOpen(false);
      },
      { passive: true }
    );
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
      if (e.key !== 'Tab' || !nav || !nav.classList.contains('open') || !isMobileNavLayout()) return;
      var items = mobileNavFocusables();
      if (items.length < 2) return;
      var i = items.indexOf(document.activeElement);
      if (i === -1) {
        e.preventDefault();
        items[e.shiftKey ? items.length - 1 : 0].focus();
        return;
      }
      if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      } else if (e.shiftKey && i === 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    });
  }

  function setActiveNav() {
    if (!page) return;
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

  function setupNavScrollState() {
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 44);
    });
  }

  function addMarketStrip() {
    if (!nav || nav.querySelector('.market-strip')) return;
    var strip = document.createElement('div');
    strip.className = 'market-strip';
    strip.innerHTML =
      '<div class="wrap market-strip-inner">' +
      '<span>Bratislava · <strong>obchodné</strong> a <strong>technologické</strong> právo</span>' +
      '</div>';
    nav.insertBefore(strip, nav.firstChild);
  }

  var NAV_ICONS = {
    index:
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M9 22V12h6v10"/></svg>',
    'o-nas':
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="1.75"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    technologie:
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.75"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01"/></svg>',
    business:
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="1.75"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    gdpr:
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    aktuality:
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9h9v11"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M9 10h.01M15 10h.01"/></svg>',
    kontakt:
      '<svg class="nav-ic-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="m22 6-10 7L2 6"/></svg>'
  };

  function addNavIcons() {
    document.querySelectorAll('.nav-link').forEach(function (el) {
      if (el.querySelector('.nav-ic')) return;
      var slug = el.getAttribute('data-nav') || '';
      var svg = NAV_ICONS[slug] || NAV_ICONS.index;
      var span = document.createElement('span');
      span.className = 'nav-ic';
      span.setAttribute('aria-hidden', 'true');
      span.innerHTML = svg;
      el.insertBefore(span, el.firstChild);
    });
  }

  function addFootMotif() {
    if (document.getElementById('site-foot-motif')) return;
    var wrap = document.createElement('div');
    wrap.id = 'site-foot-motif';
    wrap.className = 'site-foot-motif';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML =
      '<svg class="site-foot-motif__svg" viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path class="site-foot-motif__beam" d="M60 8v56M28 24h64M28 48h64" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>' +
      '<path class="site-foot-motif__scale" d="M60 32c-8 0-14 6-14 14v6c0 5 4 9 9 10v8h10v-8c5-1 9-5 9-10v-6c0-8-6-14-14-14z" stroke="currentColor" stroke-width="1.35" opacity="0.65"/>' +
      '<circle cx="60" cy="40" r="3" stroke="currentColor" stroke-width="1" opacity="0.55"/>' +
      '</svg>';
    document.body.appendChild(wrap);
  }

  function activateScrollAnimations() {
    var targets = document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip,section.section');
    targets.forEach(function (el) {
      if (el.tagName.toLowerCase() === 'section') el.classList.add('section-reveal');
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('visible', 'is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { observer.observe(el); });
  }

  function enhanceHeroHome() {
    if (page !== 'index') return;
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (!hero || !content) return;

    if (hero.classList.contains('hero--singularity') || hero.classList.contains('hero--prestige')) return;
    if (reduceMotion || hero.querySelector('.hero-command-canvas')) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'hero-command-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hero.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = 1;
    var w = 0;
    var h = 0;
    var nodes = [];
    var nodeCount = 44;
    var start = performance.now();

    function resetNode(n, fromBottom) {
      n.x = Math.random() * w;
      n.y = fromBottom ? h + Math.random() * 120 : Math.random() * h;
      n.r = 0.8 + Math.random() * 1.8;
      n.vy = 0.14 + Math.random() * 0.3;
      n.drift = -0.12 + Math.random() * 0.24;
      n.phase = Math.random() * Math.PI * 2;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = [];
      for (var i = 0; i < nodeCount; i += 1) {
        var n = {};
        resetNode(n, false);
        nodes.push(n);
      }
    }

    function draw(now) {
      var t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'multiply';
      var grad = ctx.createLinearGradient(0, 0, w, h * 0.6);
      grad.addColorStop(0, 'rgba(45,212,191,0.16)');
      grad.addColorStop(1, 'rgba(99,102,241,0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      for (var i = 0; i < nodes.length; i += 1) {
        var a = nodes[i];
        a.y -= a.vy;
        a.x += Math.sin(t + a.phase) * 0.2 + a.drift * 0.12;
        if (a.y < -12) resetNode(a, true);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(45,212,191,0.24)';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j += 1) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 120) continue;
          var alpha = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(99,102,241,' + alpha.toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  function setupGlobalCinematic() {
    if (reduceMotion || document.querySelector('.cinematic-canvas')) return;
    if (page === 'index') return;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'cinematic-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = 1;
    var w = 0;
    var h = 0;
    var sparks = [];
    var count = Math.min(56, Math.max(24, Math.floor(window.innerWidth / 28)));

    function resetSpark(s, initial) {
      s.x = Math.random() * w;
      s.y = initial ? Math.random() * h : h + Math.random() * 140;
      s.r = 0.8 + Math.random() * 1.8;
      s.vy = 0.08 + Math.random() * 0.25;
      s.wave = Math.random() * Math.PI * 2;
      s.h = Math.random() > 0.5 ? 38 : 43;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sparks = [];
      for (var i = 0; i < count; i += 1) {
        var s = {};
        resetSpark(s, true);
        sparks.push(s);
      }
    }

    function draw(t) {
      var sec = t * 0.001;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'screen';
      for (var i = 0; i < sparks.length; i += 1) {
        var s = sparks[i];
        s.y -= s.vy;
        s.x += Math.sin(sec + s.wave) * 0.18;
        if (s.y < -12) resetSpark(s, false);
        ctx.beginPath();
        ctx.fillStyle = 'hsla(' + s.h + ', 42%, 48%, 0.1)';
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  function setupTransitions() {
    if (reduceMotion) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.defaultPrevented || a.target === '_blank') return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var href = a.getAttribute('href');
        if (!href || href.indexOf('#') === 0) return;
        if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
        var url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        document.body.style.transition = 'opacity .42s cubic-bezier(.22,1,.36,1)';
        document.body.style.opacity = '0.78';
        window.setTimeout(function () { window.location.href = url.href; }, 280);
        e.preventDefault();
      });
    });
  }

  function subtleCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (reduceMotion) return;
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -2.2;
        var ry = (px - 0.5) * 2.2;
        card.style.transform = 'perspective(760px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-8px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    var loc = window.location;
    if (loc.protocol !== 'https:' && loc.hostname !== 'localhost' && loc.hostname !== '127.0.0.1') return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js?v=20260410-navalign', { scope: './' }).catch(function () {});
    });
  }

  addMarketStrip();
  setupMobileNav();
  setActiveNav();
  setupNavScrollState();
  addNavIcons();
  addFootMotif();
  activateScrollAnimations();
  enhanceHeroHome();
  setupGlobalCinematic();
  setupTransitions();
  subtleCardTilt();
  registerServiceWorker();
})();
