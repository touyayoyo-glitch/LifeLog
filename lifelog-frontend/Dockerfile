FROM node:20 AS build
WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピー
COPY package*.json ./

# 依存関係をインストール（キャッシュ無効化）
RUN npm ci

# ソースコードをコピー
COPY . .

# ビルド実行
RUN npm run build