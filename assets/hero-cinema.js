(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('.hero-cinema');
  if (!root) return;

  var slides = root.querySelectorAll('.hero-cinema__slide');
  var canvas = root.querySelector('.hero-cinema__dust');
  var idx = 0;
  var timer;

  function setActive(i) {
    slides.forEach(function (s, j) {
      s.classList.toggle('is-active', j === i);
    });
  }

  function next() {
    idx = (idx + 1) % slides.length;
    setActive(idx);
  }

  if (!reduceMotion && slides.length > 1) {
    timer = window.setInterval(next, 7800);
    root.addEventListener('mouseenter', function () {
      if (timer) window.clearInterval(timer);
      timer = null;
    });
    root.addEventListener('mouseleave', function () {
      if (!timer) timer = window.setInterval(next, 7800);
    });
  }

  function dustLoop() {
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var parts = [];

    function resize() {
      var rect = root.getBoundingClientRect();
      w = Math.max(2, Math.floor(rect.width));
      h = Math.max(2, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = [];
      var n = Math.min(48, Math.floor((w * h) / 7000) + 10);
      for (var i = 0; i < n; i += 1) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.35 + Math.random() * 1.2,
          vy: 0.12 + Math.random() * 0.35,
          a: 0.06 + Math.random() * 0.16
        });
      }
    }

    function tick() {
      if (!w) {
        resize();
        requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      var t = Date.now() * 0.001;
      for (var i = 0; i < parts.length; i += 1) {
        var p = parts[i];
        p.y -= p.vy;
        if (p.y < -4) p.y = h + 4;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(120, 235, 255,' + p.a + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (var j = 0; j < 6; j += 1) {
        var gx = (Math.sin(t * 0.35 + j) * 0.5 + 0.5) * w;
        var gy = (Math.cos(t * 0.28 + j * 1.1) * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(232, 213, 168, 0.05)';
        ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(root);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(tick);
  }

  dustLoop();
})();
