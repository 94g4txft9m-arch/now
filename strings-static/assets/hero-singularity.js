/**
 * Homepage cinematic layer: blue code-rain with emergent STRINGS title.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.getElementById("hero-sim-canvas");
  if (!canvas) return;
  var hero = canvas.closest(".hero");
  if (!hero) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var dpr = 1;
  var W = 0;
  var H = 0;
  var t0 = performance.now();
  var codeChars = "01{}[]()<>/\\\\.;:=+-_*$#";
  var streams = [];
  var particles = [];
  var textTargets = [];
  var textPulse = 0;
  var targetCanvas = document.createElement("canvas");
  var targetCtx = targetCanvas.getContext("2d");
  var count = window.innerWidth < 768 ? 460 : 900;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    targetCanvas.width = W;
    targetCanvas.height = H;
    buildTextTargets();
    initStreams();
    initParticles();
  }

  function buildTextTargets() {
    textTargets = [];
    targetCtx.clearRect(0, 0, W, H);
    targetCtx.fillStyle = "#0b1220";
    targetCtx.fillRect(0, 0, W, H);
    targetCtx.font = "900 " + Math.floor(Math.min(170, Math.max(62, W * 0.12))) + "px Cabinet Grotesk, Arial Black, sans-serif";
    targetCtx.textAlign = "center";
    targetCtx.textBaseline = "middle";
    targetCtx.fillStyle = "#dff7ff";
    targetCtx.fillText("STRINGS", W * 0.5, H * 0.48);
    var img = targetCtx.getImageData(0, 0, W, H).data;
    var step = W < 768 ? 6 : 4;
    for (var y = 0; y < H; y += step) {
      for (var x = 0; x < W; x += step) {
        var a = img[(y * W + x) * 4 + 3];
        if (a > 24) textTargets.push({ x: x, y: y });
      }
    }
    if (!textTargets.length) textTargets.push({ x: W * 0.5, y: H * 0.5 });
  }

  function initStreams() {
    streams = [];
    var streamCount = Math.floor(W / (W < 768 ? 14 : 11));
    for (var i = 0; i < streamCount; i += 1) {
      streams.push({
        x: (i / Math.max(1, streamCount - 1)) * W,
        y: rand(-H, H),
        speed: rand(0.9, 2.8),
        len: rand(40, 160),
        alpha: rand(0.08, 0.36)
      });
    }
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < count; i += 1) {
      var t = textTargets[i % textTargets.length];
      particles.push({
        x: rand(0, W),
        y: rand(0, H),
        vx: 0,
        vy: 0,
        tx: t.x,
        ty: t.y,
        phase: rand(0, Math.PI * 2),
        glow: rand(0.4, 1.3),
        trail: rand(8, 42)
      });
    }
  }

  function updateTargets(time) {
    var drift = Math.sin(time * 0.7) * 8;
    textPulse = 1 + Math.sin(time * 1.4) * 0.028;
    for (var i = 0; i < particles.length; i += 1) {
      var p = particles[i];
      var t = textTargets[i % textTargets.length];
      p.tx = W * 0.5 + (t.x - W * 0.5) * textPulse;
      p.ty = H * 0.48 + (t.y - H * 0.48) * textPulse + Math.sin(time * 1.2 + p.phase) * 2 + drift * 0.08;
    }
  }

  function drawStreams(time) {
    for (var i = 0; i < streams.length; i += 1) {
      var s = streams[i];
      s.y += s.speed;
      if (s.y - s.len > H + 20) {
        s.y = -rand(20, H * 0.5);
      }
      var g = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
      g.addColorStop(0, "rgba(56, 189, 248, 0)");
      g.addColorStop(0.65, "rgba(56, 189, 248," + (s.alpha * 0.85) + ")");
      g.addColorStop(1, "rgba(186, 230, 253," + s.alpha + ")");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.len);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      if (Math.random() < 0.6) {
        ctx.fillStyle = "rgba(191, 219, 254," + (s.alpha + 0.08) + ")";
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
        ctx.fillText(codeChars[(Math.random() * codeChars.length) | 0], s.x - 3, s.y + 2 + Math.sin(time + s.x) * 2);
      }
    }
  }

  function drawParticles(time) {
    var stiffness = 0.018;
    var damping = 0.89;
    for (var i = 0; i < particles.length; i += 1) {
      var p = particles[i];
      p.vx = (p.vx + (p.tx - p.x) * stiffness) * damping;
      p.vy = (p.vy + (p.ty - p.y) * stiffness) * damping;
      p.x += p.vx + Math.sin(time * 1.3 + p.phase) * 0.24;
      p.y += p.vy + Math.cos(time * 1.1 + p.phase * 1.7) * 0.24;

      ctx.strokeStyle = "rgba(56, 189, 248," + (0.08 + p.glow * 0.07) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.trail);
      ctx.lineTo(p.x, p.y + 1);
      ctx.stroke();

      var r = 0.8 + p.glow * 1.35;
      var radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4.8);
      radial.addColorStop(0, "rgba(220, 245, 255,0.95)");
      radial.addColorStop(0.22, "rgba(125, 211, 252,0.85)");
      radial.addColorStop(1, "rgba(56, 189, 248,0)");
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(now) {
    var time = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    var base = ctx.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, "rgba(4, 14, 32, 0.34)");
    base.addColorStop(1, "rgba(2, 8, 24, 0.52)");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);
    drawStreams(time);
    updateTargets(time);
    drawParticles(time);
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
})();
