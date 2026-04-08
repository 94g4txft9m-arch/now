(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var body = document.body;
  if (!body) return;

  var canvas = document.getElementById("swarm-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "swarm-canvas";
    body.insertBefore(canvas, body.firstChild);
  }

  var controls = document.getElementById("shape-controls");

  var ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  var dpr = 1;
  var W = 0;
  var H = 0;
  var CX = 0;
  var CY = 0;
  var FOV = 600;

  var mouseX = -10000;
  var mouseY = -10000;
  var isMobile = window.innerWidth < 768;
  var count = isMobile ? 350 : 800;

  var x = new Float32Array(count);
  var y = new Float32Array(count);
  var z = new Float32Array(count);
  var vx = new Float32Array(count);
  var vy = new Float32Array(count);
  var vz = new Float32Array(count);
  var tx = new Float32Array(count);
  var ty = new Float32Array(count);
  var tz = new Float32Array(count);
  var phase = new Float32Array(count);
  var amp = new Float32Array(count);

  var sx = new Float32Array(count);
  var sy = new Float32Array(count);
  var depth = new Float32Array(count);

  var indices = new Uint16Array(count);
  for (var ii = 0; ii < count; ii += 1) indices[ii] = ii;

  var shapeIndex = 0;
  var currentShapeScale = 1;
  var pulseActive = false;
  var pulseStart = 0;
  var pulseDuration = 2000;

  var rotY = 0;
  var rotYCurrent = 0.002;
  var rotYTarget = 0.002;
  var jitterMulCurrent = 1.0;
  var jitterMulTarget = 1.0;
  var lineMulCurrent = 1.0;
  var lineMulTarget = 1.0;
  var moodTransitionStart = performance.now();
  var nextMoodAt = performance.now() + rand(30000, 60000);

  var nextShapeAt = performance.now() + rand(6000, 12000);
  var nextPulseAt = performance.now() + rand(15000, 25000);

  var stiffness = 0.018;
  var damping = 0.88;
  var scale3d = 220;

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function setupCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    CX = W * 0.5;
    CY = H * 0.5;
    scale3d = Math.min(280, Math.min(W, H) * 0.28);

    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    for (var i = 0; i < count; i += 1) {
      x[i] = (Math.random() * 2 - 1) * 0.6;
      y[i] = (Math.random() * 2 - 1) * 0.6;
      z[i] = (Math.random() * 2 - 1) * 0.6;
      vx[i] = 0;
      vy[i] = 0;
      vz[i] = 0;
      phase[i] = Math.random() * Math.PI * 2;
      amp[i] = rand(0.5, 2.0);
    }
    generateShapeTargets(0);
  }

  function generateShapeTargets(idx) {
    if (idx === 0) return generateSphere();
    if (idx === 1) return generateTorus();
    if (idx === 2) return generateHelix();
    if (idx === 3) return generateCube();
    return generateWave();
  }

  function generateSphere() {
    var ga = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < count; i += 1) {
      var yy = 1 - (i / (count - 1)) * 2;
      var radius = Math.sqrt(1 - yy * yy);
      var theta = ga * i;
      tx[i] = Math.cos(theta) * radius;
      ty[i] = yy;
      tz[i] = Math.sin(theta) * radius;
    }
  }

  function generateTorus() {
    var R = 0.7;
    var r = 0.3;
    var grid = Math.max(12, Math.floor(Math.sqrt(count)));
    for (var i = 0; i < count; i += 1) {
      var u = ((i % grid) / grid) * Math.PI * 2;
      var v = ((Math.floor(i / grid) % grid) / grid) * Math.PI * 2;
      var cv = Math.cos(v);
      tx[i] = (R + r * cv) * Math.cos(u);
      ty[i] = r * Math.sin(v);
      tz[i] = (R + r * cv) * Math.sin(u);
    }
  }

  function generateHelix() {
    var turns = 3;
    for (var i = 0; i < count; i += 1) {
      var t = i / (count - 1);
      var a = t * Math.PI * 2 * turns;
      tx[i] = Math.cos(a) * 0.6;
      ty[i] = t * 2 - 1;
      tz[i] = Math.sin(a) * 0.6;
    }
  }

  function generateCube() {
    var s = 0.7;
    for (var i = 0; i < count; i += 1) {
      var face = i % 6;
      var u = Math.random() * 2 - 1;
      var v = Math.random() * 2 - 1;
      if (face === 0) { tx[i] = s; ty[i] = u * s; tz[i] = v * s; }
      else if (face === 1) { tx[i] = -s; ty[i] = u * s; tz[i] = v * s; }
      else if (face === 2) { tx[i] = u * s; ty[i] = s; tz[i] = v * s; }
      else if (face === 3) { tx[i] = u * s; ty[i] = -s; tz[i] = v * s; }
      else if (face === 4) { tx[i] = u * s; ty[i] = v * s; tz[i] = s; }
      else { tx[i] = u * s; ty[i] = v * s; tz[i] = -s; }
    }
  }

  function generateWave() {
    var side = Math.max(2, Math.floor(Math.sqrt(count)));
    for (var i = 0; i < count; i += 1) {
      var gx = i % side;
      var gz = Math.floor(i / side);
      var nx = side > 1 ? gx / (side - 1) : 0.5;
      var nz = side > 1 ? gz / (side - 1) : 0.5;
      var px = nx * 2 - 1;
      var pz = nz * 2 - 1;
      tx[i] = px;
      tz[i] = pz;
      ty[i] = 0.3 * Math.sin(px * 3) * Math.cos(pz * 3);
    }
  }

  function updateMood(now) {
    if (now >= nextMoodAt) {
      rotYTarget = rand(0.001, 0.004);
      jitterMulTarget = rand(0.5, 1.5);
      lineMulTarget = rand(0.5, 1.2);
      moodTransitionStart = now;
      nextMoodAt = now + rand(30000, 60000);
    }
    var mt = Math.min(1, (now - moodTransitionStart) / 3000);
    rotYCurrent = lerp(rotYCurrent, rotYTarget, mt * 0.08);
    jitterMulCurrent = lerp(jitterMulCurrent, jitterMulTarget, mt * 0.08);
    lineMulCurrent = lerp(lineMulCurrent, lineMulTarget, mt * 0.08);
  }

  function updatePulse(now) {
    if (!pulseActive && now >= nextPulseAt) {
      pulseActive = true;
      pulseStart = now;
      nextPulseAt = now + rand(15000, 25000);
    }
    if (pulseActive) {
      var p = (now - pulseStart) / pulseDuration;
      if (p >= 1) {
        pulseActive = false;
        currentShapeScale = 1;
      } else {
        currentShapeScale = 1 + 0.15 * Math.sin(p * Math.PI);
      }
    } else {
      currentShapeScale = 1;
    }
  }

  function updateShape(now) {
    if (now >= nextShapeAt) {
      shapeIndex = (shapeIndex + 1) % 5;
      generateShapeTargets(shapeIndex);
      nextShapeAt = now + rand(6000, 12000);
    }
  }

  function rotatePoint(px, py, pz, rx, ry) {
    var cosy = Math.cos(ry);
    var siny = Math.sin(ry);
    var cosx = Math.cos(rx);
    var sinx = Math.sin(rx);

    var x1 = px * cosy - pz * siny;
    var z1 = px * siny + pz * cosy;
    var y1 = py;

    var y2 = y1 * cosx - z1 * sinx;
    var z2 = y1 * sinx + z1 * cosx;

    return [x1, y2, z2];
  }

  function sortByDepth() {
    indices.sort(function (a, b) {
      return depth[a] - depth[b];
    });
  }

  function draw(now) {
    var t = now * 0.001;
    updateMood(now);
    updatePulse(now);
    updateShape(now);

    rotY += rotYCurrent;
    var rotX = Math.sin(now * 0.0003) * 0.2;

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < count; i += 1) {
      var jitterX = Math.sin(t * 1.3 + phase[i]) * amp[i] * 0.008 * jitterMulCurrent;
      var jitterY = Math.cos(t * 1.1 + phase[i] * 1.7) * amp[i] * 0.008 * jitterMulCurrent;
      var jitterZ = Math.sin(t * 0.9 + phase[i] * 2.3) * amp[i] * 0.008 * jitterMulCurrent;

      var targetX = tx[i] * currentShapeScale + jitterX;
      var targetY = ty[i] * currentShapeScale + jitterY;
      var targetZ = tz[i] * currentShapeScale + jitterZ;

      vx[i] = (vx[i] + (targetX - x[i]) * stiffness) * damping;
      vy[i] = (vy[i] + (targetY - y[i]) * stiffness) * damping;
      vz[i] = (vz[i] + (targetZ - z[i]) * stiffness) * damping;

      x[i] += vx[i];
      y[i] += vy[i];
      z[i] += vz[i];

      var p = rotatePoint(x[i], y[i], z[i], rotX, rotY);
      var depthRaw = p[2] + 2.3;
      var depthSafe = Math.max(0.25, depthRaw);
      depth[i] = depthSafe;
      var proj = FOV / depthSafe;
      sx[i] = CX + p[0] * scale3d * proj;
      sy[i] = CY + p[1] * scale3d * proj;

      var dx = sx[i] - mouseX;
      var dy = sy[i] - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130 && dist > 0.001) {
        var force = (1 - dist / 130) * 0.08;
        x[i] += (dx / dist) * force * 0.04;
        y[i] += (dy / dist) * force * 0.04;
        z[i] += force * 0.01;
      }
    }

    sortByDepth();

    var frontCount = Math.floor(count * 0.4);
    for (var a = 0; a < frontCount; a += 1) {
      var ia = indices[count - 1 - a];
      var ax = sx[ia];
      var ay = sy[ia];
      for (var b = a + 1; b < frontCount; b += 1) {
        var ib = indices[count - 1 - b];
        var manhattan = Math.abs(ax - sx[ib]) + Math.abs(ay - sy[ib]);
        if (manhattan < 55) {
          var alpha = (1 - manhattan / 55) * 0.3 * lineMulCurrent;
          if (pulseActive) {
            ctx.strokeStyle = "rgba(159, 122, 234," + (alpha * 0.45).toFixed(4) + ")";
          } else {
            ctx.strokeStyle = "rgba(99, 179, 237," + alpha.toFixed(4) + ")";
          }
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(sx[ib], sy[ib]);
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < count; k += 1) {
      var id = indices[k];
      var dNorm = Math.max(0, Math.min(1, 1 - (depth[id] - 0.25) / 4));
      var radius = 0.4 + dNorm * 2.6;
      var alphaP = 0.15 + dNorm * 0.8;
      var c = Math.floor(26 + dNorm * 164);
      var g = Math.floor(54 + dNorm * 173);
      var bcol = Math.floor(93 + dNorm * 155);
      ctx.fillStyle = "rgba(" + c + "," + g + "," + bcol + "," + alphaP.toFixed(4) + ")";
      ctx.beginPath();
      ctx.arc(sx[id], sy[id], radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  if (controls) {
    controls.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest("button[data-shape-index]") : null;
      if (!btn) return;
      var idx = Number(btn.getAttribute("data-shape-index"));
      if (!Number.isFinite(idx)) return;
      shapeIndex = Math.max(0, Math.min(4, idx));
      generateShapeTargets(shapeIndex);
    });
  }

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener("resize", setupCanvas);

  setupCanvas();
  initParticles();
  requestAnimationFrame(draw);
})();
