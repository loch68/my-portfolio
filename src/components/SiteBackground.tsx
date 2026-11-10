import { useEffect, useRef } from 'react';

/**
 * SiteBackground — one persistent WebGL2 black-hole environment behind the
 * entire portfolio.
 *
 * The shader is the Phase 1 adaptation of the Shader Studio "Gargantua
 * Singularity" reference. This component now owns the single app-level canvas
 * instead of a hero-local one:
 *
 * - the canvas is fixed to the viewport and sits behind every section;
 * - a scroll-linked intensity envelope keeps the hero at full strength,
 *   quiets Work / About / Education / Services, then lifts Contact slightly;
 * - the singularity recedes subtly through the shader's own `u_scale`;
 * - one RAF loop drives both animation and intensity easing;
 * - reduced-motion visitors get a static frame that still responds to scroll;
 * - WebGL failure falls back to the CSS gradient on `.site-bg`;
 * - context loss rebuilds every GPU resource on restoration.
 */

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_pointer;
uniform float u_mass;
uniform float u_spin;
uniform float u_lensing;
uniform float u_doppler;
uniform float u_photon_sphere;
uniform float u_speed;
uniform float u_scale;
uniform float u_rotation;
uniform float u_cx;
uniform float u_cy;
uniform float u_exposure;
uniform float u_hue;
uniform float u_saturation;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_disk;
uniform float u_portrait;
uniform float u_mobile_framing;
uniform vec3  u_colorA;
uniform vec3  u_colorB;
uniform vec3  u_colorC;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c) * p; }

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 renderScene(vec2 uv) {
  uv = rot(u_rotation) * uv;
  uv = uv * u_scale + vec2(u_cx, u_cy);
  // Subtle pointer influence; the effect stays centred when idle.
  uv += u_pointer * 0.025;
  float t = u_time * u_speed;

  vec2 p = uv / max(u_mass * 0.9, 0.12);
  vec2 d = vec2(-1.0, 1.0);
  float dDot = dot(5.0 * p - d, 5.0 * p - d);
  float denom = 0.1 + (5.0 * u_lensing) / max(dDot, 0.001);
  vec2 c = p * mat2(1.0, 1.0, d / denom);
  vec2 v = c;

  float rotAng = log(max(length(v), 0.001)) + t * (0.25 * u_spin);
  mat2 R = mat2(cos(rotAng), sin(rotAng), -sin(rotAng), cos(rotAng));
  v = (R * v) * 5.0;

  vec4 acc = vec4(0.0);
  for (float i = 1.0; i < 9.0; i += 1.0) {
    acc += sin(v.xyyx) + 1.0;
    v += 0.7 * sin(v.yx * i + t * u_spin) / i + 0.5;
  }

  vec4 doppler = exp(c.x * vec4(0.6 * u_doppler, -0.4 * u_doppler, -1.0 * u_doppler, 0.0));
  float diskDist = length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0;
  float diskDensity = 0.1 + 0.1 * diskDist * diskDist;
  float shadow = 1.0 + 7.0 * exp(0.3 * c.y - dot(c, c));
  float photonRadius = 0.7 * u_photon_sphere;
  float photonRing = 0.03 + abs(length(p) - photonRadius);

  vec4 o = 1.0 - exp(-doppler / max(acc, vec4(0.01)) / diskDensity / shadow / photonRing * 0.2);

  // u_disk scales only the emissive disk/highlight contribution, so the
  // black-hole silhouette and deep-ocean base survive at low intensities.
  vec3 disk = mix(u_colorB, u_colorA, o.r);
  vec3 col = mix(u_colorC, disk, (o.g * 1.4 + o.r) * u_disk);
  col += u_colorA * o.b * 1.5 * u_disk;
  // Warm-ivory specular highlight (replaces the reference's white-orange).
  col += vec3(1.0, 0.937, 0.769) * pow(clamp(o.r * o.g, 0.0, 1.0), 2.5) * 2.0 * u_disk;
  return col;
}

vec3 gradeColor(vec3 c) {
  c = (c - 0.5) * u_contrast + 0.5;
  c *= u_brightness;
  float maxVal = max(c.r, max(c.g, c.b));
  vec3 norm = maxVal > 1.0 ? c / maxVal : c;
  vec3 h = rgb2hsv(clamp(norm, 0.0, 1.0));
  h.x = fract(h.x + u_hue);
  h.y = clamp(h.y * u_saturation, 0.0, 2.0);
  vec3 res = hsv2rgb(h);
  return maxVal > 1.0 ? res * maxVal : res;
}

vec3 sampleGraded(vec2 uv) {
  return gradeColor(renderScene(uv));
}

