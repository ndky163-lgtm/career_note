# キャリアノート CAREER NOTE（Next.js）

キャリアアドバイザー紹介サイト。元HTML（キャリアノート.html）をNext.js（App Router・静的生成）で再構築したものです。

## 構成

- `app/page.tsx` — TOP（ヒーロー・私たちの想い・特集・検索）
- `app/advisors/page.tsx` + `AdvisorsClient.tsx` — 一覧（フィルター・並び替え・検索）
- `app/advisors/[id]/page.tsx` — 詳細（インタビュー・プロフィール・申込モーダル）
- `app/data/advisors.ts` / `advisors.json` — アドバイザーデータ（THEMES/AREAS/FORMATS/AFFS もここ）
- `app/components/` — カード、検索、相談モーダル
- `public/photos/` — 写真（元HTMLのbase64から抽出）

## 他ジャンルの紹介サイトを追加する場合

`app/data/` のJSON＋カテゴリ定数、一覧/詳細ページ、`globals.css` の変数（`--teal` 系のテーマカラー）を差し替える構造になっています。`比較サイト/` 直下に同構成のフォルダをもう一つ作るのが最も簡単です。

## 起動

```bash
npm run dev    # 開発
npm run build && npm run start   # 本番
```
