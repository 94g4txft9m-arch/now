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
