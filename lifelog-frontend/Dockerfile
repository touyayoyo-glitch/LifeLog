FROM node:20-alpine AS build
WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピー
COPY package*.json ./

# 依存関係をインストール（キャッシュ無効化）
RUN npm cache clean --force && npm install --no-optional

# ソースコードをコピー
COPY . .

# ビルド実行
RUN npm run build