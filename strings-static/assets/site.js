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
  } else {
    document.querySelectorAll('.animate-on-scroll,.animate-slide-left,.animate-slide-right,.animate-scale,.animate-clip')
      .forEach(function (el) { el.classList.add('visible'); });
  }
})();
