(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /**
   * Príbeh = procedurálna animácia (časticový „AI prach“ + kapitoly).
   * Externé AI video (Runway, Pika, Kling, …): export WebM/MP4, vlož <video> do #hero-hologram-root
   * pod canvas a v draw() preskoč častice alebo ich zmiešaj ako overlay.
   */
  var hero = document.querySelector('.hero.hero--prestige');
  var holoRoot = document.getElementById('hero-hologram-root');
  var canvas = document.getElementById('hero-hologram-canvas');
  var chapterEl = document.getElementById('hero-cinema-chapter');
  var storyEl = document.getElementById('hero-cinema-story');
  if (!hero || !holoRoot || !canvas || !storyEl) return;

  var STORY_CHAPTERS = ['I — Sieť', 'II — Pozornosť', 'III — Rovnováha'];
  var STORY_BEATS = [
    'Kdesi medzi servermi sa rodí poriadok: nie náhodný šum, ale vzorec — dáta hľadajú cestu tak, ako neskôr hľadajú právo.',
    'Technológia vidí ďalej než človek v jednej chvíli. Rozhodnutie, čo z toho smie zostať, však patrí stále pravidlám, zmluvám a regulácii.',
    'Váhy nepatria minulosti. Ležia medzi inováciou a dôverou klienta — a na STRINGS držíme obe misy rovnako vážne.'
  ];

  var idx = 0;
  var timer = null;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  function updateStory(i) {
    if (chapterEl) chapterEl.textContent = STORY_CHAPTERS[i] || '';
    storyEl.textContent = STORY_BEATS[i] || '';
  }

  function setChapter(i) {
    idx = i % STORY_BEATS.length;
    storyEl.style.opacity = '0.25';
    window.setTimeout(function () {
      updateStory(idx);
      storyEl.style.opacity = '1';
    }, 200);
  }

  function next() {
    setChapter(idx + 1);
  }

  if (reduceMotion) {
    if (chapterEl) chapterEl.textContent = 'Tri kapitoly';
    storyEl.classList.add('hero-hologram-story__body--full');
    storyEl.innerHTML = '';
    for (var k = 0; k < STORY_BEATS.length; k += 1) {
      var p = document.createElement('p');
      p.className = 'hero-hologram-story__part';
      p.textContent = STORY_CHAPTERS[k] + '. ' + STORY_BEATS[k];
      storyEl.appendChild(p);
    }
    return;
  }

  updateStory(0);
  timer = window.setInterval(next, 8200);
  hero.addEventListener('mouseenter', function () {
    if (timer) window.clearInterval(timer);
    timer = null;
  });
  hero.addEventListener('mouseleave', function () {
    if (!timer) timer = window.setInterval(next, 8200);
  });

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0;
  var h = 0;
  var lastW = 0;
  var lastH = 0;
  var parts = [];

  function networkNodes(t) {
    var nodes = [];
    var baseX = 0.54;
    for (var i = 0; i < 7; i += 1) {
      var ang = (i / 7) * Math.PI * 2 + t * 0.12;
      nodes.push({
        x: baseX + Math.cos(ang) * 0.36,
        y: 0.36 + Math.sin(ang * 1.25) * 0.3
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
    var n = Math.min(1050, Math.max(260, Math.floor((w * h) / 920)));
    parts = [];
    for (var i = 0; i < n; i += 1) {
      parts.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        s: 0.35 + Math.random() * 1.35,
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
      var left = { x: 0.33, y: 0.49 };
      var right = { x: 0.79, y: 0.49 };
      var pick = p.x < 0.56 ? left : right;
      ax = (pick.x - p.x) * 0.00036;
      ay = (pick.y - p.y) * 0.00036;
      ay += (0.5 - p.y) * 0.00014;
      ax += Math.sin(t * 0.22 + p.tw) * 0.00007;
    }
    p.vx = (p.vx + ax) * 0.966;
    p.vy = (p.vy + ay) * 0.966;
    p.x += p.vx * 16;
    p.y += p.vy * 16;
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
    var ch = idx;
    var nodes = networkNodes(t);
    var cx = 0.75 + Math.sin(t * 0.18) * 0.03;
    var cy = 0.41 + Math.sin(t * 0.22) * 0.035;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(5, 9, 16, 0.38)';
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < parts.length; i += 1) {
      stepParticle(parts[i], t, ch, nodes, cx, cy);
    }

    if (ch === 0 || ch === 2) {
      ctx.globalCompositeOperation = 'lighter';
      var lim = Math.min(parts.length, 200);
      var thr = ch === 0 ? 115 : 88;
      thr *= thr;
      for (var a = 0; a < lim; a += 2) {
        for (var b = a + 3; b < lim; b += 6) {
          var pa = parts[a];
          var pb = parts[b];
          var ddx = (pa.x - pb.x) * w;
          var ddy = (pa.y - pb.y) * h;
          if (ddx * ddx + ddy * ddy < thr) {
            var alp = ch === 0 ? 0.038 : 0.03;
            ctx.strokeStyle =
              ch === 0 ? 'rgba(110, 225, 255,' + alp + ')' : 'rgba(200, 210, 255,' + alp + ')';
            ctx.lineWidth = 0.55;
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
      var alpha = ch === 1 ? 0.085 + p.s * 0.045 : 0.05 + p.s * 0.038;
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
