/**
 * TEMPORARY Stage-2 diagnostic entry — LOCH box investigation.
 *
 * Mounted only from /webgl-diag2.html served by the vite dev server.
 * Not part of the site bundle: index.html never imports this file, so the
 * production build is unchanged. It reuses the PRODUCTION modules untouched —
 * RefractedText, SiteBackground, and the global stylesheet — so the real
 * shader, real glyph masks, real bundled font and the real Hero animation
 * sequence run here.
 *
 * Stage instrumentation (side band only, cannot alter rendering):
 * selectable context-attribute merging (applied before any context exists,
 * production default = untouched), rAF timestamp scaling for photographing
 * the L stage, and a stage-by-stage sequencer hooking every content operation
 * on the mask/glow 2D canvases: clears, stroke/fill, getImageData scans,
 * putImageData, drawImage-with-blur and texImage2D uploads. Each key stage is
 * measured (alpha/channel bounding boxes, edge strips, 4x4 zone counts,
 * full-rect flags) and previewed as separate channel maps so Mask and Glow
 * can never be confused.
 *
 * Delete this file (and webgl-diag2.html) after the investigation.
 */
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RefractedText } from './components/refracted-text';
import { SiteBackground } from './components/SiteBackground';
import './index.css';

type DiagWindow = typeof window & {
  __diagGLMerge?: Record<string, unknown> | null;
  __diagSpeed?: number;
  __diagUploads?: string[];
  __diagSnaps?: string[];
  __diagStages?: DiagStage[];
};
const diagWindow = window as DiagWindow;
diagWindow.__diagGLMerge = null;
diagWindow.__diagSpeed = 1;
diagWindow.__diagUploads = [];
diagWindow.__diagSnaps = [];

type DiagStage = {
  n: number;
  tag: 'mask' | 'glow' | 'other';
  op: string;
  detail: string;
  metrics: string;
  thumbs: { label: string; url: string }[];
  rectFlag: boolean;
};
diagWindow.__diagStages = [];

/* ---- rAF clock scaling: identical frames, slower sampling (default 1x) ---- */
const nativeRAF = window.requestAnimationFrame.bind(window);
let lastReal = 0;
let virtualT = 0;
window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
  return nativeRAF((raw: number) => {
    if (lastReal === 0) {
      lastReal = raw;
      virtualT = raw;
    }
    let d = raw - lastReal;
    lastReal = raw;
    if (d < 0) d = 0;
    if (d > 250) d = 250;
    virtualT += d * (diagWindow.__diagSpeed ?? 1);
    cb(virtualT);
  });
}) as unknown as typeof window.requestAnimationFrame;

const nativeGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
  this: HTMLCanvasElement,
  type: string,
  ...rest: unknown[]
): unknown {
  const merge = diagWindow.__diagGLMerge;
  if (merge && typeof type === 'string' && type.toLowerCase().includes('webgl')) {
    const base = (rest[0] ?? {}) as Record<string, unknown>;
    const merged = [{ ...base, ...merge }];
    return (nativeGetContext as unknown as (...a: unknown[]) => unknown).apply(this, [
      type,
      ...merged,
    ]);
  }
  return (nativeGetContext as unknown as (...a: unknown[]) => unknown).apply(this, [
    type,
    ...rest,
  ]);
} as unknown as typeof HTMLCanvasElement.prototype.getContext;

/* ================= Stage sequencer (mask/glow instrumentation) ============ */

const inSnap = { active: false };
const canvasTag = new WeakMap<HTMLCanvasElement, 'mask' | 'glow'>();
let genSeen = 0;
let stageN = 0;

function isMaskSized(canvas: HTMLCanvasElement) {
  return canvas.width >= 400 && canvas.width <= 1200 && canvas.height >= 60 && canvas.height < 400;
}

function tagOf(canvas: HTMLCanvasElement): 'mask' | 'glow' | 'other' {
  const known = canvasTag.get(canvas);
  if (known) return known;
  if (inSnap.active || !isMaskSized(canvas)) return 'other';
  if (genSeen >= 2) genSeen = 0; // a mask rebuild starts a new canvas pair
  const tag = genSeen === 0 ? 'mask' : 'glow';
  canvasTag.set(canvas, tag);
  genSeen += 1;
  return tag;
}

type Stats = {
  txt: string;
  rectFlag: boolean;
  aBBox?: { x0: number; y0: number; x1: number; y1: number };
};

/* Measure one RGBA data block: alpha + channel structure.
   `channelFocus` selects the view mode: glow view vs mask view. A
   full-canvas ALPHA bbox is only meaningful for the mask view — the glow
   repack forces A=255 everywhere by design, and its G channel
   (exterior*255) also floods the canvas by design. Only the glow R channel
   (blurred ink) going full-canvas indicates a real defect. */
