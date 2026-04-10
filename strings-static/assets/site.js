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
      '<span><a href="tel:+421902203238">+421 902 203 238</a> · <a href="kontakt.html">Kontakt</a></span>' +
      '</div>';
    nav.insertBefore(strip, nav.firstChild);
  }

  function addNavIcons() {
    document.querySelectorAll('.nav-link').forEach(function (el) {
      if (el.querySelector('.nav-ic')) return;
      var slug = el.getAttribute('data-nav') || '';
      var icon = '◇';
      if (slug === 'index') icon = '◉';
      if (slug === 'o-nas') icon = '◌';
      if (slug === 'technologie') icon = '⌁';
      if (slug === 'business') icon = '◈';
      if (slug === 'gdpr') icon = '▣';
      if (slug === 'aktuality') icon = '◍';
      if (slug === 'kontakt') icon = '◎';
      var span = document.createElement('span');
      span.className = 'nav-ic';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = icon + ' ';
      el.insertBefore(span, el.firstChild);
    });
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

  function setupHeroVoiceVariants() {
    if (page !== 'index') return;
    var eyebrow = document.getElementById('hero-eyebrow');
    var title = document.getElementById('hero-title');
    var subline = document.getElementById('hero-subline');
    if (!eyebrow || !title || !subline) return;

    var variants = [
      {
        eyebrow: 'Advokátska kancelária · Bratislava',
        title: 'Právo s váhou a prehľadom',
        subline: 'Spájame klasickú právnu starostlivosť s pochopením technológií a podnikania. Diskrétnosť, presnosť a zrozumiteľné riešenia.'
      },
      {
        eyebrow: 'Technológie a regulácia',
        title: 'Právna istota v digitálnom prostredí',
        subline: 'Softvér, dáta, kyberbezpečnosť a duševné vlastníctvo — od zmlúv až po sporovú obranu, s jazykom, ktorému rozumie váš tím.'
      },
      {
        eyebrow: 'Obchod a transakcie',
        title: 'Zmluvy, spoločnosti, investície',
        subline: 'Pripravíme a vyjednáme dokumentáciu, ktorá chráni vaše záujmy: M&amp;A, VC, obchodné spoločnosti a každodenná firemná agenda.'
      }
    ];

    function applyVariant(idx) {
      var v = variants[idx] || variants[0];
      eyebrow.textContent = v.eyebrow;
      title.textContent = v.title;
      subline.textContent = v.subline;
      document.querySelectorAll('.hero-voice-btn').forEach(function (btn) {
        btn.classList.toggle('is-active', Number(btn.getAttribute('data-voice')) === idx);
      });
    }

    document.querySelectorAll('.hero-voice-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyVariant(Number(btn.getAttribute('data-voice')) || 0);
      });
    });
  }

  function enhanceHeroHome() {
    if (page !== 'index') return;
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (!hero || !content) return;

    if (!hero.querySelector('.hero-kpi')) {
      var kpi = document.createElement('div');
      kpi.className = 'hero-kpi';
      if (hero.classList.contains('hero--prestige')) {
        kpi.innerHTML =
          '<span class="hero-kpi-chip">Diskrétnosť <strong>štandard</strong></span>' +
          '<span class="hero-kpi-chip">Termíny <strong>jasné</strong></span>' +
          '<span class="hero-kpi-chip">Komunikácia <strong>priama</strong></span>';
      } else {
        kpi.innerHTML =
          '<span class="hero-kpi-chip">Incident desk <strong>online</strong></span>' +
          '<span class="hero-kpi-chip">GDPR readiness <strong>98%</strong></span>' +
          '<span class="hero-kpi-chip">Contract response <strong>&lt;24h</strong></span>';
      }
      content.appendChild(kpi);
    }

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
      navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function () {});
    });
  }

  addMarketStrip();
  setupMobileNav();
  setActiveNav();
  setupNavScrollState();
  addNavIcons();
  activateScrollAnimations();
  setupHeroVoiceVariants();
  enhanceHeroHome();
  setupGlobalCinematic();
  setupTransitions();
  subtleCardTilt();
  registerServiceWorker();
})();
