/**
 * Cosmic vortex scene inspired by user's reference.
 */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.getElementById("hero-sim-canvas");
  if (!canvas) return;
  var hero = canvas.closest(".hero");
  if (!hero) return;
  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var W = 0;
  var H = 0;
  var cx = 0;
  var cy = 0;
  var dpr = 1;
  var startTime = performance.now();

  var PURPLE = [80, 35, 121];
  var TEAL = [30, 180, 200];
  var MAGENTA = [180, 40, 120];
  var WHITE = [255, 255, 255];
  var FLARE = [255, 240, 200];
  var BG0 = [26, 0, 48];
  var BG1 = [15, 0, 32];
  var BG2 = [8, 0, 24];
  var BG3 = [2, 0, 8];

  var RING_COUNT = 90;
  var PARTICLE_COUNT = 600;
  var rings = [];
  var particles = [];
  var textPoints = [];
  var textMode = false;
  var nextTextAt = performance.now() + 7000;
  var textModeStart = 0;
  var textModeDuration = 4200;
  var textCanvas = document.createElement("canvas");
  var textCtx = textCanvas.getContext("2d");

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpColor(c1, c2, t) {
    return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
  }
  function rgba(c, a) {
    return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")";
  }
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function Ring(i) {
    this.i = i;
    var t = i / RING_COUNT;
    this.baseRadius = 20 + t * Math.max(W, H) * 0.6;
    this.angle = 0;
    this.speed = 0.0005 + (1 - t) * 0.004;
    this.wobbleAmp = 2 + t * 8;
    this.wobbleFreq = 1.5 + Math.random() * 2;
    this.phase = Math.random() * Math.PI * 2;
    this.thickness = 0.5 + t * 2.2;
    if (t < 0.3) this.color = lerpColor(WHITE, MAGENTA, t / 0.3);
    else if (t < 0.6) this.color = lerpColor(MAGENTA, PURPLE, (t - 0.3) / 0.3);
    else this.color = lerpColor(PURPLE, TEAL, (t - 0.6) / 0.4);
    this.alpha = t < 0.1 ? t / 0.1 : (t > 0.85 ? (1 - t) / 0.15 : 0.6 + 0.4 * Math.sin(t * Math.PI));
    this.eccentricity = 0.15 + Math.random() * 0.25;
    this.tiltAngle = Math.random() * Math.PI * 2;
  }
  Ring.prototype.draw = function (time) {
    var wobble = Math.sin(time * this.wobbleFreq + this.phase) * this.wobbleAmp;
    var r = this.baseRadius + wobble;
    var rx = r;
    var ry = r * (1 - this.eccentricity);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);

    var pulse = 0.7 + 0.3 * Math.sin(time * 0.8 + this.i * 0.1);
    var alpha = this.alpha * pulse;

    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), this.tiltAngle, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(this.color, alpha * 0.7);
    ctx.lineWidth = this.thickness;
    ctx.stroke();

    if (this.i < RING_COUNT * 0.35) {
      ctx.strokeStyle = rgba(this.color, alpha * 0.15);
      ctx.lineWidth = this.thickness + 4;
      ctx.stroke();
    }
    ctx.restore();
    this.angle += this.speed;
  };

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    var angle = Math.random() * Math.PI * 2;
    var dist = 200 + Math.random() * Math.max(W, H) * 0.5;
    this.x = cx + Math.cos(angle) * dist;
    this.y = cy + Math.sin(angle) * dist;
    this.size = 0.3 + Math.random() * 2;
    this.life = 1;
    this.decay = 0.0008 + Math.random() * 0.002;
    this.vx = 0;
    this.vy = 0;
    this.orbitSpeed = (0.001 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1);
    this.inwardSpeed = 0.15 + Math.random() * 0.6;
    var pick = Math.random();
    if (pick < 0.35) this.color = PURPLE;
    else if (pick < 0.6) this.color = TEAL;
    else if (pick < 0.8) this.color = MAGENTA;
    else this.color = WHITE;
  };
  Particle.prototype.update = function () {
    if (textMode && textPoints.length) {
      var target = textPoints[(Math.random() * textPoints.length) | 0];
      this.vx = (this.vx + (target.x - this.x) * 0.018) * 0.9;
      this.vy = (this.vy + (target.y - this.y) * 0.018) * 0.9;
      this.x += this.vx;
      this.y += this.vy;
      this.life = Math.min(1, this.life + 0.002);
      return;
    }
    var dx = this.x - cx;
    var dy = this.y - cy;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;
    var angle = Math.atan2(dy, dx);
    var speedMult = 1 + (300 / (dist + 50));
    var newDist = dist - this.inwardSpeed * speedMult;
    var newAngle = angle + this.orbitSpeed * speedMult * 2;
    this.x = cx + Math.cos(newAngle) * newDist;
    this.y = cy + Math.sin(newAngle) * newDist;
    this.life -= this.decay;
    if (this.life <= 0 || newDist < 5) this.reset();
  };
  Particle.prototype.draw = function () {
    var alpha = this.life * 0.8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = rgba(this.color, alpha);
    ctx.fill();
  };

  function createSystems() {
    rings = [];
    particles = [];
    for (var i = 0; i < RING_COUNT; i += 1) rings.push(new Ring(i));
    for (var j = 0; j < PARTICLE_COUNT; j += 1) particles.push(new Particle());
  }

  function rebuildTextPoints() {
    textPoints = [];
    textCanvas.width = W;
    textCanvas.height = H;
    textCtx.clearRect(0, 0, W, H);
    textCtx.font = "900 " + Math.floor(Math.min(164, Math.max(66, W * 0.16))) + "px Cabinet Grotesk, Arial Black, sans-serif";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = "#ffffff";
    textCtx.fillText("STRINGS", W * 0.5, H * 0.48);
    var img = textCtx.getImageData(0, 0, W, H).data;
    var step = W < 768 ? 7 : 5;
    for (var y = 0; y < H; y += step) {
      for (var x = 0; x < W; x += step) {
        var a = img[(y * W + x) * 4 + 3];
        if (a > 12) textPoints.push({ x: x, y: y });
      }
    }
  }

  function drawBackground() {
    var bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
    bg.addColorStop(0, rgba(BG0, 1));
    bg.addColorStop(0.3, rgba(BG1, 1));
    bg.addColorStop(0.6, rgba(BG2, 1));
    bg.addColorStop(1, rgba(BG3, 1));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  function drawSpiralArms(time) {
    var armCount = 3;
    for (var a = 0; a < armCount; a += 1) {
      var baseAngle = (a / armCount) * Math.PI * 2 + time * 0.15;
      ctx.beginPath();
      for (var s = 0; s < 300; s += 1) {
        var t = s / 300;
        var r = 10 + t * Math.max(W, H) * 0.45;
        var spiralAngle = baseAngle + t * 6;
        var x = cx + Math.cos(spiralAngle) * r;
        var y = cy + Math.sin(spiralAngle) * r * 0.7;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.45);
      grad.addColorStop(0, rgba(WHITE, 0.08));
      grad.addColorStop(0.3, rgba(MAGENTA, 0.04));
      grad.addColorStop(0.6, rgba(PURPLE, 0.03));
      grad.addColorStop(1, rgba(TEAL, 0.01));
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawCenterGlow(time) {
    var pulse = 0.8 + 0.2 * Math.sin(time * 1.2);
    var maxR = 180 * pulse;
    var g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    g1.addColorStop(0, rgba(WHITE, 0.9));
    g1.addColorStop(0.05, "rgba(255,220,255,0.6)");
    g1.addColorStop(0.2, rgba(MAGENTA, 0.25));
    g1.addColorStop(0.5, rgba(PURPLE, 0.08));
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    var flareW = 400 + 100 * Math.sin(time * 0.7);
    var g2 = ctx.createLinearGradient(cx - flareW, cy, cx + flareW, cy);
    g2.addColorStop(0, "rgba(255,255,255,0)");
    g2.addColorStop(0.4, rgba(FLARE, 0.15 * pulse));
    g2.addColorStop(0.5, rgba(WHITE, 0.5 * pulse));
    g2.addColorStop(0.6, rgba(FLARE, 0.15 * pulse));
    g2.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(cx - flareW, cy - 2, flareW * 2, 4);
    ctx.globalAlpha = 0.3;
    ctx.fillRect(cx - flareW, cy - 15, flareW * 2, 30);
    ctx.globalAlpha = 1;
    if (textMode) {
      ctx.font = "900 " + Math.floor(Math.min(152, Math.max(58, W * 0.14))) + "px Cabinet Grotesk, Arial Black, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var reveal = Math.sin(Math.min(1, (time * 1000 - textModeStart) / textModeDuration) * Math.PI);
      ctx.fillStyle = "rgba(239, 213, 255," + (0.16 + reveal * 0.24).toFixed(3) + ")";
      ctx.fillText("STRINGS", cx, cy * 0.96);
    }
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
    cx = W * 0.5;
    cy = H * 0.5;
    rebuildTextPoints();
    createSystems();
  }

  function animate(now) {
    var time = (now - startTime) / 1000;
    if (!textMode && now >= nextTextAt) {
      textMode = true;
      textModeStart = now;
    }
    if (textMode && now - textModeStart >= textModeDuration) {
      textMode = false;
      nextTextAt = now + 9000 + Math.random() * 6000;
      for (var i = 0; i < particles.length; i += 1) {
        var p = particles[i];
        var ang = Math.random() * Math.PI * 2;
        p.vx += Math.cos(ang) * 2.6;
        p.vy += Math.sin(ang) * 2.6;
      }
    }
    ctx.globalCompositeOperation = "source-over";
    drawBackground();
    ctx.globalCompositeOperation = "screen";
    drawSpiralArms(time);
    for (var i = 0; i < rings.length; i += 1) rings[i].draw(time);
    for (var j = 0; j < particles.length; j += 1) {
      particles[j].update();
      particles[j].draw();
    }
    drawCenterGlow(time);
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(animate);
})();
