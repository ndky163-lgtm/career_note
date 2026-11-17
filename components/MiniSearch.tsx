"use client";

import { useState } from "react";
import { THEMES } from "@/lib/advisors";
import { Reveal } from "./Reveal";

export function MiniSearch({ onSearch }: { onSearch: (theme: string, keyword: string) => void }) {
  const [theme, setTheme] = useState("");
  const [keyword, setKeyword] = useState("");

  const run = () => onSearch(theme, keyword);

  return (
    <Reveal className="mini-search">
      <h3>気になるテーマから探す</h3>
      <p>まずはテーマとキーワードだけ。詳しい絞り込みは一覧ページでできます。</p>
      <div className="chips" role="group" aria-label="テーマ">
        {["", ...THEMES].map((t) => (
          <button
            key={t || "all"}
            type="button"
            className={`chip${theme === t ? " active" : ""}`}
            aria-pressed={theme === t}
            onClick={() => setTheme(t)}
          >
            {t || "すべて"}
          </button>
        ))}
      </div>
      <div className="search-row">
        <input
          type="search"
          value={keyword}
          placeholder="名前・キーワードで探す（例：復職、リーダー）"
          aria-label="キーワード"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
          }}
        />
        <button type="button" className="btn btn-orange" onClick={run}>
          この条件で探す <span className="arr">→</span>
        </button>
      </div>
    </Reveal>
  );
}
