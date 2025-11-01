namespace LifeLogAPI.DTOs
{
    /// <summary>
    /// 認証レスポンスDTO（ログイン・登録成功時）
    /// </summary>
    public class AuthResponse
    {
        /// <summary>
        /// JWTトークン
        /// </summary>
        public string Token { get; set; } = string.Empty;

        /// <summary>
        /// ユーザー情報
        /// </summary>
        public UserDto User { get; set; } = null!;
    }

    /// <summary>
    /// ユーザー情報DTO
    /// </summary>
    public class UserDto
    {
        /// <summary>
        /// ユーザーID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// メールアドレス
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// ユーザー名
        /// </summary>
        public string Username { get; set; } = string.Empty;
    }
}