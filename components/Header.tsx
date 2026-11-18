"use client";

import { SITE } from "@/lib/site";
import type { NavFn } from "@/lib/nav";

export function Header({ onNav }: { onNav: NavFn }) {
  return (
    <header className="site">
      <div className="header-in">
        <button type="button" className="logo" aria-label="トップへ" onClick={() => onNav("top")}>
          <span className="logo-jp">
            {SITE.nameJpHead}
            <em>{SITE.nameJpTail}</em>
          </span>
          <span className="logo-en">{SITE.nameEn}</span>
        </button>
        <nav className="main-nav" aria-label="メインナビゲーション">
          <button type="button" onClick={() => onNav("top", "message")}>
            私たちの想い
          </button>
        </nav>
        <button type="button" className="btn btn-orange btn-sm header-cta" onClick={() => onNav("list")}>
          アドバイザーを探す <span className="arr">→</span>
        </button>
      </div>
    </header>
  );
}
