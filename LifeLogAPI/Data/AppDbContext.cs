using Microsoft.EntityFrameworkCore;
using LifeLogAPI.Models;

namespace LifeLogAPI.Data
{
    /// <summary>
    /// Entity Framework CoreのDBコンテキスト
    /// データベースとの接続・操作を管理
    /// </summary>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="options">DBコンテキストオプション</param>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// ユーザーテーブル
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Todoテーブル
        /// </summary>
        public DbSet<Todo> Todos { get; set; }

        /// <summary>
        /// アイテムテーブル
        /// </summary>
        public DbSet<Item> Items { get; set; }

        /// <summary>
        /// メモテーブル
        /// </summary>
        public DbSet<Memo> Memos { get; set; }

        /// <summary>
        /// モデル作成時の設定
        /// </summary>
        /// <param name="modelBuilder">モデルビルダー</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Userのメールアドレスにユニーク制約
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Todoとユーザーのリレーション設定
            modelBuilder.Entity<Todo>()
                .HasOne(t => t.User)
                .WithMany(u => u.Todos)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade); // ユーザー削除時に関連Todoも削除

            // Itemとユーザーのリレーション設定
            modelBuilder.Entity<Item>()
                .HasOne(i => i.User)
                .WithMany(u => u.Items)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Memoとユーザーのリレーション設定
            modelBuilder.Entity<Memo>()
                .HasOne(m => m.User)
                .WithMany(u => u.Memos)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}