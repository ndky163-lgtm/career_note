"use client";

import { memo, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 * Aim-style flowing lines.
 *  - Hidden until the line's section enters the screen.
 *  - Then draws forward once, time-based (~2.4s), the arrow head glued
 *    to the leading tip. Progress is monotonic: it never retracts, loops
 *    or redraws while the view stays mounted.
 *  - The line stops at the head's back plane so the round cap stays
 *    inside the head silhouette (no lumps).
 *  - prefers-reduced-motion: fully drawn from the start.
 * ------------------------------------------------------------------ */

export type FlowSvg = {
  viewBox: string;
  d: string;
  width: number;
  tone?: "light" | "deep";
};

type Pt = { x: number; y: number };

type FlowItem = {
  path: SVGPathElement;
  head: SVGPathElement;
  len: number;
  seg: number;
  vis: number;
  trig: boolean;
  startT: number;
  base: number;
  back: number;
  samples: Pt[];
  reduce: boolean;
};

const DRAW_MS = 2400;
const items = new Set<FlowItem>();
let raf = 0;
let resizeBound = false;

/** Desired on-screen px (≈6vw, clamped 44–100) converted to viewBox units via the slice scale. */
function flowBaseWidth(p: SVGPathElement): number {
  const desired = Math.max(44, Math.min(100, (window.innerWidth || 1200) * 0.06));
  const svg = p.ownerSVGElement;
  if (svg && svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) {
    const r = svg.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      const sc = Math.max(r.width / svg.viewBox.baseVal.width, r.height / svg.viewBox.baseVal.height);
      if (sc > 0) return Math.max(30, Math.min(160, desired / sc));
    }
  }
  return desired;
}

/** Position + tangent angle at a path length, from the table sampled once at init. */
function flowPointAt(it: FlowItem, len: number) {
  const s = it.samples;
  const N = s.length - 1;
  const f = Math.max(0, Math.min(1, len / it.len)) * N;
  const i = Math.min(N - 1, Math.floor(f));
  const fr = f - i;
  const a = s[i];
  const b = s[i + 1];
  return {
    x: a.x + (b.x - a.x) * fr,
    y: a.y + (b.y - a.y) * fr,
    ang: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

/** Render one frame from the draw progress `vis` (0..1). */
function setFlowFrame(it: FlowItem) {
  const { path: p, head } = it;
  const seg = it.seg * it.vis;
  // Stop at the head's back plane so the round cap hides inside the head.
  const lineSeg = Math.max(0, seg - it.back);
  if (seg < 0.6) {
    // A "0 <len>" dash with a round cap would paint a stray dot, so stay hidden.
    p.style.strokeDasharray = "0 " + it.len;
    p.style.strokeDashoffset = "0";
    p.style.visibility = "hidden";
    head.style.opacity = "0";
    return;
  }
  p.style.visibility = lineSeg >= 0.6 ? "visible" : "hidden";
  p.style.strokeDasharray = lineSeg.toFixed(1) + " " + (it.len - lineSeg).toFixed(1);
  p.style.strokeDashoffset = "0";
  const tp = flowPointAt(it, seg);
  head.setAttribute(
    "transform",
    "translate(" + tp.x.toFixed(1) + " " + tp.y.toFixed(1) + ") rotate(" + tp.ang.toFixed(1) + ") scale(" + it.base.toFixed(1) + ")",
  );
  head.style.opacity = "1";
}

function applySize(it: FlowItem) {
  it.base = flowBaseWidth(it.path);
  it.back = it.base * 0.8; // head back plane: local -0.8 x head scale
  it.path.style.strokeWidth = String(it.base);
}

function tick() {
  raf = 0;
  const vh = window.innerHeight || 900;
  const now = performance.now();
  let active = false;
  items.forEach((it) => {
    if (it.vis >= 1) return; // drawn: stays
    active = true;
    if (!it.trig) {
      const r = it.path.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh * 0.98) return;
      it.trig = true;
      it.startT = now;
    }
    it.vis = Math.min(1, (now - it.startT) / DRAW_MS);
    setFlowFrame(it);
  });
  if (active) raf = requestAnimationFrame(tick);
}

function kick() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function onResize() {
  items.forEach((it) => {
    applySize(it);
    if (it.vis > 0 || it.reduce) setFlowFrame(it);
  });
}

function registerLine(path: SVGPathElement, head: SVGPathElement, reduce: boolean): (() => void) | null {
  let len = 0;
  try {
    len = path.getTotalLength();
  } catch {
    return null;
  }
  if (!len) return null;

  const N = 240;
  const samples: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const sp = path.getPointAtLength((len * i) / N);
    samples.push({ x: sp.x, y: sp.y });
  }

  const it: FlowItem = {
    path,
    head,
    len,
    seg: len * 0.85, // long segment: most of the path
    vis: 0,
    trig: false,
    startT: 0,
    base: 50,
    back: 40,
    samples,
    reduce,
  };
  applySize(it);

  if (reduce) {
    it.vis = 1;
    it.trig = true;
    setFlowFrame(it);
  } else {
    path.style.strokeDasharray = "0 " + len;
    path.style.strokeDashoffset = "0";
    path.style.visibility = "hidden";
    head.style.opacity = "0";
  }

  items.add(it);
  if (!resizeBound) {
    resizeBound = true;
    window.addEventListener("resize", onResize, { passive: true });
  }
  if (!reduce) kick();

  return () => {
    items.delete(it);
    if (items.size === 0 && resizeBound) {
      resizeBound = false;
      window.removeEventListener("resize", onResize);
    }
  };
}

/** Rounded triangle pointing along +x; 1 unit = the line's stroke width. */
const HEAD_D = "M 0.95 0 L -0.8 0.95 Q -1.02 0 -0.8 -0.95 Z";

function FlowLinesImpl({ svgs, stack }: { svgs: FlowSvg[]; stack?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    el.querySelectorAll("svg").forEach((svg) => {
      const path = svg.querySelector<SVGPathElement>(".flow-path");
      const head = svg.querySelector<SVGPathElement>(".flow-head");
      if (!path || !head) return;
      const c = registerLine(path, head, reduce);
      if (c) cleanups.push(c);
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div ref={root} className={`flow-lines${stack ? " stack" : ""}`} aria-hidden="true">
      {svgs.map((s, i) => {
        const tone = s.tone ? ` fp-${s.tone}` : "";
        return (
          <svg key={i} viewBox={s.viewBox} preserveAspectRatio="xMidYMid slice">
            <path className={`flow-path${tone}`} strokeWidth={s.width} d={s.d} />
            <path className={`flow-head${tone}`} strokeWidth={0.3} d={HEAD_D} />
          </svg>
        );
      })}
    </div>
  );
}

export const FlowLines = memo(FlowLinesImpl);
