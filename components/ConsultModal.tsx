"use client";

import { useEffect, useRef, useState } from "react";
import type { Advisor } from "@/lib/advisors";
import { SITE_NAME_JP } from "@/lib/site";

const TOPICS = [
  "転職について相談したい",
  "今の仕事を続けるか迷っている",
  "復職・働き方について相談したい",
  "管理職としての悩みを聞いてほしい",
  "セカンドキャリアを考えたい",
  "その他・まずは話を聞いてほしい",
];
const FORMATS = ["オンライン", "対面", "どちらでも可"];

function buildText(a: Advisor, name: string, topic: string, format: string): string {
  const nm = name.trim() || "（お名前）";
  return (
    `${a.name} 様\n\n` +
    `${SITE_NAME_JP}のインタビュー記事「${a.thought}」を拝読し、共感してご連絡しました。\n\n` +
    `相談したい内容：${topic}\n希望する形式：${format}\n\n` +
    `まずは30分ほど、現状をお話しできればと思っております。\n` +
    `ご都合のよい日時をいくつかご提示いただけますと幸いです。\n\n` +
    `どうぞよろしくお願いいたします。\n${nm}`
  );
}

/** Builds a consult message only. Nothing is sent anywhere. */
export function ConsultModal({ advisor, onClose }: { advisor: Advisor; onClose: () => void }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [edited, setEdited] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const text = edited ?? buildText(advisor, name, topic, format);

  // Changing a field regenerates the text (and discards manual edits), like the source.
  const field = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setEdited(null);
    setCopied(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const copy = async () => {
    const el = textRef.current;
    if (el) el.select();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        document.execCommand("copy");
      }
      setCopied(true);
    } catch {
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <div
      className="modal-back open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <h2 id="modal-title">{advisor.name}さんへ 相談の申込文をつくる</h2>
        <p className="sub">送信先はありません。内容を確認してコピーし、ご自身の連絡手段でお送りください。</p>

        <label htmlFor="m-name">あなたのお名前</label>
        <input
          id="m-name"
          ref={nameRef}
          type="text"
          value={name}
          placeholder="例：山田 花子"
          onChange={(e) => field(setName)(e.target.value)}
        />

        <label htmlFor="m-topic">相談したいテーマ</label>
        <select id="m-topic" value={topic} onChange={(e) => field(setTopic)(e.target.value)}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <label htmlFor="m-format">希望する形式</label>
        <select id="m-format" value={format} onChange={(e) => field(setFormat)(e.target.value)}>
          {FORMATS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <label htmlFor="m-text">申込文（編集できます）</label>
        <textarea
          id="m-text"
          ref={textRef}
          value={text}
          onChange={(e) => {
            setEdited(e.target.value);
            setCopied(false);
          }}
        />

        <div className="row-btns">
          <button type="button" className="btn btn-orange" onClick={copy}>
            申込文をコピーする
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            閉じる
          </button>
          <span className="copy-done" role="status" hidden={!copied}>
            コピーしました
          </span>
        </div>
      </div>
    </div>
  );
}