function measureData(
  data: Uint8ClampedArray | Uint8Array,
  W: number,
  H: number,
  channelFocus: boolean,
): Stats {
  const zones = new Array<number>(16).fill(0);
  const zonesR = new Array<number>(16).fill(0);
  const zonesG = new Array<number>(16).fill(0);
  const zonesB = new Array<number>(16).fill(0);
  let aMinX = 1e9, aMinY = 1e9, aMaxX = -1, aMaxY = -1, aCnt = 0, aStrong = 0;
  let rMinX = 1e9, rMinY = 1e9, rMaxX = -1, rMaxY = -1, rCnt = 0;
  let gMinX = 1e9, gMinY = 1e9, gMaxX = -1, gMaxY = -1, gCnt = 0, gCnt255 = 0;
  let bMinX = 1e9, bMinY = 1e9, bMaxX = -1, bMaxY = -1, bCnt = 0;
  const edgeA = [0, 0, 0, 0]; // top bottom left right: max alpha
  const edgeCnt = [0, 0, 0, 0];
  const zone = (x: number, y: number) =>
    Math.min(3, (y * 4 / H) | 0) * 4 + Math.min(3, (x * 4 / W) | 0);
  const isEdge = (x: number, y: number) => y < 2 || y >= H - 2 || x < 2 || x >= W - 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      const a = data[o + 3];
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      const z = zone(x, y);
      if (a > 0) {
        aCnt++; if (a >= 250) aStrong++;
        if (x < aMinX) aMinX = x; if (x > aMaxX) aMaxX = x;
        if (y < aMinY) aMinY = y; if (y > aMaxY) aMaxY = y;
        zones[z]++;
      }
      if (r > 0) { rCnt++; if (x < rMinX) rMinX = x; if (x > rMaxX) rMaxX = x; if (y < rMinY) rMinY = y; if (y > rMaxY) rMaxY = y; zonesR[z]++; }
      if (g > 0) { gCnt++; gCnt255 += g >= 250 ? 1 : 0; if (x < gMinX) gMinX = x; if (x > gMaxX) gMaxX = x; if (y < gMinY) gMinY = y; if (y > gMaxY) gMaxY = y; zonesG[z]++; }
      if (b > 0) { bCnt++; if (x < bMinX) bMinX = x; if (x > bMaxX) bMaxX = x; if (y < bMinY) bMinY = y; if (y > bMaxY) bMaxY = y; zonesB[z]++; }
      if (a > 0 && isEdge(x, y)) {
        if (y < 2) { edgeA[0] = Math.max(edgeA[0], a); edgeCnt[0]++; }
        if (y >= H - 2) { edgeA[1] = Math.max(edgeA[1], a); edgeCnt[1]++; }
        if (x < 2) { edgeA[2] = Math.max(edgeA[2], a); edgeCnt[2]++; }
        if (x >= W - 2) { edgeA[3] = Math.max(edgeA[3], a); edgeCnt[3]++; }
      }
    }
  }
  const zs = (arr: number[]) => `[${arr.join(' ')}]`;
  const bbox = (x0: number, y0: number, x1: number, y1: number) =>
    x1 < 0 ? '—' : `[${x0},${y0}..${x1},${y1}]`;
  const aFull =
    aCnt > 0 && aMinX <= 1 && aMinY <= 1 && aMaxX >= W - 2 && aMaxY >= H - 2;
  const rFull = rCnt > 0 && rMinX <= 1 && rMinY <= 1 && rMaxX >= W - 2 && rMaxY >= H - 2;
  const txt =
    `A bbox=${bbox(aMinX, aMinY, aMaxX, aMaxY)} cnt=${aCnt} ink=${aStrong}` +
    ` zonesA=${zs(zones)}` +
    ` edges[t/b/l/r]=${edgeA.join('/')}/${edgeCnt.join('/')}` +
    ` | R bbox=${bbox(rMinX, rMinY, rMaxX, rMaxY)} cnt=${rCnt}` +
    ` | G bbox=${bbox(gMinX, gMinY, gMaxX, gMaxY)} cnt=${gCnt} ge250=${gCnt255}` +
    ` | B bbox=${bbox(bMinX, bMinY, bMaxX, bMaxY)} cnt=${bCnt}` +
    ` | a-full-rect=${aFull ? 'YES' : 'no'} r-full-rect=${rFull ? 'YES' : 'no'}` +
    ` (view: ${channelFocus ? 'glow, flag=r-full' : 'mask, flag=a-full'})`;
  // Glow view: R (blurred ink) full-canvas is a defect. Mask view: alpha
  // full-canvas is a defect. G-full and glow A-full are by-design states.
  return {
    txt,
    rectFlag: channelFocus ? rFull : aFull,
    aBBox: aMaxX < 0 ? undefined : { x0: aMinX, y0: aMinY, x1: aMaxX, y1: aMaxY },
  };
}

/* Snapshot a stage canvas and derive preview maps. The view mode follows the
   canvas identity (tag), never the op type: mask canvases measure alpha maps,
   glow canvases measure R/G/B channel maps. */
function snapshotStage(
  src: HTMLCanvasElement,
  tag: 'mask' | 'glow' | 'other',
): { metrics: Stats; thumbs: { label: string; url: string }[] } {
  const channelFocus = tag === 'glow';
  inSnap.active = true;
  const wsrc = src.width;
  const hsrc = src.height;
  let out = { metrics: { txt: 'measure failed', rectFlag: false }, thumbs: [] as { label: string; url: string }[] };
  try {
    const c = document.createElement('canvas');
    c.width = wsrc;
    c.height = hsrc;
    const cx = c.getContext('2d', { willReadFrequently: true });
    if (!cx) throw new Error('no 2d');
    cx.drawImage(src, 0, 0);
    const px = cx.getImageData(0, 0, wsrc, hsrc);
    const metrics = measureData(px.data, wsrc, hsrc, channelFocus);
    const thumbs: { label: string; url: string }[] = [];
    const mkMap = (channel: 'a' | 'r' | 'g' | 'b', label: string) => {
      const mapped = document.createElement('canvas');
      mapped.width = wsrc;
      mapped.height = hsrc;
      const mx = mapped.getContext('2d');
      if (!mx) return;
      const md = mx.createImageData(wsrc, hsrc);
      const idx = channel === 'a' ? 3 : channel === 'r' ? 0 : channel === 'g' ? 1 : 2;
      for (let i = 0; i < wsrc * hsrc; i++) {
        const v = channel === 'a' ? px.data[i * 4 + 3] : px.data[i * 4 + idx];
        md.data[i * 4] = v;
        md.data[i * 4 + 1] = v;
        md.data[i * 4 + 2] = v;
        md.data[i * 4 + 3] = 255;
      }
      mx.putImageData(md, 0, 0);
      thumbs.push({ label, url: mapped.toDataURL('image/png') });
    };
    if (channelFocus) {
      mkMap('r', 'glow R (blurred ink)');
      mkMap('g', 'glow G (exterior=full by design)');
      mkMap('b', 'glow B (flow markers)');
    } else {
      mkMap('a', 'mask alpha (ink)');
      mkMap('r', 'mask R (edge dist)');
    }
    out = { metrics, thumbs };
  } catch (e) {
    out.metrics = { txt: `snapshot error ${String(e).slice(0, 60)}`, rectFlag: false };
  } finally {
    inSnap.active = false;
  }
  return out;
}

