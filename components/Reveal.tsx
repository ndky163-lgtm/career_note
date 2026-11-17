"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ *
 * Reveal: fade + float-up on enter (KDDI Biz Edge style).
 *  - IntersectionObserver is the primary trigger.
 *  - A viewport-bounded safety net (timers + scroll/resize listeners)
 *    guarantees that anything on screen or already scrolled past never
 *    stays transparent. Elements still below the fold keep waiting.
 *  - prefers-reduced-motion: shown immediately.
 * ------------------------------------------------------------------ */

type Item = { el: Element; show: () => void };

const pending = new Set<Item>();
const byElement = new Map<Element, Item>();
let observer: IntersectionObserver | null = null;
let listening = false;
let ticking = false;

function reveal(item: Item) {
  if (!pending.has(item)) return;
  pending.delete(item);
  byElement.delete(item.el);
  observer?.unobserve(item.el);
  item.show();
  if (pending.size === 0) detach();
}

/** strict: on screen (or just above); loose: anything already on screen or scrolled past. */
function check(strict: boolean) {
  const vh = window.innerHeight || 900;
  Array.from(pending).forEach((item) => {
    const r = item.el.getBoundingClientRect();
    if (strict ? r.top < vh * 0.94 && r.bottom > -80 : r.top < vh) reveal(item);
  });
}

let scheduled = false;
function scheduleCheck() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    check(true);
  });
}

function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    check(true);
  });
}

function attach() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
}

function detach() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", onScrollOrResize);
  window.removeEventListener("resize", onScrollOrResize);
}

function getObserver(): IntersectionObserver | null {
  if (observer) return observer;
  if (typeof IntersectionObserver === "undefined") return null;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const item = byElement.get(en.target);
        if (item) reveal(item);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 12% 0px" },
  );
  return observer;
}

function register(el: Element, show: () => void): () => void {
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = getObserver();
  if (reduce || !io) {
    show();
    return () => {};
  }
  const item: Item = { el, show };
  pending.add(item);
  byElement.set(el, item);
  io.observe(el);
  attach();
  // Safety net (viewport-bounded).
  scheduleCheck();
  window.setTimeout(() => check(true), 350);
  window.setTimeout(() => check(true), 1200);
  window.setTimeout(() => check(false), 3500);
  window.setTimeout(() => check(false), 9000);
  return () => {
    pending.delete(item);
    byElement.delete(el);
    io.unobserve(el);
    if (pending.size === 0) detach();
  };
}

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Fixed transition delay in seconds (otherwise a surrounding RevealGroup staggers by 0.1s). */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
} & Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "children">;

export function Reveal<T extends ElementType = "div">({
  as,
  delay,
  className,
  style,
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as || "div") as ElementType;
  const [on, setOn] = useState(false);
  const cleanup = useRef<(() => void) | null>(null);

  const ref = useCallback((el: Element | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (el) cleanup.current = register(el, () => setOn(true));
  }, []);

  const merged: CSSProperties | undefined =
    delay !== undefined ? ({ ...style, "--rv-d": `${delay}s` } as CSSProperties) : style;

  return (
    <Tag
      ref={ref}
      className={`rv${on ? " on" : ""}${className ? " " + className : ""}`}
      style={merged}
      data-rv-fixed={delay !== undefined ? "" : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Staggers the `.rv` descendants by 0.1s each (unless they carry a fixed delay). */
export function RevealGroup({
  as,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">) {
  const Tag = (as || "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    g.querySelectorAll<HTMLElement>(".rv:not([data-rv-fixed])").forEach((k, i) => {
      k.style.setProperty("--rv-d", `${i * 0.1}s`);
    });
  });

  return (
    <Tag ref={ref} className={`rv-group${className ? " " + className : ""}`} {...rest}>
      {children}
    </Tag>
  );
}
