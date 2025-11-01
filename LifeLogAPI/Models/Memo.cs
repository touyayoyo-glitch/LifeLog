using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeLogAPI.Models
{
    /// <summary>
    /// メモモデル（サイズ表など）
    /// </summary>
    [Table("memos")]
    public class Memo
    {
        /// <summary>
        /// メモID（主キー）
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
        [MaxLength(100)]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 内容
        /// </summary>
        [Column("content")]
        public string? Content { get; set; }

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