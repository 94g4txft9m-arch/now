(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.navbar');
  var toggle = document.querySelector('.nav-toggle');
  var backdrop = document.querySelector('.nav-backdrop');
  var links = document.getElementById('nav-links');

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
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
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNavOpen(false);
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
