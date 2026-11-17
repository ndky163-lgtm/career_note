"use client";

import { ADVISORS, type Advisor } from "@/lib/advisors";
import type { NavFn } from "@/lib/nav";
import { AdvisorCard } from "./AdvisorCard";
import { FlowLines, type FlowSvg } from "./FlowLines";
import { Hero } from "./Hero";
import { MiniSearch } from "./MiniSearch";
import { PhotoBand } from "./PhotoBand";
import { Reveal, RevealGroup } from "./Reveal";

const L_MESSAGE: FlowSvg[] = [
  {
    viewBox: "0 0 1200 700",
    width: 48,
    tone: "light",
    d: "M1580 610 C 1330 578, 1080 644, 820 602 C 520 556, 160 638, -366 598",
  },
];
const L_FORYOU: FlowSvg[] = [
  {
    viewBox: "0 0 1200 700",
    width: 46,
    tone: "deep",
    d: "M-366 470 C 150 340, 520 580, 880 420 C 1150 300, 1400 500, 1580 400",
  },
];
const L_STORIES: FlowSvg[] = [
  {
    viewBox: "0 0 1200 700",
    width: 50,
    d: "M1580 430 C 1300 320, 1050 540, 760 400 C 460 260, 120 520, -366 380",
  },
];
const L_TOGETHER: FlowSvg[] = [
  {
    viewBox: "0 0 1200 600",
    width: 48,
    tone: "light",
    d: "M-366 528 C 200 492, 600 558, 1000 516 C 1250 488, 1450 540, 1580 520",
  },
];
const L_SEARCH: FlowSvg[] = [
  {
    viewBox: "0 0 1200 500",
    width: 44,
    tone: "deep",
    d: "M1580 422 C 1330 390, 1080 448, 820 414 C 520 378, 160 440, -366 406",
  },
];

const FOR_YOU = [
  {
    num: "01",
    title: "想いを持つ人を集める",
    body: "実績よりも、誰かを支えたいという理由を大切に。本当に寄り添える人のみを、私たちは紹介します。",
  },
  {
    num: "02",
    title: "一人ひとりの物語を届ける",
    body: "すべてのプロフィールは、丁寧な取材記事として公開。その人らしさが伝わる言葉やストーリーをお届けします。",
  },
  {
    num: "03",
    title: "安心して相談できる約束",
    body: "身元は確認済み。実績は確認済み。公開は本人の同意のもと、安心して、最初の一歩を。",
  },
];

export function TopView({
  onNav,
  onOpenAdvisor,
  onSearch,
}: {
  onNav: NavFn;
  onOpenAdvisor: (a: Advisor) => void;
  onSearch: (theme: string, keyword: string) => void;
}) {
  return (
    <div className="view" id="view-top">
      <Hero />

      <section className="blk has-lines" id="message" style={{ paddingTop: 40 }}>
        <FlowLines svgs={L_MESSAGE} />
        <RevealGroup className="wrap">
          <Reveal className="sec-head">
            <span className="jp-label">私たちの想い</span>
            <span className="en">Our Message</span>
          </Reveal>
          <h2 className="message-quote">
            <Reveal as="span" style={{ display: "block" }}>
              「この人に相談したい」
            </Reveal>
            <Reveal as="span" className="hl" style={{ display: "block" }}>
              その出会いを、届けたい。
            </Reveal>
          </h2>
          <div className="message-body">
            <Reveal as="p">私たちが紹介するのは、会社ではありません。アドバイザーという一人の人です。</Reveal>
            <Reveal as="p">これまでの経験、悩んだ時間、誰かに寄り添いたいと思ったきっかけ。</Reveal>
            <Reveal as="p">私たちは全員にインタビューをし、言葉を聞き、許可を得てから記事として公開しています。</Reveal>
            <Reveal as="p">
              肩書きや経歴だけで選ぶのではなく、言葉や想いに共感して、あなたが相談したい人を選べるように。
            </Reveal>
          </div>
        </RevealGroup>
      </section>

      <PhotoBand />

      <section className="blk has-lines" id="foryou">
        <FlowLines svgs={L_FORYOU} />
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="jp-label">あなたのために</span>
            <span className="en">For You</span>
          </Reveal>
          <RevealGroup className="foryou">
            {FOR_YOU.map((f) => (
              <Reveal as="article" className="fy-card" key={f.num}>
                <div className="num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="blk has-lines" id="stories" style={{ paddingTop: 20 }}>
        <FlowLines svgs={L_STORIES} />
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="big">想いを読む</span>
            <span className="en">Advisor Stories</span>
          </Reveal>
          <Reveal as="p" style={{ color: "var(--sub)", maxWidth: 680, margin: "-18px 0 36px", fontWeight: 700 }}>
            肩書きの前に、その人の言葉を。気になる一文があったら、物語の続きを読んでみてください。
          </Reveal>
          <div className="adv-grid">
            {ADVISORS.slice(0, 6).map((a, i) => (
              <AdvisorCard key={a.id} advisor={a} delay={(i % 3) * 0.1} onOpen={onOpenAdvisor} />
            ))}
          </div>
          <Reveal className="center-row">
            <button type="button" className="btn btn-dark" onClick={() => onNav("list")}>
              アドバイザーをすべて見る <span className="arr">→</span>
            </button>
          </Reveal>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 110 }}>
        <Reveal className="closing-photo">
          <img
            src="/images/closing.webp"
            alt="屋外のテラスでテーブルを囲み、笑顔で話し合う3人の写真風画像"
            loading="lazy"
            decoding="async"
          />
        </Reveal>
      </div>

      <section id="together" className="has-lines" style={{ paddingBottom: 120 }}>
        <FlowLines svgs={L_TOGETHER} />
        <div className="wrap">
          <Reveal className="together">
            <svg className="deco" viewBox="0 0 400 400" fill="none" aria-hidden="true">
              <path d="M-20 300 Q 200 60 420 260" stroke="#FF6B1A" strokeOpacity={0.4} strokeWidth={30} />
              <path d="M-20 350 Q 210 130 420 310" stroke="#FF8A3D" strokeOpacity={0.5} strokeWidth={22} />
              <path d="M-20 250 Q 190 20 420 210" stroke="#FFB37E" strokeOpacity={0.7} strokeWidth={18} />
            </svg>
            <span className="en">Together</span>
            <h2>共に、見つけよう。</h2>
            <p>
              答えは、誰かの中にあるのではありません。あなたの歩んできた道と、これから歩みたい道を、想いを持ったアドバイザーと一緒に整理し、一歩ずつ進めていきましょう。
            </p>
            <button type="button" className="btn btn-orange" onClick={() => onNav("list")}>
              アドバイザーを探す <span className="arr">→</span>
            </button>
          </Reveal>
        </div>
      </section>

      <section className="has-lines" style={{ paddingBottom: 130 }}>
        <FlowLines svgs={L_SEARCH} />
        <div className="wrap">
          <MiniSearch onSearch={onSearch} />
        </div>
      </section>
    </div>
  );
}