function pushStage(
  tag: 'mask' | 'glow' | 'other',
  op: string,
  detail: string,
  metrics: Stats | null,
  thumbs: { label: string; url: string }[],
) {
  const list = diagWindow.__diagStages ?? (diagWindow.__diagStages = []);
  stageN += 1;
  list.push({
    n: stageN,
    tag,
    op,
    detail,
    metrics: metrics ? metrics.txt : '',
    thumbs,
    rectFlag: metrics ? metrics.rectFlag : false,
  });
  if (list.length > 80) list.splice(0, list.length - 80);
}

function trackCanvasOp(
  canvas: HTMLCanvasElement,
  op: string,
  detail: string,
  doSnap: boolean,
) {
  try {
    const tag = tagOf(canvas);
    if (tag === 'other') return;
    if (doSnap) {
      const s = snapshotStage(canvas, tag);
      pushStage(tag, op, detail, s.metrics, s.thumbs);
    } else {
      pushStage(tag, op, detail, null, []);
    }
  } catch {
    /* never disturb the rendering path */
  }
}

/* ---- 2D content hooks (production path is always executed first) ---- */
const proto2d = CanvasRenderingContext2D.prototype as unknown as Record<string, unknown> & {
  clearRect: (...a: unknown[]) => void;
  fillText: (...a: unknown[]) => void;
  strokeText: (...a: unknown[]) => void;
  getImageData: (...a: unknown[]) => ImageData;
  putImageData: (...a: unknown[]) => void;
  drawImage: (...a: unknown[]) => void;
};

const nativeClearRect = proto2d.clearRect;
proto2d.clearRect = function (this: CanvasRenderingContext2D, ...a: unknown[]) {
  const r = nativeClearRect.apply(this, a as [never, never, never, never]);
  trackCanvasOp(
    this.canvas,
    'clearRect',
    `${a[0]},${a[1]} ${a[2]}x${a[3]}`,
    false,
  );
  return r;
} as unknown as typeof proto2d.clearRect;

const nativeFillText = proto2d.fillText;
proto2d.fillText = function (this: CanvasRenderingContext2D, ...a: unknown[]) {
  const r = nativeFillText.apply(this, a as [never, never, never]);
  trackCanvasOp(this.canvas, 'fillText', String(a[0] ?? ''), true);
  return r;
} as unknown as typeof proto2d.fillText;

const nativeStrokeText = proto2d.strokeText;
proto2d.strokeText = function (this: CanvasRenderingContext2D, ...a: unknown[]) {
  const r = nativeStrokeText.apply(this, a as [never, never, never]);
  trackCanvasOp(this.canvas, 'strokeText', String(a[0] ?? ''), false);
  return r;
} as unknown as typeof proto2d.strokeText;

const nativeGetImageData = proto2d.getImageData;
proto2d.getImageData = function (this: CanvasRenderingContext2D, ...a: unknown[]) {
  const r = nativeGetImageData.apply(this, a as [never, never, never, never]);
  trackCanvasOp(
    this.canvas,
    'getImageData',
    `${a[0]},${a[1]} ${a[2]}x${a[3]} → ${r ? `${r.width}x${r.height}` : 'null'}`,
    false,
  );
  return r;
} as unknown as typeof proto2d.getImageData;

const nativePutImageData = proto2d.putImageData;
proto2d.putImageData = function (this: CanvasRenderingContext2D, ...a: unknown[]) {
  const r = nativePutImageData.apply(this, a as [never, never, never]);
  // The written rect: full canvas for both mask (1046) and glow (1065) passes.
  trackCanvasOp(
    this.canvas,
    'putImageData',
    `${a[1]},${a[2]} (${a[0] instanceof ImageData ? `${a[0].width}x${a[0].height}` : '?'})`,
    true,
  );
  return r;
} as unknown as typeof proto2d.putImageData;

const nativeDrawImage = proto2d.drawImage;
proto2d.drawImage = function (this: CanvasRenderingContext2D, ...a: unknown[]) {
  const srcInfo =
    a[0] instanceof HTMLCanvasElement
      ? `src=canvas(${a[0].width}x${a[0].height})`
      : `src=other`;
  const r = nativeDrawImage.apply(this, a as [never, never, never, never, never]);
  try {
    const srcTag = a[0] instanceof HTMLCanvasElement ? tagOf(a[0] as HTMLCanvasElement) : 'other';
    if (srcTag !== 'other') {
      // Include the context's current filter in the record: on engines where
      // the filter property hook does not fire, this still attributes the
      // blur to the exact drawImage that applied it.
      let filterTxt = '';
      try {
        filterTxt = ` filter=${String((this as CanvasRenderingContext2D).filter)}`;
      } catch {
        /* ignore */
      }
      trackCanvasOp(
        this.canvas,
        'drawImage',
        `${srcInfo} srcTag=${srcTag}${filterTxt}`,
        true,
      );
    } else {
      trackCanvasOp(this.canvas, 'drawImage', srcInfo, false);
    }
  } catch {
    /* ignore */
  }
  return r;
} as unknown as typeof proto2d.drawImage;

