# CONTRIBUTING.md

`next/**` ブランチはモバイル版対応の Ucho-ten を開発するためのものです。

## 🔧 技術スタック

- Turborepo + pnpm
- Next.js
- Storybook

## 🗒 環境構築

### 環境要件

開発環境には以下のソフトウェア・ツールをセットアップしてください。

- sqlite3
- Node.js = v18.17.0
- pnpm >= v8.6.0

### リポジトリのクローン

- ブランチは `next` です。
- PR を出す際は `next-dev/(feat | fix | etc..)/<name>` のようなブランチを作成して作業を行います。

```shell
git clone -b next https://github.com/hota1024/ucho-ten.git
cd ucho-ten
```

### パッケージのインストール

- パッケージマネージャーには `pnpm` を利用します。

```shell
pnpm i
```
