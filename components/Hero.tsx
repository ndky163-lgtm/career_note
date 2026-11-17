"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, RevealGroup } from "./Reveal";

const PATTERNS: { arrow: string; photos: { pos: "l" | "c" | "r"; alt: string }[] }[] = [
  {
    arrow: "ha-o",
    photos: [
      { pos: "l", alt: "ガラス張りの明るいオフィスで、向かいの相談者に笑顔で話しかける女性の写真風画像" },
      { pos: "c", alt: "自宅のリビングで、家族と向かい合って自然に笑い合うカジュアルな服装の男性の写真風画像" },
      { pos: "r", alt: "明るいカフェの厨房でタブレットを持ち、同僚に話しかけるエプロン姿の女性の写真風画像" },
    ],
  },
  {
    arrow: "ha-t",
    photos: [
      { pos: "l", alt: "明るいオフィスで同僚と笑い合う男性の写真風画像" },
      { pos: "c", alt: "家庭のダイニングで、息子に夕ご飯のお皿を出す母親の写真風画像" },
      { pos: "r", alt: "明るいカフェで友人と笑い合う若い男性の写真風画像" },
    ],
  },
  {
    arrow: "ha-b",
    photos: [
      { pos: "l", alt: "小さな子どもと向き合い、優しく笑顔を見せる女性の写真風画像" },
      { pos: "c", alt: "ノートパソコンの前で相談者に笑顔で向き合うスーツ姿の男性の写真風画像" },
      { pos: "r", alt: "明るいオフィスの窓辺で外を眺める女性の写真風画像" },
    ],
  },
];

const HERO_INTERVAL = 6000;
const ARROW_LEAD_MS = 100;
const ARROW_GROW_MS = 1700;

/**
 * Hero arrow: ONE head, attached to the line's current tip from the start.
 * Each frame the line's dashoffset and the head's position/rotation are set
 * from the same progress, so the arrow grows toward the upper-right as one
 * piece. The line ends at the head's back-corner plane (data-back) so the
 * round cap stays inside the head silhouette.
 */
type ArrowEl = { line: SVGPathElement; head: SVGPathElement; len: number; back: number };

function collectArrows(root: HTMLElement): ArrowEl[] {
  const out: ArrowEl[] = [];
  root.querySelectorAll<SVGSVGElement>(".hero-arrow").forEach((svg) => {
    const line = svg.querySelector<SVGPathElement>(".ha-line");
    const head = svg.querySelector<SVGPathElement>(".ha-head");
    if (!line || !head) return;
    let len = 0;
    try {
      len = line.getTotalLength();
    } catch {
      return;
    }
    if (!len) return;
    out.push({ line, head, len, back: parseFloat(head.getAttribute("data-back") || "0") || 0 });
  });
  return out;
}

function setHeroProgress(arrows: ArrowEl[], pr: number) {
  const p = Math.max(0, Math.min(1, pr));
  arrows.forEach(({ line, head, len, back }) => {
    const d = Math.max(0.0005, p) * len;
    const drawn = Math.max(0, d - back);
    line.style.strokeDashoffset = String(1 - drawn / len);
    const pt = line.getPointAtLength(d);
    // Tangent from a short chord straddling the tip: an ahead-only sample
    // degenerates to atan2(0,0) = 0 at the path end.
    const pb = line.getPointAtLength(Math.max(0, d - 2));
    const pf = line.getPointAtLength(Math.min(len, d + 2));
    const ang = (Math.atan2(pf.y - pb.y, pf.x - pb.x) * 180) / Math.PI;
    head.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(2)})`);
  });
}

export function Hero() {
  const [idx, setIdx] = useState(0);
  const collage = useRef<HTMLDivElement>(null);

  // Auto-rotate; a manual switch re-arms the timer because idx changes.
  useEffect(() => {
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % PATTERNS.length), HERO_INTERVAL);
    return () => window.clearTimeout(t);
  }, [idx]);

  // Arrow grows once on every TOP show (mount); pattern switches only change colour.
  useEffect(() => {
    const root = collage.current;
    if (!root) return;
    const arrows = collectArrows(root);
    if (!arrows.length) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setHeroProgress(arrows, 1);
      return;
    }
    setHeroProgress(arrows, 0);
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      let t = (now - t0 - ARROW_LEAD_MS) / ARROW_GROW_MS;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      const e = 1 - Math.pow(1 - t, 3); // ease-out
      setHeroProgress(arrows, e);
      raf = t < 1 ? requestAnimationFrame(step) : 0;
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero has-lines">
      <RevealGroup className="wrap">
        <Reveal as="p" className="en hero-en">
          Career Note — Advisor Stories
        </Reveal>
        <Reveal className="collage" id="collage" aria-label="笑顔で対話する人たちの写真コラージュ">
          <div ref={collage} style={{ position: "absolute", inset: 0 }}>
            {PATTERNS.map((pat, pi) => (
              <div key={pi} className={`pattern${pi === idx ? " active" : ""}`} data-pattern={pi}>
                <svg
                  className={`hero-arrow ${pat.arrow}`}
                  viewBox="0 0 1600 560"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <path className="ha-line" pathLength={1} d="M-30 528 C 450 513, 900 508, 1251 497" />
                  <path
                    className="ha-head"
                    data-back="44"
                    transform="translate(-30 528) rotate(-1.8)"
                    d="M 66 0 L -44 54 Q -58 0 -44 -54 Z"
                  />
                </svg>
                {pat.photos.map((ph) => (
                  <div key={ph.pos} className={`ph ph-${ph.pos}`}>
                    <img
                      src={`/images/hero-${pi}-${ph.pos}.webp`}
                      alt={ph.alt}
                      loading={pi === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="hero-dots" role="group" aria-label="ヒーロー写真の切り替え">
          {PATTERNS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === idx ? "active" : undefined}
              aria-pressed={i === idx}
              onClick={() => setIdx(i)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </Reveal>
        <h1 className="hero-head">
          <Reveal as="span" style={{ display: "block" }}>
            キャリアの悩みは、
          </Reveal>
          <Reveal as="span" style={{ display: "block" }}>
            ひとりで抱えなくていい。
          </Reveal>
          <Reveal as="span" className="hl" style={{ display: "block" }}>
            あなたは、ひとりじゃない。
          </Reveal>
        </h1>
        <Reveal as="p" className="hero-intro">
          キャリアに向き合う時間は、誰かに話すことからはじまります。数字や実績だけでなく、その人の想いや価値観にふれて、あなたが「この人に相談したい」と思える相手を見つけてください。
        </Reveal>
        <Reveal className="scroll-ind">
          <span>Scroll</span>
          <span className="dn">↓</span>
        </Reveal>
      </RevealGroup>
    </section>
  );
}
