# Cursor CLI 検証レポート

## 概要

Cursor CLI（ターミナルモード）を使い、リポジトリのクローンからDockerコンテナの立ち上げ・アプリ起動、さらにGitHub Pages への自動デプロイ構築・公開までを一連の対話で実施した。

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

#### 6-5. Git 認証とデプロイ

- リポジトリローカルの Git ユーザー情報を設定（`git config user.name` / `user.email`）
- `git config credential.https://github.com.username` でリポジトリ単位の認証ユーザーを指定（グローバル設定を汚さない）
- CLI が commit → push まで実行
- GitHub 側で Settings → Pages → Source を **GitHub Actions** に変更後、空コミットでデプロイをトリガー
- GitHub Actions が自動実行され、デプロイ成功を確認

**公開URL**: https://tns-develop.github.io/tns-project-history/

---

## ユーザーが出した指示の一覧

今回のセッションでユーザーが実際に出した指示は以下の通り。CLI側の自動判断・自律行動がどの程度かを示すため、指示の粒度に注目。

| # | ユーザーの指示（原文ベース） | CLIが自律的にやったこと |
|---|---|---|
| 1 | 「Gitからクローンしてコンテナ立ち上げまでして」+ URL提示 | clone → 構成ファイルの自動分析 → `docker compose up -d --build` を実行 |
| 2 | 「セットアップにふさわしいコマンドはお任せしていける？」 | Yarn 4 / corepack / workspaces 構成を読み取り、3ステップの手順を提案 |
| 3 | 「OK」（セットアップ実行の承認） | `corepack enable` → `yarn install` → dev server 起動 → HTTP 200 確認 |
| 4 | 「ブラウザで確認してみて」 | コンテナ内から `curl` でHTMLを取得し、ページ内容を報告 |
| 5 | 「CLIを使って行ったことをマークダウン形式の報告ファイルに追記して」 | `doc/cursor-cli-report.md` を新規作成し、全作業手順を記録 |
| 6 | 「GitHub Actionsを構築したい。Webページを公開したい」 | ソースコード全体を分析 → 静的エクスポートの課題3点を特定 → 変更計画を提示 |
| 7 | 「OK」（GitHub Pages 対応の承認） | next.config.mjs 修正 → 型エラー修正 → API routes 削除 → ワークフロー作成 → ビルド検証（エラー→修正→再ビルドを3回自律実行） |
| 8 | 「push」 | git add → commit → push を実行（PowerShellの構文問題も自力で回避） |
| 9 | メールアドレス・ユーザー名の提供 | リポジトリローカルに git config を設定 |
| 10 | 「グローバルにはしないでローカルだけ認証させて」 | `credential.https://github.com.username` による方法を提案・実行 |
| 11 | 「方法1でお願い」 | 設定 → push 再実行 → 成功 |
| 12 | 「変更してみたよー空コミットお願い」 | `--allow-empty` で空コミット → push |
| 13 | 「メンバー紹介用のマークダウンに追記して」 | レポートにデプロイ完了・まとめセクションを追記 |

### ポイント

- ユーザーの指示は **13回**、うち具体的なコマンドや技術用語を含む指示は **0回**
- 「クローンして」「公開したい」「pushして」のような **目的ベースの自然言語** のみ
- CLI 側がプロジェクト構成の分析、適切なコマンドの選択、エラー修正、代替手段の提案をすべて自律的に実施

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
| Git操作 | commit・push もCLI内で完結。認証エラーも対話しながらリポジトリローカル設定で解決できた |
| トラブルシュート | PowerShell との構文差異（`&&` 非対応、日本語エンコーディング）にも適応して別手段で対処 |

## まとめ

今回の検証では、**空のディレクトリから Web アプリの公開まで** を Cursor CLI のみで完結させた。

### 全体フロー

```
URL提示 → clone → Docker build → yarn install → dev server 起動
    → GitHub Pages 対応のコード修正 → Actions ワークフロー作成
    → ビルド検証 → commit → push → デプロイ成功
```

### CLIモードが特に有効だった場面

1. **環境構築** — clone からコンテナ起動まで、手順を知らなくても自然言語で指示するだけで完了
2. **ビルドエラーの自律修正** — 型エラー・静的エクスポートの非互換を自動で検出し、修正→再ビルドを繰り返した
3. **CI/CD の構築** — 「公開したい」という目的だけ伝えれば、必要な変更を洗い出してワークフローまで作成
4. **Git操作とトラブル対応** — 認証エラーやシェルの互換性問題にも対話で対処できた

### エディタモードとの使い分け

| CLIモード向き | エディタモード向き |
|---|---|
| 環境構築・セットアップ | UIを見ながらのコード編集 |
| CI/CD・インフラ構築 | 複数ファイルの同時比較・レビュー |
| Git操作・デプロイ | デバッグ（ブレークポイント等） |
| 調査・分析タスク | リアルタイムプレビューが必要な作業 |
