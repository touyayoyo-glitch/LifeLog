using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using LifeLogAPI.Data;
using LifeLogAPI.DTOs;
using LifeLogAPI.Models;

namespace LifeLogAPI.Services
{
    /// <summary>
    /// 認証サービスの実装
    /// ユーザー登録、ログイン、JWT発行を担当
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="context">DBコンテキスト</param>
        /// <param name="configuration">設定（appsettings.json）</param>
        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// ユーザー登録処理
        /// 1. メールアドレス重複チェック
        /// 2. パスワードをBCryptでハッシュ化
        /// 3. ユーザーをDBに保存
        /// 4. JWTトークンを生成して返却
        /// </summary>
        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // 1. メールアドレスが既に登録されているかチェック
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                throw new Exception("このメールアドレスは既に登録されています");
            }

            // 2. パスワードをBCryptでハッシュ化（セキュアに保存）
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. 新規ユーザーエンティティを作成
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                Username = request.Username,
                CreatedAt = DateTime.UtcNow
            };

            // 4. DBに保存
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 5. JWTトークンを生成
            var token = GenerateJwtToken(user);

            // 6. レスポンスを返却
            return new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username
                }
            };
        }

        /// <summary>
        /// ログイン処理
        /// 1. メールアドレスでユーザー検索
        /// 2. パスワードを検証
        /// 3. JWTトークンを生成して返却
        /// </summary>
        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            // 1. メールアドレスでユーザーを検索
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // ユーザーが存在しない場合
            if (user == null)
            {
                return null; // 認証失敗
            }

            // 2. パスワードを検証（BCryptで比較）
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return null; // 認証失敗
            }

            // 3. JWTトークンを生成
            var token = GenerateJwtToken(user);

            // 4. レスポンスを返却
            return new AuthResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username
                }
            };
        }

        /// <summary>
        /// JWTトークン生成
        /// トークンにはユーザーIDとメールアドレスを含める
        /// </summary>
        public string GenerateJwtToken(User user)
        {
            // 1. appsettings.jsonからJWT設定を取得
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expirationDays = int.Parse(jwtSettings["ExpirationDays"]!);

            // 2. トークンに含めるクレーム（ユーザー情報）を設定
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // ユーザーID
                new Claim(ClaimTypes.Email, user.Email),                  // メールアドレス
                new Claim(ClaimTypes.Name, user.Username)                 // ユーザー名
            };

            // 3. 署名用の鍵を作成
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 4. トークンを生成
            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(expirationDays), // 有効期限
                signingCredentials: credentials
            );

            // 5. トークンを文字列に変換して返却
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}