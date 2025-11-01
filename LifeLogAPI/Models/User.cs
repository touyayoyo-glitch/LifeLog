using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeLogAPI.Models
{
    /// <summary>
    /// ユーザーモデル
    /// </summary>
    [Table("users")]
    public class User
    {
        /// <summary>
        /// ユーザーID（主キー）
        /// </summary>
        [Key]
        [Column("id")]
        public int Id { get; set; }

        /// <summary>
        /// メールアドレス（ログインID）
        /// </summary>
        [Required]
        [MaxLength(255)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// パスワードハッシュ（BCrypt）
        /// </summary>
        [Required]
        [MaxLength(500)]
        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// ユーザー名
        /// </summary>
        [Required]
        [MaxLength(100)]
        [Column("username")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// 作成日時
        /// </summary>
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// このユーザーのTodoリスト
        /// </summary>
        public ICollection<Todo> Todos { get; set; } = new List<Todo>();

        /// <summary>
        /// このユーザーのアイテムリスト
        /// </summary>
        public ICollection<Item> Items { get; set; } = new List<Item>();

        /// <summary>
        /// このユーザーのメモリスト
        /// </summary>
        public ICollection<Memo> Memos { get; set; } = new List<Memo>();
    }
}