/* filter property hook (glow blur stage) — skipped silently if unsupported */
try {
  const desc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'filter');
  if (desc && desc.set && desc.get) {
    Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', {
      get: desc.get,
      set: function (this: CanvasRenderingContext2D, v: unknown) {
        desc.set!.call(this, v as string);
        if (v && typeof v === 'string' && v !== 'none') {
          trackCanvasOp(this.canvas, 'filter', `set ${v}`, false);
        }
      },
      configurable: true,
    });
  }
} catch {
  /* ignore */
}

/* ---- texImage2D counter + uploads log (existing behaviour kept) ---- */
const nativeTI = WebGL2RenderingContext.prototype.texImage2D as (
  this: WebGL2RenderingContext,
  ...a: unknown[]
) => unknown;
WebGL2RenderingContext.prototype.texImage2D = function (
  this: WebGL2RenderingContext,
  ...args: unknown[]
): unknown {
  try {
    const source = (args[5] ?? args[8]) as HTMLCanvasElement | undefined;
    if (
      source &&
      typeof (source as { width?: number }).width === 'number' &&
      (source as { width: number }).width > 64
    ) {
      const s = source as HTMLCanvasElement;
      diagWindow.__diagUploads?.push(`${s.width}x${s.height}`);
      if (diagWindow.__diagUploads && diagWindow.__diagUploads.length > 12) {
        diagWindow.__diagUploads = diagWindow.__diagUploads.slice(-12);
      }
      // Legacy raw preview push (kept). New labelled thumbs come from stages.
      diagWindow.__diagSnaps?.push(s.toDataURL('image/png'));
      if (diagWindow.__diagSnaps && diagWindow.__diagSnaps.length > 6) {
        diagWindow.__diagSnaps = diagWindow.__diagSnaps.slice(-6);
      }
      const tag = s instanceof HTMLCanvasElement ? tagOf(s) : 'other';
      if (tag !== 'other') {
        const s2 = snapshotStage(s, tag);
        pushStage(tag, 'texImage2D', `upload as ${tag} texture`, s2.metrics, s2.thumbs);
        // Remember the final mask ink bounds (top-down canvas coords) so the
        // framebuffer probe can measure RGB strictly outside the glyphs.
        if (tag === 'mask' && s2.metrics.aBBox) fb.maskBBox = s2.metrics.aBBox;
      }
    }
  } catch {
    /* ignore */
  }
  return nativeTI.apply(this, args);
} as unknown as typeof WebGL2RenderingContext.prototype.texImage2D;

/* ============ Final framebuffer probe (same-task readPixels) ==============
 * preserveDrawingBuffer is false, so the default framebuffer is only valid
 * inside the same task that issued the draw calls. The drawArrays hook
 * schedules a microtask: microtasks run after the whole rAF callback has
 * returned (all glyph draws done) but before the browser composites, so
 * readPixels sees the exact frame the compositor will sample.
 *
 * Measurements per frame:
 *  - alpha: count/bbox/edge strips (expect clean outside ink)
 *  - RGB where alpha < 2: count, max, bbox, 4x4 zones, plus the "spill"
 *    signature (r>140 && g>150 && b>190) emitted by the shader's exterior
 *    branch as outColor = vec4(spillColor, lowerSpill) with lowerSpill ~ 0.
 *  - fixed probe coordinates (corners/edges) with exact RGBA values.
 * A manual capture additionally serializes the canvas via toDataURL in the
 * same task (the browser's own canvas pipeline) and re-measures it, so raw
 * framebuffer vs browser-serialized canvas vs screen can be compared.
 */
type FbSample = {
  kind: 'auto' | 'manual';
  t: number;
  size: string;
  txt: string;
  rect: boolean;
  serialTxt?: string;
  serialDiff?: string;
  thumbs?: { label: string; url: string }[];
};
type FbMetrics = {
  txt: string;
  rect: boolean;
  aBBox: { x0: number; y0: number; x1: number; y1: number } | null;
  rgbA0Cnt: number;
  spillCnt: number;
  outCnt: number;
};
const fb = {
  canvas: null as HTMLCanvasElement | null,
  gl: null as WebGL2RenderingContext | null,
  scheduled: false,
  lastAuto: 0,
  lastFind: 0,
  force: false,
  t0: 0,
  samples: [] as FbSample[],
  maskBBox: null as { x0: number; y0: number; x1: number; y1: number } | null,
};

