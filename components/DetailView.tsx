"use client";

import { ADVISORS, type Advisor } from "@/lib/advisors";
import type { NavFn } from "@/lib/nav";
import { AdvisorCard } from "./AdvisorCard";
import { Reveal, RevealGroup } from "./Reveal";

export function DetailView({
  advisor: a,
  onNav,
  onOpenAdvisor,
  onConsult,
}: {
  advisor: Advisor;
  onNav: NavFn;
  onOpenAdvisor: (a: Advisor) => void;
  onConsult: (a: Advisor) => void;
}) {
  const others = ADVISORS.filter((x) => x.id !== a.id).slice(0, 3);

  return (
    <div className="view" id="view-detail">
      <div className="wrap" id="detail-root">
        <div className="detail-hero">
          <button type="button" className="back-btn" onClick={() => onNav("list")}>
            ← アドバイザー一覧へ戻る
          </button>
          <Reveal className="detail-photo">
            <img src={a.img} alt={`${a.name}さんのポートレート（架空サンプル）`} decoding="async" />
          </Reveal>
          <Reveal as="h1" className="detail-thought">
            「{a.thought}」
          </Reveal>
          <Reveal className="detail-name">
            <span className="nm">{a.name}</span>
            <span className="meta">
              {a.kana} ／ {a.gender}・{a.age}歳 ／ {a.type}
            </span>
          </Reveal>
          <Reveal as="p" style={{ marginTop: 20, maxWidth: 760, color: "var(--sub)", fontWeight: 700 }}>
            {a.lead}
          </Reveal>

          <article className="interview">
            <Reveal as="span" className="en" style={{ display: "block" }}>
              Interview
            </Reveal>
            <Reveal as="h3">{a.h1}</Reveal>
            <Reveal as="p">{a.p1}</Reveal>
            <Reveal as="p">{a.p2}</Reveal>
            <Reveal as="blockquote" className="big-quote">
              {a.quote}
            </Reveal>
            <Reveal as="h3">{a.h2}</Reveal>
            <Reveal as="p">{a.p3}</Reveal>
            <Reveal className="profile-box">
              <span className="en">Profile</span>
              <dl>
                {a.profile.map(([k, v]) => (
                  <div key={k} style={{ display: "contents" }}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </article>

          <Reveal className="empathy">
            <h2>{a.name}さんの想いに共感したら</h2>
            <p>
              肩書きではなく、言葉で選んだ出会いだからこそ、最初の一歩は小さくて大丈夫です。まずは申込文をつくるところから始めてみてください。
            </p>
            <button type="button" className="btn btn-orange" onClick={() => onConsult(a)}>
              {a.name}さんへの申込文をつくる <span className="arr">→</span>
            </button>
          </Reveal>

          <div className="others">
            <Reveal as="h2">ほかのアドバイザーの物語</Reveal>
            <RevealGroup className="adv-grid">
              {others.map((o, i) => (
                <AdvisorCard key={o.id} advisor={o} delay={(i % 3) * 0.1} onOpen={onOpenAdvisor} />
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
