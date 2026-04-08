/**
 * Úvodná stránka: „nanorobotová“ mriežka, EM blesky, vesmírne výbuchy,
 * pulz v rytme srdca (~72 BPM). Respektuje prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.getElementById("hero-sim-canvas");
  if (!canvas) return;

  var hero = canvas.closest(".hero");
  if (!hero) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0;
  var H = 0;
  var t0 = performance.now();

  /** ~72 BPM: jeden kompletný „lub–dub“ cyklus v sekundách */
  var HEART_CYCLE = 60 / 72;

  var bolts = [];
  var bursts = [];

  function resize() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function heartPulseScale(now) {
    var phase = ((now - t0) / 1000) % HEART_CYCLE;
    var p = phase / HEART_CYCLE;
    var s = 1;
    if (p < 0.12) s = 1 + 0.06 * Math.sin((p / 0.12) * Math.PI);
    else if (p < 0.22) s = 1 + 0.035 * Math.sin(((p - 0.12) / 0.1) * Math.PI);
    return s;
  }

  function spawnBolt() {
    var edge = Math.floor(Math.random() * 4);
    var x1, y1, x2, y2;
    var cx = W * 0.5 + (Math.random() - 0.5) * W * 0.3;
    var cy = H * 0.38 + (Math.random() - 0.5) * H * 0.2;
    if (edge === 0) {
      x1 = Math.random() * W;
      y1 = 0;
    } else if (edge === 1) {
      x1 = W;
      y1 = Math.random() * H;
    } else if (edge === 2) {
      x1 = Math.random() * W;
      y1 = H;
    } else {
      x1 = 0;
      y1 = Math.random() * H;
    }
    x2 = cx + (Math.random() - 0.5) * 80;
    y2 = cy + (Math.random() - 0.5) * 80;
    var segs = [];
    var px = x1;
    var py = y1;
    for (var i = 0; i < 5; i++) {
      var t = (i + 1) / 5;
      segs.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 40,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 40,
      });
    }
    bolts.push({ segs: [{ x: x1, y: y1 }].concat(segs), life: 1, w: 1.2 + Math.random() * 0.8 });
  }

  function spawnBurst() {
    bursts.push({
      x: W * (0.15 + Math.random() * 0.7),
      y: H * (0.15 + Math.random() * 0.55),
      r: 0,
      rMax: 35 + Math.random() * 120,
      life: 1,
      hue: Math.random() > 0.5 ? 172 : 248,
    });
  }

  function draw(now) {
    var pulse = heartPulseScale(now);
    var time = (now - t0) / 1000;

    ctx.clearRect(0, 0, W, H);

    var step = W < 640 ? 26 : 16;
    var half = step * 0.5;

    for (var y = half; y < H; y += step) {
      for (var x = half; x < W; x += step) {
        var nx = x / W;
        var ny = y / H;
        var wave =
          Math.sin(time * 2.2 + nx * 14 + ny * 11) * 2.8 +
          Math.cos(time * 1.6 - nx * 9 + ny * 17) * 2.2;
        var em =
          Math.sin(time * 5 + nx * 40) * Math.cos(time * 4.3 + ny * 35) * 0.4;
        var dx = (wave + em) * pulse;
        var dy = Math.cos(time * 1.9 + nx * 20) * 2.5 * pulse;
        var a = 0.04 + 0.06 * (0.5 + 0.5 * Math.sin(time * 3 + nx * 30 + ny * 30));
        ctx.fillStyle = "rgba(45,212,191," + a + ")";
        ctx.fillRect(x + dx - 0.6, y + dy - 0.6, 1.4, 1.4);
        ctx.fillStyle = "rgba(147,197,253," + (a * 0.35) + ")";
        ctx.fillRect(x + dx * 0.7 + 1, y + dy * 0.7, 0.7, 0.7);
      }
    }

    var cx = W * 0.5;
    var cy = H * 0.42;
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.45);
    grd.addColorStop(0, "rgba(5,5,12," + (0.15 * pulse) + ")");
    grd.addColorStop(0.35, "rgba(45,212,191," + (0.04 * pulse) + ")");
    grd.addColorStop(0.55, "rgba(99,102,241," + (0.03 * pulse) + ")");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    for (var b = bursts.length - 1; b >= 0; b--) {
      var B = bursts[b];
      B.r += (B.rMax - B.r) * 0.09;
      B.life -= 0.018;
      if (B.life <= 0) {
        bursts.splice(b, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(B.x, B.y, B.r, 0, Math.PI * 2);
      ctx.strokeStyle =
        "hsla(" + B.hue + ",85%,72%," + (0.45 * B.life * B.life) + ")";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (var k = bolts.length - 1; k >= 0; k--) {
      var bolt = bolts[k];
      bolt.life -= 0.035;
      if (bolt.life <= 0) {
        bolts.splice(k, 1);
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(bolt.segs[0].x, bolt.segs[0].y);
      for (var s = 1; s < bolt.segs.length; s++) {
        ctx.lineTo(bolt.segs[s].x, bolt.segs[s].y);
      }
      ctx.strokeStyle = "rgba(186,230,253," + (0.55 * bolt.life) + ")";
      ctx.shadowColor = "rgba(45,212,191,0.9)";
      ctx.shadowBlur = 12 * bolt.life;
      ctx.lineWidth = bolt.w * bolt.life;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (Math.random() < 0.022) spawnBolt();
    if (Math.random() < 0.009) spawnBurst();

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  document.body.classList.add("hero-singularity-ready");
  requestAnimationFrame(draw);
})();
