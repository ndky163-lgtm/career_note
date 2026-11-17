"use client";

import { SITE, SITE_NAME_JP_PROVISIONAL } from "@/lib/site";
import type { NavFn } from "@/lib/nav";

export function Footer({ onNav }: { onNav: NavFn }) {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ padding: 0 }}>
              <span className="logo-jp">
                {SITE.nameJpHead}
                <em style={{ fontStyle: "normal", color: "var(--orange)" }}>{SITE.nameJpTail}</em>
              </span>
              <span className="logo-en">{SITE.nameEn}</span>
            </div>
            <p className="foot-note" style={{ marginTop: 16 }}>
              {SITE_NAME_JP_PROVISIONAL}
              は、想いを持ったキャリアアドバイザーをインタビュー記事で紹介するサイトです。掲載にあたっては全員に取材を行い、本人の同意を得て公開しています。
            </p>
          </div>
          <div className="foot-links">
            <button type="button" onClick={() => onNav("top", "message")}>
              私たちの想い
            </button>
            <button type="button" onClick={() => onNav("list")}>
              アドバイザー一覧
            </button>
            <button type="button" onClick={() => onNav("top", "together")}>
              共に、見つけよう
            </button>
          </div>
        </div>
        <p className="foot-note" style={{ marginTop: 26 }}>
          ※ このページに登場するアドバイザーはすべて架空のサンプル人物です。氏名・経歴・写真（イラスト）は実在の人物とは関係ありません。相談の申込は、申込文を作成してコピーする形式で、外部への送信は行われません。
        </p>
        <p className="copyright">
          © {SITE.nameEnTitle}
          {SITE.provisional}運営事務局
        </p>
      </div>
    </footer>
  );
}
