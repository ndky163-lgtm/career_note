"use client";

import type { Advisor } from "@/lib/advisors";
import { Reveal } from "./Reveal";

export function AdvisorCard({
  advisor: a,
  delay = 0,
  onOpen,
}: {
  advisor: Advisor;
  delay?: number;
  onOpen: (a: Advisor) => void;
}) {
  return (
    <Reveal
      as="button"
      className="adv-card"
      delay={delay}
      type="button"
      aria-label={`${a.name}さんの物語を読む`}
      onClick={() => onOpen(a)}
    >
      <span className="thumb">
        <img src={a.img} alt={`${a.name}さんのポートレート（架空サンプル）`} loading="lazy" decoding="async" />
      </span>
      <span className="cbody">
        <span className="thought">「{a.thought}」</span>
        <span className="who">
          <span className="nm">{a.name}</span>
          <span className="meta">
            {a.gender}・{a.age}歳 ／ 相談歴{a.years}年
          </span>
        </span>
        <span className="tags">
          <span className="tag hot">{a.theme}</span>
          <span className="tag">{a.area}</span>
          <span className="tag">{a.format}</span>
          <span className="tag">{a.type}</span>
        </span>
        <span className="read-more">
          物語を読む <span className="arr">→</span>
        </span>
      </span>
    </Reveal>
  );
}
