# キャリアノート CAREER NOTE（Next.js）

キャリアアドバイザー紹介サイト。`キャリアアドバイザー紹介サイト.html` を Next.js（App Router）で再現したものです。

## 構成

- `app/page.tsx` — `SiteApp`（TOP／一覧／詳細のクライアント切替）
- `components/` — Header / Hero / FlowLines / ListView / DetailView など
- `lib/advisors.ts` — アドバイザー12人のデータとフィルタ
- `lib/site.ts` — サイト名の一元管理
- `public/images/` — ヒーロー・バンド・アドバイザー写真

## 起動

```bash
npm run dev    # 開発
npm run build && npm run start   # 本番
```
