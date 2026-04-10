/**
 * Hero: „digitálny vesmír“ — pohľad zhora na rotujúcu špirálovú galaxiu
 * zo žiarivých častíc a krátkych útržkov kódu (canvas 2D).
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
  var t0 = performance.now();
  var canvasReady = false;
  var arms = [];
  var sparks = [];
  var shards = [];

  var CODE_FRAGS = [
    'const', 'return', 'async', 'await', '{ }', '[]', '0x', 'fn',
    'Law', 'lex', 'data', 'hash', 'TLS', 'API', 'DPA', 'void',
    'if', 'for', 'map', 'seed', 'node', 'git', 'src', 'build',
    '//', '/**/', '===', '!==', '=>', 'new', 'try', 'catch',
    'type', 'null', 'enum', 'case', 'let', 'var', 'doc', 'key'
  ];

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function markCanvasReady() {
    if (canvasReady) return;
    canvasReady = true;
    document.documentElement.classList.add('strings-hero-canvas-ready');
  }

  function buildArms() {
    arms = [];
    var armCount = 4;
    var a;
    for (a = 0; a < armCount; a += 1) {
      var pts = [];
      var i;
      for (i = 0; i < 220; i += 1) {
        var u = i * 0.065;
        var r = 6 + u * u * 0.95;
        var ang = u * 0.62 + (a * Math.PI * 2) / armCount;
        pts.push({ r: r, ang: ang });
      }
      arms.push({
        pts: pts,
        hue: a % 2 === 0 ? rand(38, 48) : rand(188, 210),
        w0: rand(0.35, 0.85)
      });
    }
  }

  function buildSparks() {
    sparks = [];
    var i;
    var cap = Math.min(260, Math.floor((w * h) / 6200));
    for (i = 0; i < cap; i += 1) {
      var arm = arms[i % arms.length];
      var p = arm.pts[Math.floor(Math.random() * arm.pts.length)];
      sparks.push({
        r: p.r * rand(0.92, 1.08) + rand(-4, 4),
        ang: p.ang + rand(-0.09, 0.09),
        s: rand(0.35, 1.65),
        tw: rand(0, Math.PI * 2),
        hue: arm.hue + rand(-8, 8)
      });
    }
  }

  function buildShards() {
    shards = [];
    var cap = w < 600 ? 14 : 22;
    var i;
    for (i = 0; i < cap; i += 1) {
      shards.push({
        r: rand(28, Math.min(w, h) * 0.46),
        ang: rand(0, Math.PI * 2),
        spin: rand(-0.55, 0.55),
        text: CODE_FRAGS[i % CODE_FRAGS.length],
        hue: Math.random() < 0.45 ? rand(40, 52) : rand(185, 205),
        size: rand(8, 10.5)
      });
    }
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
    cx = w * 0.5;
    cy = h * 0.36;
    buildArms();
    buildSparks();
    buildShards();
  }

  function drawGalaxy(t) {
    var rot = t * 0.045;
    var drift = t * 0.018;
    var diskY = 0.4;
    var i;
    var a;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(drift * 0.035);
    ctx.scale(1, diskY);

    for (a = 0; a < arms.length; a += 1) {
      var arm = arms[a];
      ctx.beginPath();
      var pts = arm.pts;
      for (i = 0; i < pts.length; i += 1) {
        var p = pts[i];
        var x = p.r * Math.cos(p.ang + rot);
        var y = p.r * Math.sin(p.ang + rot);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle =
        'hsla(' + arm.hue + ',' + (55 + (a % 3) * 5) + '%,' + (58 + (a % 2) * 6) + '%,' + (0.06 + arm.w0 * 0.04).toFixed(3) + ')';
      ctx.lineWidth = 1.05;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < sparks.length; i += 1) {
      var sp = sparks[i];
      var tw = 0.55 + 0.35 * Math.sin(t * 0.75 + sp.tw);
      var x = sp.r * Math.cos(sp.ang + rot * 1.02);
      var y = sp.r * Math.sin(sp.ang + rot * 1.02);
      ctx.fillStyle = 'hsla(' + sp.hue + ',70%,68%,' + (tw * 0.11).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(x, y, sp.s * tw, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot * 0.18);
    ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (i = 0; i < shards.length; i += 1) {
      var sh = shards[i];
      sh.ang += sh.spin * 0.005;
      var xr = sh.r * Math.cos(sh.ang + rot * 0.9);
      var yr = sh.r * Math.sin(sh.ang + rot * 0.9) * diskY;
      ctx.font = '600 ' + sh.size + 'px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'hsla(' + sh.hue + ',55%,55%,0.22)';
      ctx.fillStyle = 'hsla(' + sh.hue + ',42%,72%,' + (0.2 + 0.08 * Math.sin(t * 0.9 + i)).toFixed(3) + ')';
      ctx.fillText(sh.text, xr, yr);
    }
    ctx.restore();

    ctx.shadowBlur = 0;

    var pulse = 0.028 + 0.012 * Math.sin(t * 0.65);
    var rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.55);
    rg.addColorStop(0, 'rgba(255,230,180,' + pulse + ')');
    rg.addColorStop(0.22, 'rgba(120,200,255,' + (pulse * 0.1) + ')');
    rg.addColorStop(0.5, 'rgba(20,40,80,' + (pulse * 0.05) + ')');
    rg.addColorStop(1, 'rgba(8,12,22,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  function draw(tSec) {
    if (w < 2 || h < 2) return;
    if (w > 1 && h > 1) markCanvasReady();
    ctx.clearRect(0, 0, w, h);
    drawGalaxy(tSec);
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
      draw((now - t0) * 0.001);
      requestAnimationFrame(legacyLoop);
    }
    requestAnimationFrame(legacyLoop);
  }
})();
