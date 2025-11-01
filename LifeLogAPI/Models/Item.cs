using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeLogAPI.Models
{
    /// <summary>
    /// アイテムモデル（買いたいもの、見たいものなど）
    /// </summary>
    [Table("items")]
    public class Item
    {
        /// <summary>
        /// アイテムID（主キー）
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
        /// カテゴリ（shopping/movie/drama/manga/place/goal）
        /// </summary>
        [Required]
        [MaxLength(50)]
        [Column("category")]
        public string Category { get; set; } = string.Empty;

        /// <summary>
        /// 説明文
        /// </summary>
        [Column("description")]
        public string? Description { get; set; }

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