function analyzeFb(
  data: Uint8ClampedArray | Uint8Array,
  w: number,
  h: number,
  flipY: boolean,
  inkBBox: { x0: number; y0: number; x1: number; y1: number } | null,
): FbMetrics {
  let aCnt = 0, aStrong = 0, aX0 = 1e9, aY0 = 1e9, aX1 = -1, aY1 = -1;
  const edgeMax = [0, 0, 0, 0];
  const edgeCnt = [0, 0, 0, 0];
  let r0Cnt = 0, outCnt = 0, spill = 0;
  let rX0 = 1e9, rY0 = 1e9, rX1 = -1, rY1 = -1;
  let maxR = 0, maxG = 0, maxB = 0;
  const zones = new Array<number>(16).fill(0);
  for (let y = 0; y < h; y++) {
    const row = flipY ? h - 1 - y : y;
    for (let x = 0; x < w; x++) {
      const o = (row * w + x) * 4;
      const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
      if (a > 0) {
        aCnt++;
        if (a >= 250) aStrong++;
        if (x < aX0) aX0 = x; if (x > aX1) aX1 = x;
        if (y < aY0) aY0 = y; if (y > aY1) aY1 = y;
        if (y < 2) { edgeMax[0] = Math.max(edgeMax[0], a); edgeCnt[0]++; }
        if (y >= h - 2) { edgeMax[1] = Math.max(edgeMax[1], a); edgeCnt[1]++; }
        if (x < 2) { edgeMax[2] = Math.max(edgeMax[2], a); edgeCnt[2]++; }
        if (x >= w - 2) { edgeMax[3] = Math.max(edgeMax[3], a); edgeCnt[3]++; }
      }
      const mx = Math.max(r, g, b);
      if (a < 2 && mx > 16) {
        r0Cnt++;
        if (r > maxR) maxR = r; if (g > maxG) maxG = g; if (b > maxB) maxB = b;
        if (x < rX0) rX0 = x; if (x > rX1) rX1 = x;
        if (y < rY0) rY0 = y; if (y > rY1) rY1 = y;
        zones[Math.min(3, (y * 4 / h) | 0) * 4 + Math.min(3, (x * 4 / w) | 0)]++;
        if (r > 140 && g > 150 && b > 190) spill++;
        if (inkBBox &&
          (x < inkBBox.x0 - 2 || x > inkBBox.x1 + 2 ||
            y < inkBBox.y0 - 2 || y > inkBBox.y1 + 2)) outCnt++;
      }
    }
  }
  const bbox = (x0: number, y0: number, x1: number, y1: number) =>
    x1 < 0 ? '—' : `[${x0},${y0}..${x1},${y1}]`;
  const rect = rX1 >= 0 && rX0 <= 1 && rY0 <= 1 && rX1 >= w - 2 && rY1 >= h - 2;
  const probe = (x: number, y: number, label: string) => {
    const row = flipY ? h - 1 - y : y;
    const o = (row * w + x) * 4;
    return `${label}(${x},${y})=${data[o]},${data[o + 1]},${data[o + 2]}/${data[o + 3]}`;
  };
  const probes = [
    probe(2, 2, 'tl'),
    probe(w - 3, 2, 'tr'),
    probe(2, h - 3, 'bl'),
    probe(w - 3, h - 3, 'br'),
    probe((w / 2) | 0, 2, 'tc'),
    probe(2, (h / 2) | 0, 'ml'),
  ];
  const txt =
    `A cnt=${aCnt} ink=${aStrong} bbox=${bbox(aX0, aY0, aX1, aY1)}` +
    ` edges=${edgeMax.join('/')} ecnt=${edgeCnt.join('/')}` +
    ` | a0RGB cnt=${r0Cnt} out=${outCnt} max=${maxR},${maxG},${maxB}` +
    ` bbox=${bbox(rX0, rY0, rX1, rY1)} spill=${spill} rect=${rect ? 'YES' : 'no'}` +
    ` zones=${zones.join(' ')}` +
    ` | probes ${probes.join(' ')}`;
  return {
    txt,
    rect,
    aBBox: aX1 < 0 ? null : { x0: aX0, y0: aY0, x1: aX1, y1: aY1 },
    rgbA0Cnt: r0Cnt,
    spillCnt: spill,
    outCnt,
  };
}

function fbFindCanvas() {
  const c = document.querySelector('.hero__mark canvas');
  if (!(c instanceof HTMLCanvasElement)) {
    fb.canvas = null;
    fb.gl = null;
    return;
  }
  if (c !== fb.canvas) {
    fb.canvas = c;
    fb.gl = c.getContext('webgl2');
    if (fb.t0 === 0) fb.t0 = performance.now();
  }
}

function fbNoteDraw(gl: WebGL2RenderingContext) {
  if (!fb.canvas || !fb.canvas.isConnected) {
    const now = performance.now();
    if (now - fb.lastFind < 300) return;
    fb.lastFind = now;
    fbFindCanvas();
  }
  if (gl.canvas !== fb.canvas) return;
  if (fb.scheduled) return;
  fb.scheduled = true;
  queueMicrotask(() => {
    fb.scheduled = false;
    fbRead();
  });
}

