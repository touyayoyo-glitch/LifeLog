using System.ComponentModel.DataAnnotations;

namespace LifeLogAPI.DTOs
{
    /// <summary>
    /// ログインリクエストDTO
    /// </summary>
    public class LoginRequest
    {
        /// <summary>
        /// メールアドレス
        /// </summary>
        [Required(ErrorMessage = "メールアドレスは必須です")]
        [EmailAddress(ErrorMessage = "有効なメールアドレスを入力してください")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// パスワード
        /// </summary>
        [Required(ErrorMessage = "パスワードは必須です")]
        [MinLength(6, ErrorMessage = "パスワードは6文字以上で入力してください")]
        public string Password { get; set; } = string.Empty;
    }
}