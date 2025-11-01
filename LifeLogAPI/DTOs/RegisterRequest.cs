using System.ComponentModel.DataAnnotations;

namespace LifeLogAPI.DTOs
{
    /// <summary>
    /// ユーザー登録リクエストDTO
    /// </summary>
    public class RegisterRequest
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

        /// <summary>
        /// ユーザー名
        /// </summary>
        [Required(ErrorMessage = "ユーザー名は必須です")]
        [MaxLength(100, ErrorMessage = "ユーザー名は100文字以内で入力してください")]
        public string Username { get; set; } = string.Empty;
    }
}