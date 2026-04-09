(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var page = document.body && document.body.getAttribute('data-page');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  function setupMobileNav() {
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        setNavOpen(!nav.classList.contains('open'));
      });
    }
    if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
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
      '<span>Private legal desk <strong>SK/CZ</strong> • IT &amp; Regulatory counsel</span>' +
      '<span><a href="tel:+421902203238">+421 902 203 238</a> • <a href="kontakt.html">Kontakt</a></span>' +
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
        eyebrow: 'Advokátska kancelária pre digitálnu dobu',
        title: 'Advokáti v dobe kvantovej fyziky',
        subline: 'Sme advokáti digitálnej doby. Prinášame exaktné právne riešenia v technológiách, podnikaní, ochrane údajov a sporovej agende.'
      },
      {
        eyebrow: 'Strategické právo pre technologický kapitál',
        title: 'Právo, ktoré drží tempo s trhom',
        subline: 'Podporujeme investorov, founderov a scale-up tímy: od transakcií a zmlúv až po GDPR, kyberbezpečnosť a sporovú obranu.'
      },
      {
        eyebrow: 'Hybrid SK/CZ legal command',
        title: 'Istota v regulácii. Rýchlosť v rozhodovaní.',
        subline: 'Spájame presnosť právnej analýzy s business pohľadom, aby firmy mohli bezpečne rásť v prostredí technológií a regulácie.'
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
      kpi.innerHTML =
        '<span class="hero-kpi-chip">Incident desk <strong>online</strong></span>' +
        '<span class="hero-kpi-chip">GDPR readiness <strong>98%</strong></span>' +
        '<span class="hero-kpi-chip">Contract response <strong>&lt;24h</strong></span>';
      content.appendChild(kpi);
    }

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
      s.h = Math.random() > 0.5 ? 170 : 242;
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
        ctx.fillStyle = 'hsla(' + s.h + ', 72%, 52%, 0.14)';
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
        document.body.style.transition = 'opacity .2s ease';
        document.body.style.opacity = '0.85';
        window.setTimeout(function () { window.location.href = url.href; }, 140);
        e.preventDefault();
      });
    });
  }

  function subtleCardTilt() {
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
})();
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var page = document.body && document.body.getAttribute('data-page');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  function setupMobileNav() {
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        setNavOpen(!nav.classList.contains('open'));
      });
    }
    if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
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
      '<span>Private legal desk <strong>SK/CZ</strong> • IT &amp; Regulatory counsel</span>' +
      '<span><a href="tel:+421902203238">+421 902 203 238</a> • <a href="kontakt.html">Kontakt</a></span>' +
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
        eyebrow: 'Advokátska kancelária pre digitálnu dobu',
        title: 'Advokáti v dobe kvantovej fyziky',
        subline: 'Sme advokáti digitálnej doby. Prinášame exaktné právne riešenia v technológiách, podnikaní, ochrane údajov a sporovej agende.'
      },
      {
        eyebrow: 'Strategické právo pre technologický kapitál',
        title: 'Právo, ktoré drží tempo s trhom',
        subline: 'Podporujeme investorov, founderov a scale-up tímy: od transakcií a zmlúv až po GDPR, kyberbezpečnosť a sporovú obranu.'
      },
      {
        eyebrow: 'Hybrid SK/CZ legal command',
        title: 'Istota v regulácii. Rýchlosť v rozhodovaní.',
        subline: 'Spájame presnosť právnej analýzy s business pohľadom, aby firmy mohli bezpečne rásť v prostredí technológií a regulácie.'
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
      kpi.innerHTML =
        '<span class="hero-kpi-chip">Incident desk <strong>online</strong></span>' +
        '<span class="hero-kpi-chip">GDPR readiness <strong>98%</strong></span>' +
        '<span class="hero-kpi-chip">Contract response <strong>&lt;24h</strong></span>';
      content.appendChild(kpi);
    }

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
      grad.addColorStop(0, 'rgba(16,47,105,0.22)');
      grad.addColorStop(1, 'rgba(143,108,61,0.1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      for (var i = 0; i < nodes.length; i += 1) {
        var a = nodes[i];
        a.y -= a.vy;
        a.x += Math.sin(t + a.phase) * 0.2 + a.drift * 0.12;
        if (a.y < -12) resetNode(a, true);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(16,47,105,0.32)';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j += 1) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 120) continue;
          var alpha = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(31,88,189,' + alpha.toFixed(3) + ')';
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
      s.h = Math.random() > 0.5 ? 216 : 36;
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
        ctx.fillStyle = 'hsla(' + s.h + ', 78%, 54%, 0.2)';
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
        document.body.style.transition = 'opacity .22s ease';
        document.body.style.opacity = '0.82';
        window.setTimeout(function () { window.location.href = url.href; }, 160);
        e.preventDefault();
      });
    });
  }

  function subtleCardTilt() {
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
})();
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var page = document.body && document.body.getAttribute('data-page');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  function setupMobileNav() {
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        setNavOpen(!nav.classList.contains('open'));
      });
    }
    if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
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
      '<span>Private legal desk <strong>SK/CZ</strong> • IT &amp; Regulatory counsel</span>' +
      '<span><a href="tel:+421902203238">+421 902 203 238</a> • <a href="kontakt.html">Kontakt</a></span>' +
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
        eyebrow: 'Advokátska kancelária pre digitálnu dobu',
        title: 'Advokáti v dobe kvantovej fyziky',
        subline: 'Sme advokáti digitálnej doby. Prinášame exaktné právne riešenia v technológiách, podnikaní, ochrane údajov a sporovej agende.'
      },
      {
        eyebrow: 'Strategické právo pre technologický kapitál',
        title: 'Právo, ktoré drží tempo s trhom',
        subline: 'Podporujeme investorov, founderov a scale-up tímy: od transakcií a zmlúv až po GDPR, kyberbezpečnosť a sporovú obranu.'
      },
      {
        eyebrow: 'Hybrid SK/CZ legal command',
        title: 'Istota v regulácii. Rýchlosť v rozhodovaní.',
        subline: 'Spájame presnosť právnej analýzy s business pohľadom, aby firmy mohli bezpečne rásť v prostredí technológií a regulácie.'
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
    if (page !== 'index' || reduceMotion) return;
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (!hero || !content || hero.querySelector('.hero-command-canvas')) return;

    var kpi = document.createElement('div');
    kpi.className = 'hero-kpi';
    kpi.innerHTML =
      '<span class="hero-kpi-chip">Incident desk <strong>online</strong></span>' +
      '<span class="hero-kpi-chip">GDPR readiness <strong>98%</strong></span>' +
      '<span class="hero-kpi-chip">Contract response <strong>&lt;24h</strong></span>';
    content.appendChild(kpi);

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
    var nodeCount = 42;
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
      grad.addColorStop(0, 'rgba(15,47,107,0.2)');
      grad.addColorStop(1, 'rgba(152,112,59,0.08)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      for (var i = 0; i < nodes.length; i += 1) {
        var a = nodes[i];
        a.y -= a.vy;
        a.x += Math.sin(t + a.phase) * 0.2 + a.drift * 0.12;
        if (a.y < -12) resetNode(a, true);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(15,47,107,0.32)';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j += 1) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 118) continue;
          var alpha = (1 - dist / 118) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(31,87,181,' + alpha.toFixed(3) + ')';
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
        document.body.style.transition = 'opacity .22s ease';
        document.body.style.opacity = '0.82';
        window.setTimeout(function () { window.location.href = url.href; }, 160);
        e.preventDefault();
      });
    });
  }

  function subtleCardTilt() {
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

  addMarketStrip();
  setupMobileNav();
  setActiveNav();
  setupNavScrollState();
  addNavIcons();
  activateScrollAnimations();
  setupHeroVoiceVariants();
  enhanceHeroHome();
  setupTransitions();
  subtleCardTilt();
})();
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var page = document.body && document.body.getAttribute('data-page');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
  });

  if (page) {
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 44);
    });
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

  function enhanceHeroHome() {
    if (page !== 'index' || reduceMotion) return;
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (!hero || !content || hero.querySelector('.hero-command-canvas')) return;

    var kpi = document.createElement('div');
    kpi.className = 'hero-kpi';
    kpi.innerHTML =
      '<span class="hero-kpi-chip">Incident desk <strong>online</strong></span>' +
      '<span class="hero-kpi-chip">GDPR readiness <strong>98%</strong></span>' +
      '<span class="hero-kpi-chip">Contract response <strong>&lt;24h</strong></span>';
    content.appendChild(kpi);

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
    var nodeCount = 42;
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
      grad.addColorStop(0, 'rgba(15,47,107,0.2)');
      grad.addColorStop(1, 'rgba(152,112,59,0.08)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      for (var i = 0; i < nodes.length; i += 1) {
        var a = nodes[i];
        a.y -= a.vy;
        a.x += Math.sin(t + a.phase) * 0.2 + a.drift * 0.12;
        if (a.y < -12) resetNode(a, true);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(15,47,107,0.32)';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j += 1) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 118) continue;
          var alpha = (1 - dist / 118) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(31,87,181,' + alpha.toFixed(3) + ')';
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
        document.body.style.transition = 'opacity .22s ease';
        document.body.style.opacity = '0.82';
        window.setTimeout(function () { window.location.href = url.href; }, 160);
        e.preventDefault();
      });
    });
  }

  function subtleCardTilt() {
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

  addNavIcons();
  activateScrollAnimations();
  enhanceHeroHome();
  setupTransitions();
  subtleCardTilt();
})();
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var page = document.body && document.body.getAttribute('data-page');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
  });

  if (page) {
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 44);
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

  function enhanceHeroHome() {
    if (page !== 'index' || reduceMotion) return;
    var hero = document.querySelector('.hero');
    var content = document.querySelector('.hero-content');
    if (!hero || !content || hero.querySelector('.hero-command-canvas')) return;

    var kpi = document.createElement('div');
    kpi.className = 'hero-kpi';
    kpi.innerHTML = '' +
      '<span class="hero-kpi-chip">Incident desk <strong>online</strong></span>' +
      '<span class="hero-kpi-chip">GDPR readiness <strong>98%</strong></span>' +
      '<span class="hero-kpi-chip">Contract response <strong>&lt;24h</strong></span>';
    content.appendChild(kpi);

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
    var nodeCount = 42;
    var start = performance.now();

    function resetNode(n, forceBottom) {
      n.x = Math.random() * w;
      n.y = forceBottom ? h + Math.random() * 120 : Math.random() * h;
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
      grad.addColorStop(0, 'rgba(15,47,107,0.2)');
      grad.addColorStop(1, 'rgba(152,112,59,0.08)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'source-over';
      for (var i = 0; i < nodes.length; i += 1) {
        var a = nodes[i];
        a.y -= a.vy;
        a.x += Math.sin(t + a.phase) * 0.2 + a.drift * 0.12;
        if (a.y < -12) resetNode(a, true);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(15,47,107,0.32)';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j += 1) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 118) continue;
          var alpha = (1 - dist / 118) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(31,87,181,' + alpha.toFixed(3) + ')';
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
        document.body.style.transition = 'opacity .22s ease';
        document.body.style.opacity = '0.82';
        window.setTimeout(function () { window.location.href = url.href; }, 160);
        e.preventDefault();
      });
    });
  }

  function subtleCardTilt() {
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

  addNavIcons();
  activateScrollAnimations();
  enhanceHeroHome();
  setupTransitions();
  subtleCardTilt();
})();
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var links = document.getElementById('nav-links');
  var page = document.body && document.body.getAttribute('data-page');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setNavOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
  });

  if (page) {
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  var revealTargets = document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip,section.section');
  revealTargets.forEach(function (el) {
    if (el.tagName.toLowerCase() === 'section') el.classList.add('section-reveal');
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('visible', 'is-visible'); });
  }

  // Refined pointer interaction: subtle card lift to keep premium feel.
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      if (reduceMotion) return;
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var rx = (py - 0.5) * -3;
      var ry = (px - 0.5) * 3;
      card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-8px)';
    });
    card.addEventListener('pointerleave', function () {
      card.style.transform = '';
    });
  });
})();
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body && document.body.getAttribute('data-page');
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
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
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    if (open) lockScroll();
    else unlockScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', function () { setNavOpen(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) setNavOpen(false);
  });

  if (page) {
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  function revealOnScroll() {
    var targets = document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip,section.section');
    targets.forEach(function (el) {
      if (el.tagName.toLowerCase() === 'section') el.classList.add('section-reveal');
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('visible', 'is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  function addTopStatus() {
    if (document.querySelector('.cc-top-status')) return;
    var wrap = document.createElement('div');
    wrap.className = 'cc-top-status';
    var left = document.createElement('div');
    left.className = 'cc-chip';
    left.innerHTML = 'Mode <strong>Legal Command</strong>';
    var right = document.createElement('div');
    right.className = 'cc-chip';
    right.innerHTML = 'Threat <strong>LOW</strong> / Compliance <strong>ACTIVE</strong>';
    wrap.appendChild(left);
    wrap.appendChild(right);
    document.body.appendChild(wrap);

    var scanline = document.createElement('div');
    scanline.className = 'cc-scanline';
    scanline.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scanline);
  }

  function heroMotifByPage() {
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

  function setupPageTransitions() {
    if (reduceMotion || document.querySelector('.page-transition-overlay')) return;
    var overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

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
        e.preventDefault();
        document.body.classList.add('is-leaving');
        window.setTimeout(function () { window.location.href = url.href; }, 280);
      });
    });

    window.addEventListener('pageshow', function () {
      document.body.classList.remove('is-leaving');
    });
  }

  function tacticalCanvas() {
    if (reduceMotion) return;
    if (document.querySelector('.anime-overlay-canvas')) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'anime-overlay-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = 1;
    var w = 0;
    var h = 0;
    var nodes = [];
    var count = Math.min(54, Math.max(26, Math.floor(window.innerWidth / 28)));

    function resetNode(n) {
      n.x = Math.random() * w;
      n.y = Math.random() * h;
      n.vx = (Math.random() - 0.5) * 0.26;
      n.vy = (Math.random() - 0.5) * 0.26;
      n.r = 0.9 + Math.random() * 1.9;
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
      nodes = [];
      for (var i = 0; i < count; i += 1) {
        var n = {};
        resetNode(n);
        nodes.push(n);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'screen';

      for (var i = 0; i < nodes.length; i += 1) {
        var a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < -20 || a.x > w + 20 || a.y < -20 || a.y > h + 20) resetNode(a);

        ctx.beginPath();
        ctx.fillStyle = 'rgba(87,200,255,0.35)';
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j += 1) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 130) continue;
          var alpha = (1 - dist / 130) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(143,255,190,' + alpha.toFixed(3) + ')';
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

  function cardTilt() {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (reduceMotion) return;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (py - 0.5) * -5;
        var ry = (px - 0.5) * 6;
        card.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  }

  revealOnScroll();
  addTopStatus();
  heroMotifByPage();
  setupPageTransitions();
  tacticalCanvas();
  cardTilt();
})();
