/**
 * Hero background: quantum / orbital spiral (canvas 2D).
 * Ak existuje STRINGS_BRAIN, kreslí v jednom taktu s Three.js a ostatnými vrstvami.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.body.getAttribute('data-page') !== 'index') return;

  var hero = document.querySelector('.hero--prestige');
  if (!hero || hero.querySelector('.hero-quantum-canvas')) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'hero-quantum-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  var anchor = hero.querySelector('#str-three-host') || hero.querySelector('.hero-bg');
  if (anchor) anchor.after(canvas);
  else hero.insertBefore(canvas, hero.firstChild);

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = 1;
  var w = 0;
  var h = 0;
  var cx = 0;
  var cy = 0;
  var orbits = [];
  var stars = [];
  var t0Local = performance.now();

  var ORBIT_COUNT = 48;
  var STAR_COUNT = 80;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  var canvasReady = false;
  function markCanvasReady() {
    if (canvasReady) return;
    canvasReady = true;
    document.documentElement.classList.add('strings-hero-canvas-ready');
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
    cx = w * 0.52;
    cy = h * 0.42;
    orbits = [];
    var i;
    for (i = 0; i < ORBIT_COUNT; i += 1) {
      var hueRoll = Math.random();
      var hue;
      if (hueRoll < 0.26) {
        hue = rand(92, 112);
      } else if (i < ORBIT_COUNT * 0.42) {
        hue = rand(280, 320);
      } else {
        hue = rand(185, 210);
      }
      orbits.push({
        r: 40 + i * (Math.max(w, h) * 0.022),
        tilt: rand(-0.95, 0.95),
        spin: rand(-1, 1) * (0.08 + i * 0.004),
        phase: rand(0, Math.PI * 2),
        hue: hue,
        alpha: rand(0.06, 0.22) * (1 - i / ORBIT_COUNT * 0.35)
      });
    }
    stars = [];
    for (i = 0; i < STAR_COUNT; i += 1) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() * 1.2 + 0.2,
        tw: rand(0, Math.PI * 2)
      });
    }
  }

  function draw(t) {
    if (w > 1 && h > 1) markCanvasReady();
    ctx.clearRect(0, 0, w, h);

    var i;
    for (i = 0; i < stars.length; i += 1) {
      var st = stars[i];
      var tw = 0.35 + 0.2 * Math.sin(t * 1.2 + st.tw);
      ctx.fillStyle = 'rgba(255,250,240,' + (tw * 0.15).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.s, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';

    for (i = 0; i < orbits.length; i += 1) {
      var o = orbits[i];
      var rot = o.phase + t * o.spin;
      ctx.save();
      ctx.rotate(rot);
      ctx.scale(1, 0.28 + Math.abs(o.tilt) * 0.55);
      ctx.rotate(o.tilt * 0.4);
      ctx.strokeStyle = 'hsla(' + o.hue + ',65%,62%,' + o.alpha.toFixed(3) + ')';
      ctx.lineWidth = 0.6 + (i % 5) * 0.08;
      ctx.beginPath();
      ctx.ellipse(0, 0, o.r, o.r, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    var pulse = 0.04 + 0.03 * Math.sin(t * 0.9);
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.18);
    g.addColorStop(0, 'rgba(255,255,255,' + pulse + ')');
    g.addColorStop(0.22, 'rgba(118,185,0,' + (pulse * 0.1) + ')');
    g.addColorStop(0.4, 'rgba(200,170,230,' + (pulse * 0.32) + ')');
    g.addColorStop(1, 'rgba(10,16,30,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  resize();
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function () {
      resize();
    });
    ro.observe(hero);
  }

  function onBrainTick(t) {
    draw(t);
  }

  if (window.STRINGS_BRAIN && typeof window.STRINGS_BRAIN.subscribe === 'function') {
    window.STRINGS_BRAIN.subscribe(onBrainTick);
  } else {
    function legacyLoop(now) {
      draw((now - t0Local) * 0.001);
      requestAnimationFrame(legacyLoop);
    }
    requestAnimationFrame(legacyLoop);
  }
})();
