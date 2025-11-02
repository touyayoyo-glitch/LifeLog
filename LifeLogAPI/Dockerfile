# ビルドステージ
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# csprojファイルをコピーして依存関係を復元
COPY *.csproj ./
RUN dotnet restore

# 全てのソースコードをコピー
COPY . ./

# アプリケーションをビルド
RUN dotnet publish -c Release -o out

# 実行ステージ
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# ビルド結果をコピー
COPY --from=build /app/out .

# アプリケーションを起動
ENTRYPOINT ["dotnet", "LifeLogAPI.dll"]