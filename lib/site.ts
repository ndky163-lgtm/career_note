/** Single source of truth for the (provisional) site name. */
export const SITE = {
  /** キャリア + ノート (the tail is accented in orange in the logo) */
  nameJpHead: "キャリア",
  nameJpTail: "ノート",
  nameEn: "CAREER NOTE",
  nameEnTitle: "Career Note",
  provisional: "（仮称）",
  tagline: "想いで選ぶ、キャリアアドバイザー紹介",
  description:
    "キャリアに悩むあなたへ。全員にインタビューをしたキャリアアドバイザーの想いを読んで、共感できる人に相談できる紹介サイトです。",
} as const;

export const SITE_NAME_JP: string = SITE.nameJpHead + SITE.nameJpTail;
export const SITE_NAME_JP_PROVISIONAL: string = SITE_NAME_JP + SITE.provisional;
export const SITE_TITLE: string = `${SITE_NAME_JP} ${SITE.nameEn}｜${SITE.tagline}`;
