using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LifeLogAPI.Data;
using LifeLogAPI.DTOs;
using LifeLogAPI.Models;

namespace LifeLogAPI.Controllers
{
    /// <summary>
    /// アイテムコントローラー
    /// アイテム（買いたいもの、見たいものなど）のCRUD操作を提供
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ItemsController> _logger;

        public ItemsController(AppDbContext context, ILogger<ItemsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// ログイン中のユーザーIDを取得
        /// </summary>
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim!);
        }

        /// <summary>
        /// アイテム一覧取得API
        /// GET /api/items
        /// GET /api/items?category=shopping （カテゴリフィルタ）
        /// </summary>
        /// <param name="category">カテゴリ（任意）</param>
        /// <returns>アイテム一覧</returns>
        [HttpGet]
        public async Task<IActionResult> GetItems([FromQuery] string? category = null)
        {
            try
            {
                var userId = GetUserId();

                // クエリ作成
                var query = _context.Items.Where(i => i.UserId == userId);

                // カテゴリフィルタ適用
                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(i => i.Category == category);
                }

                // アイテム取得
                var items = await query
                    .OrderByDescending(i => i.CreatedAt)
                    .ToListAsync();

                _logger.LogInformation($"アイテム一覧取得成功: ユーザーID={userId}, 件数={items.Count}");
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError($"アイテム一覧取得エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// アイテム詳細取得API
        /// GET /api/items/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItem(int id)
        {
            try
            {
                var userId = GetUserId();
                var item = await _context.Items
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (item == null)
                {
                    return NotFound(new { message = "アイテムが見つかりません" });
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"アイテム詳細取得エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// アイテム作成API
        /// POST /api/items
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();

                var item = new Item
                {
                    UserId = userId,
                    Title = request.Title,
                    Category = request.Category,
                    Description = request.Description,
                    ImageUrl = request.ImageUrl,
                    LinkUrl = request.LinkUrl,
                    Completed = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Items.Add(item);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"アイテム作成成功: ID={item.Id}, ユーザーID={userId}");
                return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"アイテム作成エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// アイテム更新API
        /// PUT /api/items/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                var item = await _context.Items
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (item == null)
                {
                    return NotFound(new { message = "アイテムが見つかりません" });
                }

                item.Title = request.Title;
                item.Category = request.Category;
                item.Description = request.Description;
                item.ImageUrl = request.ImageUrl;
                item.LinkUrl = request.LinkUrl;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"アイテム更新成功: ID={id}");
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"アイテム更新エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// アイテム削除API
        /// DELETE /api/items/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                var userId = GetUserId();
                var item = await _context.Items
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (item == null)
                {
                    return NotFound(new { message = "アイテムが見つかりません" });
                }

                _context.Items.Remove(item);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"アイテム削除成功: ID={id}");
                return Ok(new { message = "アイテムを削除しました" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"アイテム削除エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// アイテム完了切替API
        /// PATCH /api/items/{id}/toggle
        /// </summary>
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleItem(int id)
        {
            try
            {
                var userId = GetUserId();
                var item = await _context.Items
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (item == null)
                {
                    return NotFound(new { message = "アイテムが見つかりません" });
                }

                item.Completed = !item.Completed;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"アイテム完了切替成功: ID={id}, 完了={item.Completed}");
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError($"アイテム完了切替エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }
    }
}