function fbRead() {
  const gl = fb.gl;
  const canvas = fb.canvas;
  if (!gl || !canvas || gl.isContextLost()) return;
  const now = performance.now();
  const manual = fb.force;
  if (!manual && now - fb.lastAuto < 400) return;
  fb.force = false;
  fb.lastAuto = now;
  if (fb.t0 === 0) fb.t0 = now;
  const w = gl.drawingBufferWidth;
  const h = gl.drawingBufferHeight;
  if (!w || !h) return;
  const buf = new Uint8Array(w * h * 4);
  try {
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  } catch {
    return;
  }
  const m = analyzeFb(buf, w, h, true, fb.maskBBox);
  const sample: FbSample = {
    kind: manual ? 'manual' : 'auto',
    t: Math.round(now - fb.t0),
    size: `${w}x${h}`,
    txt: m.txt,
    rect: m.rect,
  };
  if (manual) {
    // The probe's own 700x124 canvases must not be tagged as mask/glow by the
    // stage sequencer (they are the same size as the production textures).
    inSnap.active = true;
    try {
      const mk = (mode: 'rgb' | 'a') => {
        const c2 = document.createElement('canvas');
        c2.width = w;
        c2.height = h;
        const x2 = c2.getContext('2d');
        if (!x2) return '';
        const md = x2.createImageData(w, h);
        for (let y = 0; y < h; y++) {
          const srcRow = (h - 1 - y) * w;
          for (let x = 0; x < w; x++) {
            const s = (srcRow + x) * 4;
            const d = (y * w + x) * 4;
            if (mode === 'rgb') {
              md.data[d] = buf[s];
              md.data[d + 1] = buf[s + 1];
              md.data[d + 2] = buf[s + 2];
            } else {
              const v = buf[s + 3];
              md.data[d] = v;
              md.data[d + 1] = v;
              md.data[d + 2] = v;
            }
            md.data[d + 3] = 255;
          }
        }
        x2.putImageData(md, 0, 0);
        return c2.toDataURL('image/png');
      };
      const thumbs: { label: string; url: string }[] = [
        { label: 'FRAMEBUFFER RGB (alpha forced 255) — a light rect here is RGB under alpha 0', url: mk('rgb') },
        { label: 'FRAMEBUFFER alpha', url: mk('a') },
      ];
      try {
        const serialUrl = canvas.toDataURL('image/png');
        thumbs.push({ label: 'BROWSER-SERIALIZED canvas (toDataURL, same task)', url: serialUrl });
        const img = new Image();
        img.onload = () => {
          inSnap.active = true;
          try {
            const c3 = document.createElement('canvas');
            c3.width = w;
            c3.height = h;
            const x3 = c3.getContext('2d', { willReadFrequently: true });
            if (!x3) return;
            x3.drawImage(img, 0, 0);
            const px = x3.getImageData(0, 0, w, h);
            const sm = analyzeFb(px.data, w, h, false, fb.maskBBox);
            sample.serialTxt = sm.txt;
            sample.serialDiff =
              `raw a0RGB=${m.rgbA0Cnt} out=${m.outCnt} spill=${m.spillCnt} rect=${m.rect ? 'YES' : 'no'}` +
              ` | serial a0RGB=${sm.rgbA0Cnt} out=${sm.outCnt} spill=${sm.spillCnt} rect=${sm.rect ? 'YES' : 'no'}`;
          } catch {
            /* ignore */
          } finally {
            inSnap.active = false;
          }
        };
        img.src = serialUrl;
      } catch {
        /* ignore */
      }
      sample.thumbs = thumbs;
    } catch {
      /* ignore */
    } finally {
      inSnap.active = false;
    }
  }
  fb.samples.push(sample);
  if (fb.samples.length > 40) fb.samples.splice(0, fb.samples.length - 40);
}

function layerDump(): string {
  const c = document.querySelector('.hero__mark canvas');
  if (!(c instanceof HTMLCanvasElement)) return 'canvas: not mounted';
  const lines: string[] = [];
  let el: Element | null = c;
  for (let d = 0; el && d < 7; d++, el = el.parentElement) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const cls =
      typeof el.className === 'string' && el.className
        ? el.className.split(/\s+/).slice(0, 2).join('.')
        : el.tagName.toLowerCase();
    lines.push(
      `${d} ${el.tagName.toLowerCase()}.${cls} ${r.width.toFixed(1)}x${r.height.toFixed(1)}` +
      ` @(${r.left.toFixed(1)},${r.top.toFixed(1)})` +
      ` bg=${cs.backgroundColor} op=${cs.opacity} filter=${cs.filter}` +
      ` blend=${cs.mixBlendMode} iso=${cs.isolation} radius=${cs.borderRadius}` +
      ` overflow=${cs.overflow} clip=${cs.clipPath} tf=${cs.transform === 'none' ? 'none' : 'YES'}` +
      ` willChange=${cs.willChange} contain=${cs.contain}`,
    );
  }
  const cv = c;
  const attrs = cv.getContext('webgl2')?.getContextAttributes();
  lines.push(
    `canvas backing=${cv.width}x${cv.height} css=${cv.clientWidth}x${cv.clientHeight}` +
    ` dpr=${window.devicePixelRatio} ctx=${attrs ? JSON.stringify(attrs) : 'null'}`,
  );
  return lines.join('\n');
}

/* Production issues exactly two draw calls, both drawArrays(TRIANGLE_STRIP). */
const nativeDrawArrays = WebGL2RenderingContext.prototype.drawArrays;
WebGL2RenderingContext.prototype.drawArrays = function (
  this: WebGL2RenderingContext,
  ...a: unknown[]
): unknown {
  const r = nativeDrawArrays.apply(this, a as never);
  try {
    fbNoteDraw(this);
  } catch {
    /* never disturb rendering */
  }
  return r;
} as unknown as typeof WebGL2RenderingContext.prototype.drawArrays;

/* ---- React harness: exact Hero wordmark over the exact site background ---- */
const COMPACT_QUERY = '(max-width: 720px)';

type CtxMode = 'default' | 'opaque' | 'premult';

function mergeFor(mode: CtxMode): Record<string, unknown> | null {
  if (mode === 'opaque') return { alpha: false };
  if (mode === 'premult') return { alpha: true, premultipliedAlpha: true };
  return null;
}

