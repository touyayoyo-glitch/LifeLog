using LifeLogAPI.DTOs;
using LifeLogAPI.Models;

namespace LifeLogAPI.Services
{
    /// <summary>
    /// 認証サービスのインターフェース
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// ユーザー登録
        /// </summary>
        /// <param name="request">登録リクエスト</param>
        /// <returns>認証レスポンス（トークン+ユーザー情報）</returns>
        Task<AuthResponse> RegisterAsync(RegisterRequest request);

        /// <summary>
        /// ログイン
        /// </summary>
        /// <param name="request">ログインリクエスト</param>
        /// <returns>認証レスポンス（トークン+ユーザー情報）</returns>
        Task<AuthResponse?> LoginAsync(LoginRequest request);

        /// <summary>
        /// JWTトークン生成
        /// </summary>
        /// <param name="user">ユーザー</param>
        /// <returns>JWTトークン文字列</returns>
        string GenerateJwtToken(User user);
    }
}