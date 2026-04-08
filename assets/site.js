(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.setAttribute('data-visual-version', 'seedance-2-0');
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
  if (page) {
    document.querySelectorAll('.nav-link[data-nav="' + page + '"]').forEach(function (el) {
      el.classList.add('is-active');
    });
  }

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

    // SEEDANCE 2.0: lightweight ambient layers for all hero sections.
    document.querySelectorAll('.hero').forEach(function (hero) {
      if (!hero.querySelector('.seedance-hero-layer--aurora')) {
        var aurora = document.createElement('div');
        aurora.className = 'seedance-hero-layer seedance-hero-layer--aurora';
        hero.appendChild(aurora);
      }
      if (!hero.querySelector('.seedance-hero-layer--noise')) {
        var noise = document.createElement('div');
        noise.className = 'seedance-hero-layer seedance-hero-layer--noise';
        hero.appendChild(noise);
      }
    });

    var progress = document.createElement('div');
    progress.className = 'seedance-progress';
    document.body.appendChild(progress);
    var updateProgress = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? ((window.scrollY || window.pageYOffset || 0) / max) : 0;
      progress.style.width = Math.max(0, Math.min(100, ratio * 100)) + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    var cards = document.querySelectorAll('.card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rx = (0.5 - y) * 5;
        var ry = (x - 0.5) * 6;
        card.style.transform = 'translateY(-6px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  } else {
    document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip')
      .forEach(function (el) { el.classList.add('visible'); });
  }
})();