function Diag2() {
  const [instance, setInstance] = useState(0);
  const [running, setRunning] = useState(false);
  const [ctxMode, setCtxMode] = useState<CtxMode>('default');
  const [backdrop, setBackdrop] = useState<'real' | 'checker'>('real');
  const [speed, setSpeed] = useState<'1' | '0.25'>('1');
  const [compact, setCompact] = useState(() => window.matchMedia(COMPACT_QUERY).matches);
  const [readout, setReadout] = useState('tap Start to mount the production wordmark');
  const [snaps, setSnaps] = useState<string[]>([]);
  const [stages, setStages] = useState<DiagStage[]>([]);

  useEffect(() => {
    const q = window.matchMedia(COMPACT_QUERY);
    const onChange = () => setCompact(q.matches);
    q.addEventListener('change', onChange);
    return () => q.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!running) return;
    let timer = 0;
    const collect = () => {
      const canvas = document.querySelector('.hero__mark canvas');
      let text = '';
      try {
        const dpr = window.devicePixelRatio;
        text += `viewport : ${window.innerWidth}x${window.innerHeight} @ dpr ${dpr}\n`;
        text += `UA       : ${navigator.userAgent.slice(0, 120)}\n`;
        if (canvas instanceof HTMLCanvasElement) {
          const r = canvas.getBoundingClientRect();
          text += `mark CSS : ${r.width.toFixed(1)}x${r.height.toFixed(1)} at (${r.left.toFixed(1)}, ${r.top.toFixed(1)})\n`;
          text += `backing  : ${canvas.width}x${canvas.height}\n`;
          const gl = canvas.getContext('webgl2');
          text += `granted  : ${gl ? JSON.stringify(gl.getContextAttributes()) : 'no context'}\n`;
          if (gl) {
            text += `drawbuf  : ${gl.drawingBufferWidth}x${gl.drawingBufferHeight}\n`;
          }
        } else {
          text += 'canvas   : not mounted\n';
        }
        const fonts = document.fonts;
        text += `font loaded: ${
          fonts && fonts.check('342px "ReactDrops Square Display"') ? 'yes' : fonts ? 'pending' : 'n/a'
        }\n`;
        text += `uploads  : ${JSON.stringify(diagWindow.__diagUploads)}\n`;
        text += `mode     : ctx=${ctxMode} backdrop=${backdrop} speed=${speed}\n`;
        const st = diagWindow.__diagStages ?? [];
        const rect = st.find((s) => s.rectFlag);
        text += `stages   : ${st.length} recorded; first FULL-RECT: ${
          rect ? `S${rect.n} [${rect.tag}] ${rect.op}` : 'none'
        }\n`;
        const fbs = fb.samples;
        const lastFb = fbs[fbs.length - 1];
        text += `fb       : ${fbs.length} samples (manual ${
          fbs.filter((s) => s.kind === 'manual').length
        })${lastFb ? `; last t=${lastFb.t}ms RGBrect=${lastFb.rect ? 'YES' : 'no'}` : ''}\n`;
      } catch (e) {
        text += `probe error: ${String(e)}`;
      }
      setReadout(text);
      setStages([...(diagWindow.__diagStages ?? [])]);
      if (diagWindow.__diagSnaps) setSnaps([...diagWindow.__diagSnaps].slice(-2));
    };
    timer = window.setInterval(collect, 500);
    collect();
    return () => window.clearInterval(timer);
  }, [running, ctxMode, backdrop, speed, instance]);

  const start = () => {
    diagWindow.__diagGLMerge = mergeFor(ctxMode);
    diagWindow.__diagSpeed = Number(speed);
    diagWindow.__diagUploads = [];
    diagWindow.__diagSnaps = [];
    diagWindow.__diagStages = [];
    canvasTagsReset();
    fb.samples = [];
    fb.t0 = 0;
    fb.lastAuto = 0;
    fb.force = false;
    fb.maskBBox = null;
    fb.canvas = null;
    fb.gl = null;
    setSnaps([]);
    setStages([]);
    setInstance((i) => i + 1);
    setRunning(true);
  };

  const captureFrame = () => {
    fb.force = true;
    // The production loop idles once the beam settles; nudge it for one more
    // frame (same state, same draw path) so a capture can always happen.
    window.setTimeout(() => {
      if (!fb.force) return;
      try {
        document.dispatchEvent(new Event('visibilitychange'));
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        if (!fb.force) return;
        try {
          document.dispatchEvent(new Event('visibilitychange'));
        } catch {
          /* ignore */
        }
      }, 250);
    }, 120);
  };

  const copy = () => {
    const head = `diag readout\n============\n${readout}\n`;
    const body = stages
      .map(
        (s) =>
          `S${s.n} [${s.tag}] ${s.op}${s.detail ? ` (${s.detail})` : ''}${
            s.rectFlag ? '  << FULL-RECT' : ''
          }\n   ${s.metrics}`,
      )
      .join('\n');
    const fbBody = fb.samples
      .map(
        (s, i) =>
          `FB${i + 1} [${s.kind}] t=${s.t}ms ${s.size}${s.rect ? '  << RGB FULL-RECT' : ''}\n   ${s.txt}` +
          (s.serialTxt ? `\n   serial: ${s.serialTxt}` : '') +
          (s.serialDiff ? `\n   diff: ${s.serialDiff}` : ''),
      )
      .join('\n');
    const text =
      `${head}--- stage timeline ---\n${body}\n` +
      `--- final framebuffer (same-task readPixels) ---\n${fbBody}\n` +
      `--- canvas / layer dump ---\n${layerDump()}\n`;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="diag2-hud">
        <b>diag v2.2 — production wordmark + stage sequencer + framebuffer probe</b>
        <div className="diag2-row">
          <span>context attrs (applies on Start/Replay):</span>
          <label className="diag2-radio">
            <input
              type="radio"
              name="ctx"
              checked={ctxMode === 'default'}
              onChange={() => setCtxMode('default')}
            />
            default
          </label>
          <label className="diag2-radio">
            <input
              type="radio"
              name="ctx"
              checked={ctxMode === 'opaque'}
              onChange={() => setCtxMode('opaque')}
            />
            alpha:false
          </label>
          <label className="diag2-radio">
            <input
              type="radio"
              name="ctx"
              checked={ctxMode === 'premult'}
              onChange={() => setCtxMode('premult')}
            />
            premul:true
          </label>
        </div>
        <div className="diag2-row">
          <span>backdrop:</span>
          <label className="diag2-radio">
            <input
              type="radio"
              name="bg"
              checked={backdrop === 'real'}
              onChange={() => setBackdrop('real')}
            />
            real site background
          </label>
          <label className="diag2-radio">
            <input
              type="radio"
              name="bg"
              checked={backdrop === 'checker'}
              onChange={() => setBackdrop('checker')}
            />
            checkerboard
          </label>
          <span>reveal speed:</span>
          <label className="diag2-radio">
            <input
              type="radio"
              name="sp"
              checked={speed === '1'}
              onChange={() => setSpeed('1')}
            />
            1x
          </label>
          <label className="diag2-radio">
            <input
              type="radio"
              name="sp"
              checked={speed === '0.25'}
              onChange={() => setSpeed('0.25')}
            />
            0.25x
          </label>
        </div>
        <div className="diag2-row">
          <button type="button" onClick={start}>
            {running ? 'Replay (rebuild masks + reveal again)' : 'Start'}
          </button>
          <button type="button" onClick={captureFrame}>
            Capture frame (next draw)
          </button>
          <button type="button" onClick={copy}>
            Copy readout (incl. framebuffer + timeline)
          </button>
        </div>
        <pre className="diag2-readout">{readout}</pre>
        <div className="diag2-thumbs">
          {snaps.map((u, i) => (
            <figure key={i} className="diag2-thumb">
              <img src={u} alt="raw upload source" />
              <figcaption>{i === 0 ? 'raw MASK upload' : 'raw GLOW upload (full-alpha by design)'}</figcaption>
            </figure>
          ))}
        </div>
        <ol className="diag2-stages">
          {stages.map((s) => (
            <li
              key={s.n}
              className={`diag2-stage${s.rectFlag ? ' diag2-rect' : ''}`}
            >
              <div className="diag2-stage-head">
                S{s.n} [{s.tag}] {s.op}
                {s.detail ? ` (${s.detail})` : ''}
                {s.rectFlag ? '  << FULL-RECT CONTENT' : ''}
              </div>
              {s.metrics ? <div className="diag2-stage-metrics">{s.metrics}</div> : null}
              <div className="diag2-thumbrow">
                {s.thumbs.map((t, i) => (
                  <figure key={i} className="diag2-thumb">
                    <img src={t.url} alt={t.label} />
                    <figcaption>{t.label}</figcaption>
                  </figure>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <h4 className="diag2-subhead">final framebuffer — same-task readPixels (ground truth before compositing)</h4>
        <ol className="diag2-stages">
          {fb.samples.map((s, i) => (
            <li
              key={`fb${i}`}
              className={`diag2-stage${s.rect ? ' diag2-rect' : ''}`}
            >
              <div className="diag2-stage-head">
                FB{i + 1} [{s.kind}] t={s.t}ms {s.size}
                {s.rect ? '  << RGB FULL-RECT (alpha≈0)' : ''}
              </div>
              <div className="diag2-stage-metrics">{s.txt}</div>
              {s.serialTxt ? (
                <div className="diag2-stage-metrics">serialized: {s.serialTxt}</div>
              ) : null}
              {s.serialDiff ? (
                <div className="diag2-stage-metrics">{s.serialDiff}</div>
              ) : null}
              <div className="diag2-thumbrow">
                {(s.thumbs ?? []).map((t, j) => (
                  <figure key={j} className="diag2-thumb">
                    <img src={t.url} alt={t.label} />
                    <figcaption>{t.label}</figcaption>
                  </figure>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <details className="diag2-tip">
          <summary>canvas / layer dump (also included in Copy)</summary>
          <pre className="diag2-readout">{layerDump()}</pre>
        </details>
        <p className="diag2-tip">
          FB rows are the raw WebGL framebuffer read in the same task as the draw, before
          Safari composites anything. <b>A</b> = alpha stats; <b>a0RGB</b> = pixels whose
          alpha&lt;2 but whose RGB is non-zero — the shader's exterior branch writes
          spillColor RGB under near-zero alpha by design, so a light rectangle in the
          "RGB (alpha forced)" thumb is expected on every engine; what matters is whether
          your iPhone's numbers match desktop. <b>rect=YES</b> flags a full-canvas RGB
          rectangle. Use <b>Capture frame</b> during the L reveal (0.25x helps) and after
          LOCH settles to compare the two states; the serialized row re-measures the
          browser's own toDataURL output.
        </p>
        <p className="diag2-tip">
          GLOW canvases are full-canvas opaque BY DESIGN (alpha forced to 255 during the
          repack on every engine) — a boxy GLOW <em>alpha</em> look is expected, not a finding.
          MASK <b>alpha</b> maps and the numeric lines are the texture-side checks; the FB
          rows above are the final-pixel check. Tap Replay to rebuild masks; the stage
          sequencer records every step.
        </p>
      </div>
      {backdrop === 'real' ? <SiteBackground /> : <div className="diag2-checker" />}
      <section className="hero" id="top" aria-label="Introduction">
        <div className="container hero__content">
          <div className="hero__mark-wrap">
            {running && (
              <RefractedText
                key={instance}
                className="hero__mark"
                text="LOCH"
                theme="dark"
                reveal
                stagger={0.45}
                liftDuration={1.6}
                ease="power4.out"
                animateBeam
                openingDuration={5}
                duration={12.5}
                intensity={1.15}
                dispersion={1}
                colorIntensity={0.9}
                beamColor="#1670BB"
                topColor="#E7E6E7"
                bottomColor={compact ? '#5C6C88' : '#303A59'}
                fontSize="clamp(72px, 16vw, 210px)"
                fontFamily="'ReactDrops Square Display', 'Space Grotesk', sans-serif"
                fontWeight={900}
                letterSpacing="-0.02em"
                extraBold={compact ? 2.8 : 2.1}
                fontHeight={78}
                cornerRounding={1}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* Reset the canvas tag machine so a fresh Start re-tags from scratch. */
function canvasTagsReset() {
  genSeen = 0;
  stageN = 0;
}

const host = document.getElementById('diag2-root');
if (host) createRoot(host).render(<Diag2 />);
