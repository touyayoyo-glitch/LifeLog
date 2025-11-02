# LifeLogAPI Dockerfile
# Updated: 2025-11-03
# Railway deployment with dynamic PORT configuration

# ビルドステージ
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# csprojファイルをコピーして依存関係を復元
COPY *.csproj ./
RUN dotnet restore

# 全てのソースコードをコピー
COPY . ./

# ビルド確認
RUN echo "=== Starting build ===" && ls -la

# アプリケーションをビルド
RUN dotnet publish -c Release -o out

# ビルド結果を確認
RUN echo "=== Build complete ===" && ls -la out/

# 実行ステージ
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# ビルド結果をコピー
COPY --from=build /app/out .

# 環境変数設定
ENV ASPNETCORE_ENVIRONMENT=Production

# 最終確認
RUN echo "=== Files in /app ===" && ls -la

# アプリケーションを起動
ENTRYPOINT ["dotnet", "LifeLogAPI.dll"]
