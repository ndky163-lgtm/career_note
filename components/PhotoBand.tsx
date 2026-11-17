"use client";

import { FlowLines, type FlowSvg } from "./FlowLines";

const BAND: { src: string; alt: string }[] = [
  { src: "/images/band-1.webp", alt: "明るいラウンジのソファで笑顔で話し合う男女の写真風画像" },
  { src: "/images/band-2.webp", alt: "明るいワークスペースでタブレットを見て微笑む女性の写真風画像" },
  { src: "/images/band-3.webp", alt: "明るい工房の作業台で誰かと笑顔で話す男性の写真風画像" },
  { src: "/images/band-4.webp", alt: "明るいオフィスのデスク越しに笑い合う女性二人の写真風画像" },
];

const LINES: FlowSvg[] = [
  {
    viewBox: "0 0 1200 500",
    width: 50,
    d: "M-366 268 C 150 216, 520 320, 880 250 C 1150 200, 1400 300, 1580 240",
  },
];

/** Infinite marquee: two identical sets on one track, translateX(-50%) in 38s. */
export function PhotoBand() {
  return (
    <div className="band-wrap has-lines">
      <FlowLines svgs={LINES} />
      <div className="band-row">
        <div className="band-track">
          <div className="band-set">
            {BAND.map((b) => (
              <figure key={b.src}>
                <img src={b.src} alt={b.alt} decoding="async" />
              </figure>
            ))}
          </div>
          <div className="band-set" aria-hidden="true">
            {BAND.map((b) => (
              <figure key={b.src}>
                <img src={b.src} alt="" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
