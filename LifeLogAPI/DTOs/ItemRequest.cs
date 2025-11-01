using System.ComponentModel.DataAnnotations;

namespace LifeLogAPI.DTOs
{
    /// <summary>
    /// アイテム作成・更新リクエストDTO
    /// </summary>
    public class ItemRequest
    {
        /// <summary>
        /// タイトル
        /// </summary>
        [Required(ErrorMessage = "タイトルは必須です")]
        [MaxLength(200, ErrorMessage = "タイトルは200文字以内で入力してください")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// カテゴリ（shopping/movie/drama/manga/place/goal）
        /// </summary>
        [Required(ErrorMessage = "カテゴリは必須です")]
        [RegularExpression("^(shopping|movie|drama|manga|place|goal)$",
            ErrorMessage = "カテゴリはshopping/movie/drama/manga/place/goalのいずれかを指定してください")]
        public string Category { get; set; } = string.Empty;

        /// <summary>
        /// 説明文
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// 画像URL
        /// </summary>
        [MaxLength(500, ErrorMessage = "画像URLは500文字以内で入力してください")]
        public string? ImageUrl { get; set; }

        /// <summary>
        /// リンクURL
        /// </summary>
        [MaxLength(500, ErrorMessage = "リンクURLは500文字以内で入力してください")]
        public string? LinkUrl { get; set; }
    }
}