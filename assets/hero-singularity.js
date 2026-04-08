import * as THREE from "https://unpkg.com/three@0.163.0/build/three.module.js";
import { EffectComposer } from "https://unpkg.com/three@0.163.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://unpkg.com/three@0.163.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://unpkg.com/three@0.163.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "https://unpkg.com/three@0.163.0/examples/jsm/postprocessing/AfterimagePass.js";
import { BokehPass } from "https://unpkg.com/three@0.163.0/examples/jsm/postprocessing/BokehPass.js";
import { gsap } from "https://esm.sh/gsap@3.12.5";

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const canvas = document.getElementById("hero-sim-canvas");
  const hero = canvas ? canvas.closest(".hero") : null;
  if (!canvas || !hero) {
    // Not on the homepage hero template.
  } else {
    const SHAPES = ["sphere", "torus", "helix", "cube", "wave"];
    const QUALITY_COUNTS = { mobile: 9000, high: 18000, ultra: 32000 };
    const QUALITY_ORDER = ["mobile", "high", "ultra"];
    const QUALITY_STORAGE_KEY = "strings.hero.quality";
    const CYCLE_SECONDS = 8;
    const HEART_BPM = 72;
    const HEART_SECONDS = 60 / HEART_BPM;
    const savedQuality = (() => {
      try {
        return localStorage.getItem(QUALITY_STORAGE_KEY);
      } catch (_err) {
        return null;
      }
    })();
    const initialQuality =
      savedQuality && QUALITY_COUNTS[savedQuality]
        ? savedQuality
        : (window.innerWidth < 640 ? "mobile" : "high");

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x0a0f2e, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0f2e, 150, 430);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 1000);
    camera.position.set(0, 0, 160);

    const ambient = new THREE.AmbientLight(0x96b8ff, 0.35);
    scene.add(ambient);
    const key = new THREE.PointLight(0x84d6ff, 2, 420, 2);
    key.position.set(30, 20, 70);
    scene.add(key);
    const rim = new THREE.PointLight(0x7d84ff, 1.5, 380, 2);
    rim.position.set(-36, -18, 60);
    scene.add(rim);

    const uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uPulse: { value: 1.0 }
    };

    const geometry = new THREE.BufferGeometry();
    let particleCount = QUALITY_COUNTS[initialQuality];

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      attribute vec3 aFrom;
      attribute vec3 aTo;
      attribute float aRand;
      uniform float uTime;
      uniform float uMorph;
      uniform vec3 uPointer;
      uniform float uPulse;
      varying float vDepth;
      varying float vAlpha;
      float hash(float n) { return fract(sin(n) * 43758.5453); }
      float noise3(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        return mix(mix(mix(hash(n+0.0), hash(n+1.0), f.x), mix(hash(n+57.0), hash(n+58.0), f.x), f.y),
                   mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+170.0), hash(n+171.0), f.x), f.y), f.z);
      }
      void main() {
        vec3 base = mix(aFrom, aTo, smoothstep(0.0, 1.0, uMorph));
        float n = noise3(base * 0.07 + vec3(uTime * 0.2 + aRand));
        vec3 jitter = vec3(
          sin(uTime * 1.7 + aRand * 2.0 + n * 2.0),
          cos(uTime * 1.3 + aRand * 3.0 + n * 1.8),
          sin(uTime * 1.9 + aRand * 4.0 + n * 2.2)
        ) * 1.25;
        vec3 p = base + jitter;
        vec3 d = p - uPointer;
        float repulsion = smoothstep(26.0, 0.0, length(d));
        p += normalize(d + 0.0001) * repulsion * 7.5;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float depthN = clamp((180.0 - abs(mv.z)) / 180.0, 0.0, 1.0);
        vDepth = depthN;
        vAlpha = mix(0.2, 1.0, depthN);
        gl_PointSize = mix(1.0, 4.8, depthN) * (300.0 / -mv.z) * mix(1.2, 1.8, uPulse - 1.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying float vDepth;
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float ring = smoothstep(0.5, 0.0, d);
        vec3 nearColor = vec3(1.0, 1.0, 1.0);
        vec3 farColor = vec3(0.36, 0.44, 0.62);
        vec3 color = mix(farColor, nearColor, vDepth);
        gl_FragColor = vec4(color * (0.5 + ring), vAlpha * ring);
      }
    `
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const lineGeometry = new THREE.BufferGeometry();
  const maxLinePairs = 340;
  const linePositions = new Float32Array(maxLinePairs * 6);
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setDrawRange(0, 0);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x8dd6ff,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  const lightningGeometry = new THREE.BufferGeometry();
  const lightningPositions = new Float32Array(96 * 6);
  lightningGeometry.setAttribute("position", new THREE.BufferAttribute(lightningPositions, 3));
  lightningGeometry.setDrawRange(0, 0);
  const lightningMaterial = new THREE.LineBasicMaterial({
    color: 0xd9f4ff,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const lightning = new THREE.LineSegments(lightningGeometry, lightningMaterial);
  scene.add(lightning);

  const raysGeo = new THREE.ConeGeometry(95, 180, 48, 1, true);
  const raysMat = new THREE.MeshBasicMaterial({
    color: 0x6fb8ff,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const raysMesh = new THREE.Mesh(raysGeo, raysMat);
  raysMesh.position.set(0, -10, -30);
  raysMesh.rotation.x = Math.PI;
  scene.add(raysMesh);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 1.05, 0.6, 0.15);
  composer.addPass(bloom);
  const dofPass = new BokehPass(scene, camera, { focus: 120.0, aperture: 0.00018, maxblur: 0.01 });
  composer.addPass(dofPass);
  const trail = new AfterimagePass(0.86);
  composer.addPass(trail);

  const tempV3 = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(0, 0);
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  const shapeBuffers = {
    sphere: null,
    torus: null,
    helix: null,
    cube: null,
    wave: null,
    text: null
  };

  const state = {
    cycle: 0,
    shapeIndex: 0,
    morphing: false,
    paused: false,
    textMode: false,
    emLife: 0,
    audioBoost: 0,
      mood: "focus",
      moodEnergy: 0.56,
      nextMoodAt: 8,
    fpsWindow: 0,
    fpsTimer: 0,
    quality: initialQuality,
    autoDowngraded: false,
    lastTime: performance.now()
  };

  function rebuildParticleSystem(qualityName) {
    particleCount = QUALITY_COUNTS[qualityName];
    const positions = new Float32Array(particleCount * 3);
    const fromPositions = new Float32Array(particleCount * 3);
    const toPositions = new Float32Array(particleCount * 3);
    const randomness = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 220;
      positions[i3 + 1] = (Math.random() - 0.5) * 120;
      positions[i3 + 2] = (Math.random() - 0.5) * 140;
      fromPositions[i3 + 0] = positions[i3 + 0];
      fromPositions[i3 + 1] = positions[i3 + 1];
      fromPositions[i3 + 2] = positions[i3 + 2];
      toPositions[i3 + 0] = positions[i3 + 0];
      toPositions[i3 + 1] = positions[i3 + 1];
      toPositions[i3 + 2] = positions[i3 + 2];
      randomness[i] = Math.random() * 100.0;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aFrom", new THREE.BufferAttribute(fromPositions, 3));
    geometry.setAttribute("aTo", new THREE.BufferAttribute(toPositions, 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(randomness, 1));
    shapeBuffers.sphere = makeSphere(particleCount, 48);
    shapeBuffers.torus = makeTorus(particleCount, 48, 18);
    shapeBuffers.helix = makeHelix(particleCount, 16, 78);
    shapeBuffers.cube = makeCube(particleCount, 50);
    shapeBuffers.wave = makeWave(particleCount, 120, 86);
    shapeBuffers.text = makeText("STRINGS", particleCount);
    setShape("sphere", true);
    state.quality = qualityName;
    try {
      localStorage.setItem(QUALITY_STORAGE_KEY, qualityName);
    } catch (_err) {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
  }

  function setShape(shapeName, force) {
    const target = shapeBuffers[shapeName];
    if (!target) return;
    const pos = geometry.attributes.position.array;
    const from = geometry.attributes.aFrom.array;
    const to = geometry.attributes.aTo.array;
    for (let i = 0; i < pos.length; i += 1) {
      from[i] = pos[i];
      to[i] = target[i];
    }
    geometry.attributes.aFrom.needsUpdate = true;
    geometry.attributes.aTo.needsUpdate = true;
    uniforms.uMorph.value = 0;
    state.morphing = true;

    gsap.to(uniforms.uMorph, {
      value: 1,
      duration: force ? 1.4 : 2.4,
      ease: "power3.inOut",
      onComplete: () => { state.morphing = false; }
    });
  }

  function makeVignette() {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      transparent: true,
      uniforms: { uStrength: { value: 0.33 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uStrength;
        void main() {
          float d = distance(vUv, vec2(0.5));
          float vig = smoothstep(0.38, 0.9, d) * uStrength;
          gl_FragColor = vec4(0.02, 0.03, 0.08, vig);
        }
      `
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    const vignetteScene = new THREE.Scene();
    const vignetteCam = new THREE.Camera();
    vignetteScene.add(mesh);
    return { vignetteScene, vignetteCam };
  }
  const vignette = makeVignette();

  function onResize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function makeSphere(count, radius) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.45 + Math.random() * 0.55);
      const i3 = i * 3;
      arr[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }

  function makeTorus(count, r1, r2) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const b = Math.random() * Math.PI * 2;
      const i3 = i * 3;
      arr[i3 + 0] = (r1 + r2 * Math.cos(b)) * Math.cos(a);
      arr[i3 + 1] = (r1 + r2 * Math.cos(b)) * Math.sin(a);
      arr[i3 + 2] = r2 * Math.sin(b);
    }
    return arr;
  }

  function makeHelix(count, radius, height) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const angle = t * Math.PI * 18;
      const i3 = i * 3;
      arr[i3 + 0] = Math.cos(angle) * (radius + Math.sin(t * 60) * 3);
      arr[i3 + 1] = (t - 0.5) * height;
      arr[i3 + 2] = Math.sin(angle) * (radius + Math.cos(t * 60) * 3);
    }
    return arr;
  }

  function makeCube(count, side) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const face = Math.floor(Math.random() * 6);
      const x = (Math.random() - 0.5) * side;
      const y = (Math.random() - 0.5) * side;
      const z = (Math.random() - 0.5) * side;
      const i3 = i * 3;
      if (face === 0) { arr[i3] = side * 0.5; arr[i3 + 1] = y; arr[i3 + 2] = z; }
      if (face === 1) { arr[i3] = -side * 0.5; arr[i3 + 1] = y; arr[i3 + 2] = z; }
      if (face === 2) { arr[i3] = x; arr[i3 + 1] = side * 0.5; arr[i3 + 2] = z; }
      if (face === 3) { arr[i3] = x; arr[i3 + 1] = -side * 0.5; arr[i3 + 2] = z; }
      if (face === 4) { arr[i3] = x; arr[i3 + 1] = y; arr[i3 + 2] = side * 0.5; }
      if (face === 5) { arr[i3] = x; arr[i3 + 1] = y; arr[i3 + 2] = -side * 0.5; }
    }
    return arr;
  }

  function makeWave(count, width, depth) {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const u = Math.random() - 0.5;
      const v = Math.random() - 0.5;
      const x = u * width;
      const z = v * depth;
      const y = Math.sin(u * 12) * 14 + Math.cos(v * 10) * 10;
      const i3 = i * 3;
      arr[i3 + 0] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = z;
    }
    return arr;
  }

  function makeText(text, count) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 320;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#fff";
    ctx.font = "900 190px Cabinet Grotesk, Arial Black, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, c.width * 0.5, c.height * 0.52);
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    const samples = [];
    for (let y = 0; y < c.height; y += 4) {
      for (let x = 0; x < c.width; x += 4) {
        const alpha = data[(y * c.width + x) * 4 + 3];
        if (alpha > 20) {
          const baseX = (x - c.width * 0.5) * 0.14;
          const baseY = (c.height * 0.5 - y) * 0.14;
          const layers = [-4, 0, 4];
          for (let l = 0; l < layers.length; l += 1) {
            samples.push(baseX, baseY, layers[l] + (Math.random() - 0.5) * 1.5);
          }
        }
      }
    }
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const sampleLen = Math.max(1, samples.length / 3);
      const s3 = (i % sampleLen) * 3;
      arr[i3 + 0] = samples[s3 + 0];
      arr[i3 + 1] = samples[s3 + 1];
      arr[i3 + 2] = samples[s3 + 2];
    }
    return arr;
  }

  function updateLines() {
    const pos = geometry.attributes.position.array;
    const step = Math.max(1, Math.floor(particleCount / 240));
    let ptr = 0;
    for (let i = 0; i < particleCount - step && ptr < linePositions.length; i += step) {
      const i3 = i * 3;
      const j = i + step;
      const j3 = j * 3;
      const dx = pos[i3] - pos[j3];
      const dy = pos[i3 + 1] - pos[j3 + 1];
      const dz = pos[i3 + 2] - pos[j3 + 2];
      if (dx * dx + dy * dy + dz * dz < 170) {
        linePositions[ptr++] = pos[i3];
        linePositions[ptr++] = pos[i3 + 1];
        linePositions[ptr++] = pos[i3 + 2];
        linePositions[ptr++] = pos[j3];
        linePositions[ptr++] = pos[j3 + 1];
        linePositions[ptr++] = pos[j3 + 2];
      }
    }
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, ptr / 3);
  }

  function heartbeatScale(t) {
    const p = (t % HEART_SECONDS) / HEART_SECONDS;
    if (p < 0.12) return 1.2 + Math.sin((p / 0.12) * Math.PI) * 0.6;
    if (p < 0.24) return 1.15 + Math.sin(((p - 0.12) / 0.12) * Math.PI) * 0.4;
    return 1.2;
  }

  function nextCycle() {
    state.cycle += 1;
    const textCycle = state.cycle % 4 === 0;
    state.textMode = textCycle;
    const shapeName = textCycle ? "text" : SHAPES[state.shapeIndex % SHAPES.length];
    setShape(shapeName, false);
    if (!textCycle) state.shapeIndex += 1;
    pulseLightning(textCycle);
  }

  function pulseLightning(textCycle) {
    key.intensity = textCycle ? 3.6 : 2.4;
    rim.intensity = textCycle ? 3 : 1.8;
    state.emLife = textCycle ? 1.1 : 0.65;
    makeLightningBurst(textCycle ? 74 : 32);
    gsap.to(bloom, { strength: textCycle ? 1.6 : 1.2, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out" });
    setTimeout(() => { key.intensity = textCycle ? 2.4 : 1.8; }, 220);
  }

  function makeLightningBurst(segments) {
    let ptr = 0;
    for (let i = 0; i < segments && ptr + 6 <= lightningPositions.length; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const len = 25 + Math.random() * 55;
      const sx = (Math.random() - 0.5) * 30;
      const sy = (Math.random() - 0.5) * 24;
      const sz = (Math.random() - 0.5) * 32;
      const ex = sx + Math.cos(a) * len;
      const ey = sy + Math.sin(a) * len * 0.4;
      const ez = sz + (Math.random() - 0.5) * 30;
      lightningPositions[ptr++] = sx;
      lightningPositions[ptr++] = sy;
      lightningPositions[ptr++] = sz;
      lightningPositions[ptr++] = ex;
      lightningPositions[ptr++] = ey;
      lightningPositions[ptr++] = ez;
    }
    lightningGeometry.attributes.position.needsUpdate = true;
    lightningGeometry.setDrawRange(0, ptr / 3);
    lightningMaterial.opacity = 0.82;
  }

  function resolveAudioLevel() {
    const analyser = window.__STRINGS_AUDIO_ANALYSER__;
    if (!analyser || typeof analyser.getByteFrequencyData !== "function") return 0;
    const bins = analyser.frequencyBinCount || 0;
    if (!bins) return 0;
    const data = new Uint8Array(bins);
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i += 1) sum += data[i];
    return (sum / (data.length * 255)) * 0.45;
  }

  function resolveAiMood(nowSeconds) {
    const external = window.__STRINGS_AI_MOOD__;
    if (!external) return null;
    try {
      const payload = typeof external === "function" ? external(nowSeconds) : external;
      if (!payload || typeof payload !== "object") return null;
      const mood = payload.mood;
      const energy = Number(payload.energy);
      if (!["calm", "focus", "surge"].includes(mood)) return null;
      return { mood, energy: Number.isFinite(energy) ? THREE.MathUtils.clamp(energy, 0, 1) : null };
    } catch (_err) {
      return null;
    }
  }

  function stepAutonomousMood(nowSeconds) {
    const ai = resolveAiMood(nowSeconds);
    if (ai) {
      state.mood = ai.mood;
      if (ai.energy !== null) state.moodEnergy = ai.energy;
      return;
    }
    if (nowSeconds < state.nextMoodAt) return;
    const r = Math.random();
    if (r < 0.28) state.mood = "calm";
    else if (r < 0.75) state.mood = "focus";
    else state.mood = "surge";
    state.moodEnergy = THREE.MathUtils.clamp(
      state.mood === "calm" ? 0.3 + Math.random() * 0.2 : state.mood === "focus" ? 0.45 + Math.random() * 0.2 : 0.72 + Math.random() * 0.22,
      0,
      1
    );
    state.nextMoodAt = nowSeconds + 6 + Math.random() * 10;
  }

  function downgradeQuality() {
    const idx = QUALITY_ORDER.indexOf(state.quality);
    if (idx <= 0) return;
    const nextQuality = QUALITY_ORDER[idx - 1];
    rebuildParticleSystem(nextQuality);
    state.autoDowngraded = true;
  }

  function animate(t) {
    const now = t * 0.001;
    const dt = Math.min(0.04, (t - state.lastTime) / 1000);
    state.lastTime = t;
      state.fpsTimer += dt;
      state.fpsWindow += 1;
    if (!state.paused) {
      uniforms.uTime.value = now;
      stepAutonomousMood(now);
      state.audioBoost = resolveAudioLevel();
      const moodPulse = 1 + state.moodEnergy * 0.15;
      uniforms.uPulse.value = Math.min(1.8, heartbeatScale(now) * moodPulse + state.audioBoost);
      points.rotation.y += dt * (0.06 + state.moodEnergy * 0.14);
      points.rotation.x = Math.sin(now * 0.2) * 0.05;
      const pos = geometry.attributes.position.array;
      const from = geometry.attributes.aFrom.array;
      const to = geometry.attributes.aTo.array;
      const morph = uniforms.uMorph.value;
      for (let i = 0; i < pos.length; i += 1) pos[i] = from[i] + (to[i] - from[i]) * morph;
      geometry.attributes.position.needsUpdate = true;
      updateLines();
      state.emLife = Math.max(0, state.emLife - dt * 1.1);
      lightningMaterial.opacity = state.emLife * 0.9;
      raysMesh.rotation.z += dt * (0.04 + state.moodEnergy * 0.18);
      raysMat.opacity = state.textMode ? 0.1 + state.moodEnergy * 0.08 + Math.sin(now * 3.5) * 0.02 : 0.04 + state.moodEnergy * 0.04;
      key.position.x = 30 + Math.sin(now * 1.8) * 6;
      rim.position.y = -18 + Math.cos(now * 1.4) * 5;
      composer.render();
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(vignette.vignetteScene, vignette.vignetteCam);
      renderer.autoClear = true;

      if (state.fpsTimer >= 2.5) {
        const fps = state.fpsWindow / state.fpsTimer;
        if (fps < 28) downgradeQuality();
        state.fpsTimer = 0;
        state.fpsWindow = 0;
      }
    }
    requestAnimationFrame(animate);
  }

  function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(planeZ, tempV3);
    uniforms.uPointer.value.copy(tempV3);
  }

  const ctaBtn = hero.querySelector(".cta .btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("mouseenter", () => { state.paused = true; });
    ctaBtn.addEventListener("mouseleave", () => { state.paused = false; });
    ctaBtn.addEventListener("focus", () => { state.paused = true; });
    ctaBtn.addEventListener("blur", () => { state.paused = false; });
  }

  canvas.addEventListener("pointermove", (e) => updatePointer(e.clientX, e.clientY));
  canvas.addEventListener("pointerdown", (e) => updatePointer(e.clientX, e.clientY));
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", () => { state.paused = document.hidden; });

  onResize();
  rebuildParticleSystem(initialQuality);
  gsap.to(points.rotation, { y: Math.PI * 2, duration: 56, ease: "none", repeat: -1 });
  (function scheduleCycle() {
    nextCycle();
    const moodFactor = state.mood === "calm" ? 1.35 : state.mood === "surge" ? 0.78 : 1;
    const jitter = 0.82 + Math.random() * 0.35;
    const waitMs = CYCLE_SECONDS * 1000 * moodFactor * jitter;
    setTimeout(scheduleCycle, waitMs);
  })();
  requestAnimationFrame(animate);
  }
}
