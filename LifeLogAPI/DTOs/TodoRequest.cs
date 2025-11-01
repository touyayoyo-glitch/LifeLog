using System.ComponentModel.DataAnnotations;

namespace LifeLogAPI.DTOs
{
    /// <summary>
    /// Todo作成・更新リクエストDTO
    /// </summary>
    public class TodoRequest
    {
        /// <summary>
        /// タイトル
        /// </summary>
        [Required(ErrorMessage = "タイトルは必須です")]
        [MaxLength(200, ErrorMessage = "タイトルは200文字以内で入力してください")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 説明文
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// 期限日時
        /// </summary>
        public DateTime? Deadline { get; set; }

        /// <summary>
        /// 期限の何分前に通知するか
        /// </summary>
        [Range(0, 1440, ErrorMessage = "通知時間は0〜1440分（24時間）の範囲で指定してください")]
        public int NotifyBeforeMinutes { get; set; } = 30;

        /// <summary>
        /// 優先度（0:通常, 1:重要, 2:緊急）
        /// </summary>
        [Range(0, 2, ErrorMessage = "優先度は0〜2の範囲で指定してください")]
        public int Priority { get; set; } = 0;

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