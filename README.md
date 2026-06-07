# 琵琶湖ビワマスコンディション

琵琶湖の風・天気・水位・水温を1画面で確認できる出船前チェックアプリ。

## セットアップ

```bash
npm install
npm run dev
```

## 環境変数

現在のバージョンでは外部APIキーは不要（Open-Meteo は無料・キーなし）。将来の拡張時は `.env.local` を使用：

```
OPEN_METEO_API_KEY=（将来用）
```

## 利用データソース

| データ | ソース | 更新頻度 |
|--------|--------|----------|
| 天気・風・日の出 | Open-Meteo (open-meteo.com) | 10分キャッシュ |
| 琵琶湖水位 | 水資源機構 琵琶湖総合管理所 | 30分キャッシュ |
| 琵琶湖水温 | 国土交通省 水文水質データベース | 1時間キャッシュ |
| 潮汐 | 天文計算（大阪港調和定数） | 計算値（参考） |
| 波高 | なし（公開APIなし） | - |

## デプロイ方法（Vercel）

1. GitHub にプッシュ
2. Vercel (vercel.com) でリポジトリをインポート
3. Framework: Next.js（自動検出）
4. そのままデプロイ（環境変数は現時点で不要）

---

Original Next.js README below:

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
