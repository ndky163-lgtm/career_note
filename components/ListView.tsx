"use client";

import { useMemo } from "react";
import {
  ADVISORS,
  AREAS,
  EMPTY_FILTERS,
  FORMATS,
  THEMES,
  TYPES,
  filterAdvisors,
  type Advisor,
  type Filters,
  type SortKey,
} from "@/lib/advisors";
import { AdvisorCard } from "./AdvisorCard";
import { FlowLines, type FlowSvg } from "./FlowLines";
import { Reveal } from "./Reveal";

const LINES: FlowSvg[] = [
  {
    viewBox: "0 0 1200 700",
    width: 54,
    tone: "deep",
    d: "M-366 520 C 150 430, 520 600, 880 480 C 1150 390, 1400 560, 1580 470",
  },
  {
    viewBox: "0 0 1200 700",
    width: 48,
    d: "M1580 470 C 1180 580, 821 360, 434 540 C 186 640, -62 500, -366 580",
  },
  {
    viewBox: "0 0 1200 700",
    width: 50,
    tone: "light",
    d: "M-366 500 C 186 390, 600 590, 1014 450 C 1235 330, 1400 520, 1580 430",
  },
];

export function ListView({
  filters,
  onChange,
  onOpenAdvisor,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onOpenAdvisor: (a: Advisor) => void;
}) {
  const list = useMemo(() => filterAdvisors(filters), [filters]);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...filters, [k]: v });

  return (
    <div className="view" id="view-list">
      <FlowLines svgs={LINES} stack />
      <div className="wrap">
        <div className="list-head">
          <Reveal as="span" className="en" style={{ color: "var(--orange)", display: "block" }}>
            Advisors
          </Reveal>
          <Reveal as="h1">
            想いで選ぶ、<br />
            アドバイザー一覧
          </Reveal>
          <Reveal as="p">
            カードの一番上にあるのは、その人の「想いの一文」です。経歴は詳細ページの最後にまとめています。まず言葉にふれてみてください。
          </Reveal>
        </div>

        <Reveal className="filters" id="filters">
          <label>
            テーマ
            <select value={filters.theme} onChange={(e) => set("theme", e.target.value)}>
              <option value="">すべてのテーマ</option>
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            エリア
            <select value={filters.area} onChange={(e) => set("area", e.target.value)}>
              <option value="">すべてのエリア</option>
              {AREAS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            相談形式
            <select value={filters.format} onChange={(e) => set("format", e.target.value)}>
              <option value="">すべての形式</option>
              {FORMATS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            所属タイプ
            <select value={filters.type} onChange={(e) => set("type", e.target.value)}>
              <option value="">すべての所属</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            並び替え
            <select value={filters.sort} onChange={(e) => set("sort", e.target.value as SortKey)}>
              <option value="rec">おすすめ順</option>
              <option value="years">相談歴が長い順</option>
              <option value="name">名前順</option>
            </select>
          </label>
          <label style={{ gridColumn: "1/-1" }}>
            キーワード
            <input
              type="search"
              value={filters.keyword}
              placeholder="名前・想い・キーワードで検索"
              onChange={(e) => set("keyword", e.target.value)}
            />
          </label>
        </Reveal>

        <p className="count-line" aria-live="polite">
          条件に合うアドバイザーは <strong>{list.length}</strong> 人です（全{ADVISORS.length}人）
        </p>

        <div className="adv-grid" style={{ paddingBottom: 40 }}>
          {list.map((a, i) => (
            <AdvisorCard key={a.id} advisor={a} delay={(i % 3) * 0.1} onOpen={onOpenAdvisor} />
          ))}
        </div>

        <div style={{ paddingBottom: 110 }}>
          {list.length === 0 && (
            <div className="empty-box">
              条件に合うアドバイザーが見つかりませんでした。
              <br />
              条件をゆるめて、もう一度探してみてください。
              <br />
              <button type="button" className="btn btn-ghost" onClick={() => onChange(EMPTY_FILTERS)}>
                条件をリセットする
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
