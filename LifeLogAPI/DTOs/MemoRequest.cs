using System.ComponentModel.DataAnnotations;

namespace LifeLogAPI.DTOs
{
    /// <summary>
    /// メモ作成・更新リクエストDTO
    /// </summary>
    public class MemoRequest
    {
        /// <summary>
        /// タイトル
        /// </summary>
        [Required(ErrorMessage = "タイトルは必須です")]
        [MaxLength(100, ErrorMessage = "タイトルは100文字以内で入力してください")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 内容
        /// </summary>
        public string? Content { get; set; }
    }
}