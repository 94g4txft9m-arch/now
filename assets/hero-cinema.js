(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /**
   * Procedurálny hologram (časticový prach, tri režimy fyziky).
   * Externé AI video: export WebM/MP4 do #hero-hologram-root pod canvas.
   */
  var hero = document.querySelector('.hero.hero--prestige');
  var holoRoot = document.getElementById('hero-hologram-root');
  var canvas = document.getElementById('hero-hologram-canvas');
  if (!hero || !holoRoot || !canvas) return;
  /* Domovský hero: statická / CSS animovaná fotografia namiesto canvasu. */
  if (holoRoot.querySelector('.hero-hologram__photo')) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var idx = 0;
  var timer = null;

  function next() {
    idx = (idx + 1) % 3;
  }

  if (!reduceMotion) {
    timer = window.setInterval(next, 8200);
    hero.addEventListener('mouseenter', function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    });
    hero.addEventListener('mouseleave', function () {
      if (!timer) timer = window.setInterval(next, 8200);
    });
  }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0;
  var h = 0;
  var lastW = 0;
  var lastH = 0;
  var parts = [];

  function networkNodes(t) {
    var nodes = [];
    var baseX = 0.5;
    for (var i = 0; i < 9; i += 1) {
      var ang = (i / 9) * Math.PI * 2 + t * 0.11;
      nodes.push({
        x: baseX + Math.cos(ang) * 0.5,
        y: 0.3 + Math.sin(ang * 1.22) * 0.4
      });
    }
    return nodes;
  }

  function nearestNode(px, py, nodes) {
    var best = nodes[0];
    var bestd = 1e9;
    for (var i = 0; i < nodes.length; i += 1) {
      var dx = nodes[i].x - px;
      var dy = nodes[i].y - py;
      var d = dx * dx + dy * dy;
      if (d < bestd) {
        bestd = d;
        best = nodes[i];
      }
    }
    return best;
  }

  function hash01(a, b) {
    return ((Math.sin(a * 12.9898 + b * 78.233) * 43758.5453) % 1 + 1) % 1;
  }

  function buildParticles() {
    var cap = w < 640 ? 1500 : 2600;
    if (reduceMotion) cap = Math.min(380, Math.floor(cap * 0.28));
    var n = Math.min(cap, Math.max(reduceMotion ? 120 : 560, Math.floor((w * h) / 340)));
    parts = [];
    for (var i = 0; i < n; i += 1) {
      var y = Math.random() < 0.42 ? 0.58 + Math.random() * 0.42 : Math.random();
      parts.push({
        x: Math.random(),
        y: y,
        vx: (Math.random() - 0.5) * 0.00075,
        vy: (Math.random() - 0.5) * 0.00075,
        s: 0.48 + Math.random() * 2.15,
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  function stepParticle(p, t, chapter, nodes, cx, cy) {
    var ax = 0;
    var ay = 0;
    if (chapter === 0) {
      var target = nearestNode(p.x, p.y, nodes);
      ax = (target.x - p.x) * 0.00052;
      ay = (target.y - p.y) * 0.00052;
      ax += Math.sin(t * 0.42 + p.tw) * 0.0001;
      ay += Math.cos(t * 0.38 + p.tw) * 0.0001;
    } else if (chapter === 1) {
      var dx = p.x - cx;
      var dy = p.y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy) + 1e-5;
      ax = (-dx / dist) * 0.0001;
      ay = (-dy / dist) * 0.0001;
      ax += (dy / dist) * 0.00044;
      ay += (-dx / dist) * 0.00044;
      ax += Math.sin(t * 0.55 + p.y * 9) * 0.00006;
    } else {
      var left = { x: 0.22, y: 0.5 };
      var right = { x: 0.88, y: 0.5 };
      var pick = p.x < 0.55 ? left : right;
      ax = (pick.x - p.x) * 0.00036;
      ay = (pick.y - p.y) * 0.00036;
      ay += (0.5 - p.y) * 0.00014;
      ax += Math.sin(t * 0.22 + p.tw) * 0.00007;
    }
    p.vx = (p.vx + ax) * 0.966;
    p.vy = (p.vy + ay) * 0.966;
    p.x += p.vx * 18;
    p.y += p.vy * 18;
    if (p.x < 0) p.x += 1;
    if (p.x > 1) p.x -= 1;
    if (p.y < 0) p.y += 1;
    if (p.y > 1) p.y -= 1;
  }

  function resize() {
    var rect = hero.getBoundingClientRect();
    var nw = Math.max(2, Math.floor(rect.width));
    var nh = Math.max(2, Math.floor(rect.height));
    w = nw;
    h = nh;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(nh * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = nh + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (Math.abs(nw - lastW) > 32 || Math.abs(nh - lastH) > 32 || !parts.length) {
      lastW = nw;
      lastH = nh;
      buildParticles();
    }
  }

  function draw(now) {
    if (w < 4 || h < 4) {
      resize();
      requestAnimationFrame(draw);
      return;
    }
    var t = now * 0.001;
    var ch = reduceMotion ? 0 : idx;
    var nodes = networkNodes(t);
    var cx = 0.72 + Math.sin(t * 0.16) * 0.08;
    var cy = 0.4 + Math.sin(t * 0.2) * 0.12;

    /* Neustále otáčanie celej „siete“ okolo stredu (vizuál vírusov). */
    var rcx = w * 0.5;
    var rcy = h * 0.43;
    var rotAngle = reduceMotion ? 0 : t * 0.2;
    var cR = Math.cos(rotAngle);
    var sR = Math.sin(rotAngle);
    function R(px, py) {
      var dx = px - rcx;
      var dy = py - rcy;
      return { x: rcx + dx * cR - dy * sR, y: rcy + dx * sR + dy * cR };
    }

    ctx.globalCompositeOperation = 'source-over';
    /* Mäkší „chvost“: dole slabšie mazanie = viac viditeľného prachu, menej ostrej čiary. */
    var fade = ctx.createLinearGradient(0, 0, 0, h);
    fade.addColorStop(0, 'rgba(6, 9, 16, 0.52)');
    fade.addColorStop(0.62, 'rgba(6, 9, 16, 0.46)');
    fade.addColorStop(0.82, 'rgba(6, 9, 16, 0.3)');
    fade.addColorStop(1, 'rgba(6, 9, 16, 0.16)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < parts.length; i += 1) {
      stepParticle(parts[i], t, ch, nodes, cx, cy);
    }

    if (!reduceMotion) {
      ctx.globalCompositeOperation = 'lighter';
      var lim = Math.min(parts.length, 320);
      var thr = ch === 0 ? 152 : ch === 1 ? 96 : 124;
      thr *= thr;
      var stepB = ch === 1 ? 6 : 5;
      for (var a = 0; a < lim; a += ch === 1 ? 3 : 2) {
        for (var b = a + 4; b < lim; b += stepB) {
          var pa = parts[a];
          var pb = parts[b];
          var ddx = (pa.x - pb.x) * w;
          var ddy = (pa.y - pb.y) * h;
          if (ddx * ddx + ddy * ddy < thr) {
            var alp =
              ch === 0 ? 0.068 : ch === 1 ? 0.032 : 0.054;
            ctx.strokeStyle =
              ch === 0
                ? 'rgba(110, 235, 255,' + alp + ')'
                : ch === 1
                  ? 'rgba(255, 220, 185,' + alp + ')'
                  : 'rgba(200, 210, 255,' + alp + ')';
            ctx.lineWidth = ch === 1 ? 0.5 : 0.72;
            var A = R(pa.x * w, pa.y * h);
            var B = R(pb.x * w, pb.y * h);
            ctx.beginPath();
            ctx.moveTo(A.x, A.y);
            ctx.lineTo(B.x, B.y);
            ctx.stroke();
          }
        }
      }
    }

    ctx.globalCompositeOperation = 'lighter';
    for (var j = 0; j < parts.length; j += 1) {
      var p = parts[j];
      var col =
        ch === 0
          ? 'rgba(120, 235, 255,'
          : ch === 1
            ? 'rgba(255, 230, 200,'
            : 'rgba(185, 215, 255,';
      var alpha = ch === 1 ? 0.12 + p.s * 0.058 : 0.088 + p.s * 0.052;
      if (p.y > 0.68) alpha *= 1.15 + (p.y - 0.68) * 0.85;
      if (alpha > 0.34) alpha = 0.34;
      if (reduceMotion) alpha *= 0.65;
      var P = R(p.x * w, p.y * h);
      ctx.beginPath();
      ctx.fillStyle = col + alpha + ')';
      ctx.arc(P.x, P.y, p.s, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Ďalšia vrstva „AI vírusov“ v spodnej tretine — bez uloženia stavu, mäkký šum. */
    if (!reduceMotion) {
      ctx.globalCompositeOperation = 'lighter';
      var sparks = w < 640 ? 110 : 160;
      for (var s = 0; s < sparks; s += 1) {
        var sx = hash01(s * 0.37, t * 0.15) * w;
        var sy = (0.68 + hash01(s * 0.91, t * 0.22) * 0.32) * h;
        var sr = 0.25 + hash01(s, t * 0.4) * 1.35;
        var sa = 0.04 + hash01(s * 1.7, t) * 0.09;
        var sc =
          ch === 0
            ? 'rgba(140, 245, 255,'
            : ch === 1
              ? 'rgba(255, 235, 210,'
              : 'rgba(195, 225, 255,';
        var S = R(sx, sy);
        ctx.beginPath();
        ctx.fillStyle = sc + sa + ')';
        ctx.arc(S.x, S.y, sr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(hero);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
})();