vec3 tonemapACES(vec3 x) {
  float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 applyTonemap(vec3 col) {
  return tonemapACES(col * max(u_exposure, 0.01));
}

void main() {
  // The 16:9 safe area is width-fitted on landscape/desktop screens. Portrait
  // phones would then see a very tall UV window and a small singularity, so
  // they use a narrower framing aspect instead. mix() keeps the desktop
  // expression bit-identical when u_portrait is 0.
  float framing = mix(16.0 / 9.0, u_mobile_framing, u_portrait);
  float uvScale = max(1.0 / u_resolution.y, framing / u_resolution.x);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) * uvScale;
  vec3 col = sampleGraded(uv);
  col = applyTonemap(col);
  fragColor = vec4(col, 1.0);
}`;

const UNIFORM_NAMES = [
  'u_time',
  'u_resolution',
  'u_pointer',
  'u_mass',
  'u_spin',
  'u_lensing',
  'u_doppler',
  'u_photon_sphere',
  'u_speed',
  'u_scale',
  'u_rotation',
  'u_cx',
  'u_cy',
  'u_exposure',
  'u_hue',
  'u_saturation',
  'u_brightness',
  'u_contrast',
  'u_disk',
  'u_portrait',
  'u_mobile_framing',
  'u_colorA',
  'u_colorB',
  'u_colorC',
] as const;

type UniformName = (typeof UNIFORM_NAMES)[number];

type SectionTarget = { id: string; intensity: number };
type Anchor = { top: number; intensity: number };

/**
 * Design targets, interpolated by document scroll position. Section tops are
 * cached so scrolling never reads layout.
 */
const SECTION_TARGETS: SectionTarget[] = [
  { id: 'top', intensity: 0.92 },
  { id: 'work', intensity: 0.28 },
  { id: 'about', intensity: 0.18 },
  { id: 'education', intensity: 0.13 },
  { id: 'services', intensity: 0.13 },
  { id: 'contact', intensity: 0.22 },
];

// Visual response curves, all driven by the same 0..1 intensity envelope.
// The disk fades faster than the base atmosphere so lower sections stay
// recognisable without putting bright swirls behind body copy.
const DISK_MIN = 0.06;
const DISK_MAX = 1.0;
const DISK_CURVE = 1.6;
const EXPOSURE_MIN = 0.28;
const EXPOSURE_MAX = 1.0;
const SATURATION_MIN = 0.3;
const SATURATION_MAX = 0.96;
const CONTRAST_MIN = 0.9;
const CONTRAST_MAX = 1.04;
const SCALE_MIN = 1.0;
const SCALE_MAX = 1.14;
const SMOOTHING_TAU = 0.42;
// Portrait phones fit a narrower framing aspect than the 16:9 desktop safe
// area. The singularity and disk then fill the hero instead of sitting in a
// tall, mostly empty UV window.
const MOBILE_FRAMING = 0.8;
const MOBILE_MAX_WIDTH = 720;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

function intensityAt(scrollY: number, anchors: Anchor[]): number {
  if (anchors.length === 0) return 1;
  if (scrollY <= anchors[0].top) return anchors[0].intensity;

  for (let i = 1; i < anchors.length; i += 1) {
    const previous = anchors[i - 1];
    const next = anchors[i];
    if (scrollY <= next.top) {
      const span = Math.max(1, next.top - previous.top);
      const progress = smoothstep(clamp01((scrollY - previous.top) / span));
      return previous.intensity + (next.intensity - previous.intensity) * progress;
    }
  }

  return anchors[anchors.length - 1].intensity;
}

/** sRGB hex -> 0..1 tuple for the shader uniforms. */
function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// LOCH palette: sky-blue highlights, steel-blue disk, deep-ocean base.
const COLOR_A = hexToRgb('#97D7FF');
const COLOR_B = hexToRgb('#4D8DBA');
const COLOR_C = hexToRgb('#05202E');

export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    // Conservative on mobile, slightly sharper on desktop.
    const dprCap = coarsePointer ? 1.25 : 1.5;

    let gl: WebGL2RenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let uniforms: Partial<Record<UniformName, WebGLUniformLocation | null>> = {};

    let rafId = 0;
    let staticRafId = 0;
    let disposed = false;
    let contextLost = false;
    let documentVisible = !document.hidden;
    let reduced = motionQuery.matches;
    let simTime = 0;
    let lastTime = 0;

    let scrollY = window.scrollY;
    let anchors: Anchor[] = [];
    let targetIntensity = 1;
    let currentIntensity = 1;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const fail = () => {
      // Hide the canvas; the CSS gradient on .site-bg remains as the fallback.
      canvas.style.opacity = '0';
    };

    const compileShader = (type: number, source: string): WebGLShader | null => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[SiteBackground] shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const disposeResources = () => {
      if (!gl) return;
      if (program) {
        gl.deleteProgram(program);
        program = null;
      }
      if (buffer) {
        gl.deleteBuffer(buffer);
        buffer = null;
      }
      if (vertexShader) {
        gl.deleteShader(vertexShader);
        vertexShader = null;
      }
      if (fragmentShader) {
        gl.deleteShader(fragmentShader);
        fragmentShader = null;
      }
      uniforms = {};
    };

    const applyStaticUniforms = () => {
      if (!gl) return;
      const u = uniforms;
      gl.uniform1f(u.u_mass ?? null, 0.42);
      gl.uniform1f(u.u_spin ?? null, 1.0);
      gl.uniform1f(u.u_lensing ?? null, 1.0);
      gl.uniform1f(u.u_doppler ?? null, 1.0);
      gl.uniform1f(u.u_photon_sphere ?? null, 1.0);
      gl.uniform1f(u.u_speed ?? null, 0.6);
      gl.uniform1f(u.u_scale ?? null, 1.0);
      gl.uniform1f(u.u_rotation ?? null, 0.0);
      gl.uniform1f(u.u_exposure ?? null, 1.0);
      gl.uniform1f(u.u_hue ?? null, 0.0);
      gl.uniform1f(u.u_saturation ?? null, 0.96);
      gl.uniform1f(u.u_brightness ?? null, 1.0);
      gl.uniform1f(u.u_contrast ?? null, 1.04);
      gl.uniform1f(u.u_disk ?? null, 1.0);
      gl.uniform1f(u.u_portrait ?? null, 0.0);
      gl.uniform1f(u.u_mobile_framing ?? null, MOBILE_FRAMING);
      gl.uniform3f(u.u_colorA ?? null, COLOR_A[0], COLOR_A[1], COLOR_A[2]);
      gl.uniform3f(u.u_colorB ?? null, COLOR_B[0], COLOR_B[1], COLOR_B[2]);
      gl.uniform3f(u.u_colorC ?? null, COLOR_C[0], COLOR_C[1], COLOR_C[2]);
    };

    const initResources = (): boolean => {
      if (!gl) return false;

      vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) {
        disposeResources();
        return false;
      }

      program = gl.createProgram();
      if (!program) {
        disposeResources();
        return false;
      }
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('[SiteBackground] program link failed:', gl.getProgramInfoLog(program));
        disposeResources();
        return false;
      }
      gl.useProgram(program);

      buffer = gl.createBuffer();
      if (!buffer) {
        disposeResources();
        return false;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      uniforms = {};
      for (const name of UNIFORM_NAMES) {
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      applyStaticUniforms();
      return true;
    };

    const applyDynamicUniforms = (intensity: number) => {
      if (!gl) return;
      const t = clamp01(intensity);
      const u = uniforms;
      const disk = DISK_MIN + (DISK_MAX - DISK_MIN) * Math.pow(t, DISK_CURVE);
      gl.uniform1f(u.u_disk ?? null, disk);
      gl.uniform1f(u.u_exposure ?? null, EXPOSURE_MIN + (EXPOSURE_MAX - EXPOSURE_MIN) * t);
      gl.uniform1f(u.u_saturation ?? null, SATURATION_MIN + (SATURATION_MAX - SATURATION_MIN) * t);
      gl.uniform1f(u.u_contrast ?? null, CONTRAST_MIN + (CONTRAST_MAX - CONTRAST_MIN) * t);
      gl.uniform1f(u.u_scale ?? null, SCALE_MIN + (1 - t) * (SCALE_MAX - SCALE_MIN));
    };

    const drawFrame = (time: number) => {
      if (!gl || !program) return;
      gl.useProgram(program);
      gl.uniform1f(uniforms.u_time ?? null, time);
      applyDynamicUniforms(currentIntensity);
      const pointerScale = clamp01(currentIntensity);
      gl.uniform2f(
        uniforms.u_pointer ?? null,
        pointer.x * pointerScale,
        pointer.y * pointerScale,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const render = (now: number) => {
      rafId = 0;
      if (disposed || contextLost) return;

      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;
      simTime += dt;

      // Frame-rate independent easing toward the current section target.
      const easing = 1 - Math.exp(-dt / SMOOTHING_TAU);
      currentIntensity += (targetIntensity - currentIntensity) * easing;
      if (Math.abs(targetIntensity - currentIntensity) < 0.0005) {
        currentIntensity = targetIntensity;
      }

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      drawFrame(simTime);
      rafId = requestAnimationFrame(render);
    };

    const renderStatic = () => {
      if (disposed || contextLost) return;
      drawFrame(14.0);
    };

    const requestStaticDraw = () => {
      if (staticRafId || disposed || contextLost) return;
      staticRafId = requestAnimationFrame(() => {
        staticRafId = 0;
        if (!documentVisible) return;
        renderStatic();
      });
    };

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const start = () => {
      if (rafId || disposed || contextLost) return;
      if (reduced) {
        renderStatic();
        return;
      }
      lastTime = performance.now();
      rafId = requestAnimationFrame(render);
    };

    const syncPlayback = () => {
      if (disposed || contextLost) return;
      if (reduced) {
        stop();
        currentIntensity = targetIntensity;
        requestStaticDraw();
        return;
      }
      if (documentVisible) start();
      else stop();
    };

    const recomputeAnchors = () => {
      if (disposed) return;
      const next: Anchor[] = [];
      for (const target of SECTION_TARGETS) {
        const element = document.getElementById(target.id);
        if (!element) continue;
        next.push({
          top: element.getBoundingClientRect().top + window.scrollY,
          intensity: target.intensity,
        });
      }
      next.sort((a, b) => a.top - b.top);
      anchors = next;
      scrollY = window.scrollY;
      targetIntensity = intensityAt(scrollY, anchors);
      if (reduced) {
        currentIntensity = targetIntensity;
        requestStaticDraw();
      }
    };

    const resize = (force = false): boolean => {
      if (!gl || !program) return false;
      const cssWidth = canvas.clientWidth || window.innerWidth;
      const cssHeight = canvas.clientHeight || window.innerHeight;
      const width = Math.max(1, Math.round(cssWidth * dprCap));
      const height = Math.max(1, Math.round(cssHeight * dprCap));
      // Mobile-only framing: portrait phones up to the site's compact
      // breakpoint. Every other viewport keeps the 16:9 safe area. Set the
      // flag before the early return so an aspect flip can never be skipped.
      const portrait = cssHeight > cssWidth && cssWidth <= MOBILE_MAX_WIDTH;
      gl.uniform1f(uniforms.u_portrait ?? null, portrait ? 1 : 0);
      if (!force && canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uniforms.u_resolution ?? null, width, height);
      // Compose the singularity slightly right of centre on landscape
      // screens so it sits clear of the left-aligned hero copy.
      const landscape = window.innerWidth > window.innerHeight;
      gl.uniform1f(uniforms.u_cx ?? null, landscape ? -0.2 : 0);
      gl.uniform1f(uniforms.u_cy ?? null, 0);
      return true;
    };

    // ---- WebGL bootstrap -------------------------------------------------
    try {
      gl = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      gl = null;
    }
    if (!gl) {
      fail();
      return;
    }

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      // Show the CSS gradient rather than a frozen/black canvas while lost.
      canvas.style.opacity = '0';
      stop();
      if (staticRafId) {
        cancelAnimationFrame(staticRafId);
        staticRafId = 0;
      }
    };

    const onContextRestored = () => {
      contextLost = false;
      // Every handle from the old context is invalid — rebuild from scratch.
      uniforms = {};
      program = null;
      buffer = null;
      vertexShader = null;
      fragmentShader = null;
      if (!initResources()) {
        fail();
        return;
      }
      canvas.style.opacity = '1';
      resize(true);
      recomputeAnchors();
      currentIntensity = targetIntensity;
      syncPlayback();
    };

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    if (!initResources()) {
      fail();
      return;
    }
    resize(true);
    recomputeAnchors();
    currentIntensity = targetIntensity;

    // ---- Interaction -----------------------------------------------------
    const onPointerMove = (event: PointerEvent) => {
      if (coarsePointer) return;
      pointer.tx = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      pointer.ty = -(event.clientY / Math.max(1, window.innerHeight) - 0.5);
    };
    const onPointerLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    // ---- Scroll-linked intensity ----------------------------------------
    const onScroll = () => {
      scrollY = window.scrollY;
      targetIntensity = intensityAt(scrollY, anchors);
      if (reduced) {
        currentIntensity = targetIntensity;
        requestStaticDraw();
      }
    };

    const onResize = () => {
      resize();
      recomputeAnchors();
      if (reduced) requestStaticDraw();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // ---- Lifecycle -------------------------------------------------------
    const onVisibility = () => {
      documentVisible = !document.hidden;
      syncPlayback();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onMotionChange = () => {
      reduced = motionQuery.matches;
      if (reduced) currentIntensity = targetIntensity;
      syncPlayback();
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    } else {
      motionQuery.addListener(onMotionChange);
    }

    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => onResize()) : null;
    ro?.observe(canvas);

    // Recompute section anchors once webfonts have settled the layout.
    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (!disposed) recomputeAnchors();
        })
        .catch(() => {});
    }

    syncPlayback();

    return () => {
      disposed = true;
      stop();
      if (staticRafId) {
        cancelAnimationFrame(staticRafId);
        staticRafId = 0;
      }
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      if (typeof motionQuery.removeEventListener === 'function') {
        motionQuery.removeEventListener('change', onMotionChange);
      } else {
        motionQuery.removeListener(onMotionChange);
      }
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      disposeResources();
    };
  }, []);

  return (
    <div className="site-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="site-bg__canvas" />
    </div>
  );
}
