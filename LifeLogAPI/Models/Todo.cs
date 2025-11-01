using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeLogAPI.Models
{
    /// <summary>
    /// Todoモデル（期限・通知機能付き）
    /// </summary>
    [Table("todos")]
    public class Todo
    {
        /// <summary>
        /// TodoID（主キー）
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// ユーザーID（外部キー）
        /// </summary>
        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        /// <summary>
        /// タイトル
        /// </summary>
        [Required]
        [MaxLength(200)]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 説明文
        /// </summary>
        [Column("description")]
        public string? Description { get; set; }

        /// <summary>
        /// 期限日時
        /// </summary>
        [Column("deadline")]
        public DateTime? Deadline { get; set; }

        /// <summary>
        /// 期限の何分前に通知するか（デフォルト30分）
        /// </summary>
        [Column("notify_before_minutes")]
        public int NotifyBeforeMinutes { get; set; } = 30;

        /// <summary>
        /// 優先度（0:通常, 1:重要, 2:緊急）
        /// </summary>
        [Column("priority")]
        public int Priority { get; set; } = 0;

        /// <summary>
        /// 完了フラグ
        /// </summary>
        [Column("completed")]
        public bool Completed { get; set; } = false;

        /// <summary>
        /// 画像URL
        /// </summary>
        [MaxLength(500)]
        [Column("image_url")]
        public string? ImageUrl { get; set; }

        /// <summary>
        /// リンクURL
        /// </summary>
        [MaxLength(500)]
        [Column("link_url")]
        public string? LinkUrl { get; set; }

        /// <summary>
        /// 作成日時
        /// </summary>
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// ユーザー（ナビゲーションプロパティ）
        /// </summary>
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}