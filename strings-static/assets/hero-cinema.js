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

  function buildParticles() {
    var cap = w < 640 ? 1300 : 2400;
    if (reduceMotion) cap = Math.min(380, Math.floor(cap * 0.28));
    var n = Math.min(cap, Math.max(reduceMotion ? 120 : 520, Math.floor((w * h) / 380)));
    parts = [];
    for (var i = 0; i < n; i += 1) {
      parts.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00075,
        vy: (Math.random() - 0.5) * 0.00075,
        s: 0.52 + Math.random() * 2.05,
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

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(6, 9, 16, 0.5)';
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < parts.length; i += 1) {
      stepParticle(parts[i], t, ch, nodes, cx, cy);
    }

    if (!reduceMotion && (ch === 0 || ch === 2)) {
      ctx.globalCompositeOperation = 'lighter';
      var lim = Math.min(parts.length, 300);
      var thr = ch === 0 ? 148 : 122;
      thr *= thr;
      for (var a = 0; a < lim; a += 2) {
        for (var b = a + 4; b < lim; b += 5) {
          var pa = parts[a];
          var pb = parts[b];
          var ddx = (pa.x - pb.x) * w;
          var ddy = (pa.y - pb.y) * h;
          if (ddx * ddx + ddy * ddy < thr) {
            var alp = ch === 0 ? 0.062 : 0.05;
            ctx.strokeStyle =
              ch === 0 ? 'rgba(110, 225, 255,' + alp + ')' : 'rgba(200, 210, 255,' + alp + ')';
            ctx.lineWidth = 0.72;
            ctx.beginPath();
            ctx.moveTo(pa.x * w, pa.y * h);
            ctx.lineTo(pb.x * w, pb.y * h);
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
      var alpha = ch === 1 ? 0.12 + p.s * 0.055 : 0.085 + p.s * 0.048;
      if (reduceMotion) alpha *= 0.65;
      ctx.beginPath();
      ctx.fillStyle = col + alpha + ')';
      ctx.arc(p.x * w, p.y * h, p.s, 0, Math.PI * 2);
      ctx.fill();
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
