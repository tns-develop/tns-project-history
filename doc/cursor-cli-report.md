# Cursor CLI 検証レポート

## 概要

Cursor CLI（ターミナルモード）を使い、リポジトリのクローンからDockerコンテナの立ち上げ・アプリ起動までを一連の対話で実施した。

## 実施日

2026-02-20

## 実施内容

### 1. リポジトリのクローン

```bash
git clone https://github.com/tns-develop/tns-project-history.git .
```

- 空のワークスペースに対して、URLを提示するだけでクローンを実行

### 2. プロジェクト構成の自動分析

CLIが以下を自動で読み取り、構成を把握した：

- `docker-compose.yml` / `Dockerfile` — コンテナ構成
- `package.json`（ルート＋ワークスペース）— 依存関係・スクリプト定義
- `.yarnrc.yml` — Yarn 4 の設定（`nodeLinker: node-modules`）
- `next.config.mjs` — Next.js の設定

### 3. Dockerコンテナのビルド＆起動

```bash
docker compose up -d --build
```

- `Dockerfile` と `docker-compose.yml` の内容をもとに、ビルド〜起動まで一括実行
- コンテナ名: `tns-project-history`
- ポート: 5000（アプリ）、9229（デバッグ）

### 4. 依存パッケージのインストール

```bash
docker exec tns-project-history bash -c "corepack enable && yarn install"
```

- Yarn 4 を利用するために `corepack enable` を先に実行
- 600パッケージをインストール

### 5. 開発サーバーの起動と動作確認

```bash
docker exec -d tns-project-history bash -c "cd /app && yarn workspace tns-projects-history dev"
```

- Next.js の開発サーバーをポート5000でバックグラウンド起動
- `curl` で HTTP 200 を確認し、正常稼働を検証済み

### 6. GitHub Actions + GitHub Pages デプロイ構築

「GitHub Pages で公開したい」という指示をもとに、CLI が以下を自動で実施した：

#### 6-1. プロジェクト分析と課題の特定

CLI がソースコード全体を読み取り、静的エクスポートに必要な変更点を自動で洗い出した：

- API routes（`app/api/`）の存在 → 静的サイトでは不要と判断
- `JSX.Element` 型 → React 19 では `React.JSX.Element` に変更が必要
- `next.config.mjs` → `output: 'export'` と `basePath` の追加が必要

#### 6-2. 実施した変更

**`next.config.mjs`** — 静的エクスポート設定を追加

```js
const nextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/tns-project-history' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/tns-project-history/' : '',
  trailingSlash: true,
}
```

- `GITHUB_PAGES` 環境変数で GitHub Pages 用とローカル開発を切り替える設計

**型エラーの修正** — 3ファイル

- `app/layout.tsx`, `app/page.tsx`, `app/projects/page.tsx`
- `JSX.Element` → `React.JSX.Element` に変更（React 19 対応）

**API routes の削除**

- `app/api/projects/route.ts`, `app/api/projects/[id]/route.ts`
- 静的エクスポートとの互換性がないため削除（データは空配列で例示用だった）

#### 6-3. GitHub Actions ワークフロー作成

`.github/workflows/deploy.yml` を新規作成：

- `main` ブランチへの push で自動デプロイ
- Yarn 4 + corepack 対応
- `actions/upload-pages-artifact` + `actions/deploy-pages` で GitHub Pages にデプロイ

#### 6-4. ビルド検証

コンテナ内で静的ビルドを実行し、成功を確認：

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      172 B         105 kB
├ ○ /_not-found                            977 B         102 kB
└ ○ /projects                            77.2 kB         179 kB
```

- 3ページすべてが静的に生成された
- `out/` ディレクトリに HTML/JS/CSS が出力済み

#### 6-5. 残りの手順（GitHub 側の設定）

リポジトリに push 後、以下の設定が必要：

1. GitHub リポジトリの Settings → Pages → Source を **GitHub Actions** に変更
2. `main` ブランチに push すると自動でデプロイが走る
3. 公開URL: `https://tns-develop.github.io/tns-project-history/`

---

## 所感・CLIモードの特徴

| 観点 | 内容 |
|---|---|
| 操作方法 | URLやコマンドの指示ではなく、「クローンして」「コンテナ立ち上げて」のような自然言語で指示できた |
| 自動判断 | プロジェクトの設定ファイルを自動で読み取り、適切なセットアップ手順を提案してくれた |
| 一気通貫 | clone → build → install → dev起動 まで、ターミナルから離れずに完結した |
| エディタとの違い | GUIを開かず軽量に作業できる。環境構築やインフラ寄りのタスクに向いている |
| ビルドエラーの対応 | ビルド → エラー検出 → 修正 → 再ビルドのサイクルをCLI内で自律的に回してくれた |
| CI/CD構築 | 「GitHub Pages で公開したい」の一言から、必要な設定変更・ワークフロー作成・ビルド検証まで一連で実施 |
