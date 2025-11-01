using LifeLogAPI.Data;
using LifeLogAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ===== サービス登録 =====

// 1. コントローラー追加
builder.Services.AddControllers();

// 2. Swagger/OpenAPI設定
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Swagger UIでJWT認証を使えるようにする
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT認証トークンを入力してください。例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// 3. データベース接続設定（PostgreSQL）
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 認証サービスをDIコンテナに登録
builder.Services.AddScoped<IAuthService, AuthService>();

// 4. JWT認証設定
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
        };
    });

// 5. CORS設定（フロントエンドからのアクセス許可）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite/Reactのデフォルトポート
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ===== ミドルウェア設定 =====

// 開発環境のみSwagger有効化
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LifeLog API V1");
        c.RoutePrefix = string.Empty; // ルートURL (https://localhost:7257/) でSwaggerを開く
    });
}

// HTTPS リダイレクト
app.UseHttpsRedirection();

// 静的ファイル配信（画像アップロード用）
app.UseStaticFiles();

// CORS有効化
app.UseCors("AllowFrontend");

// 認証・認可
app.UseAuthentication();
app.UseAuthorization();

// コントローラールーティング
app.MapControllers();

app.Run();