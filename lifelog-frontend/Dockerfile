# ビルドステージ
FROM node:18-alpine AS build
WORKDIR /app

# package.jsonをコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# すべてのファイルをコピー
COPY . ./

# 環境変数を設定してビルド
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# 本番ステージ（nginx）
FROM nginx:alpine

# ビルド結果をnginxにコピー
COPY --from=build /app/build /usr/share/nginx/html

# nginx設定ファイル（後で作成）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]