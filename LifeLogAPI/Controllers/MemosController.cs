using LifeLogAPI.Data;
using LifeLogAPI.DTOs;
using LifeLogAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Utilities;
using System.Security.Claims;

namespace LifeLogAPI.Controllers
{
    /// <summary>
    /// メモコントローラー
    /// メモ（サイズ表など）のCRUD操作を提供
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MemosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MemosController> _logger;

        public MemosController(AppDbContext context, ILogger<MemosController> logger)
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
        /// メモ一覧取得API
        /// GET /api/memos
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMemos()
        {
            try
            {
                var userId = GetUserId();
                var memos = await _context.Memos
                    .Where(m => m.UserId == userId)
                    .OrderByDescending(m => m.CreatedAt)
                    .ToListAsync();

                _logger.LogInformation($"メモ一覧取得成功: ユーザーID={userId}, 件数={memos.Count}");
                return Ok(memos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"メモ一覧取得エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// メモ詳細取得API
        /// GET /api/memos/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMemo(int id)
        {
            try
            {
                var userId = GetUserId();
                var memo = await _context.Memos
                    .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

                if (memo == null)
                {
                    return NotFound(new { message = "メモが見つかりません" });
                }

                return Ok(memo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"メモ詳細取得エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// メモ作成API
        /// POST /api/memos
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateMemo([FromBody] MemoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();

                var memo = new Memo
                {
                    UserId = userId,
                    Title = request.Title,
                    Content = request.Content,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Memos.Add(memo);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"メモ作成成功: ID={memo.Id}");
                return CreatedAtAction(nameof(GetMemo), new { id = memo.Id }, memo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"メモ作成エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// メモ更新API
        /// PUT /api/memos/{id}
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMemo(int id, [FromBody] MemoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                var memo = await _context.Memos
                    .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

                if (memo == null)
                {
                    return NotFound(new { message = "メモが見つかりません" });
                }

                memo.Title = request.Title;
                memo.Content = request.Content;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"メモ更新成功: ID={id}");
                return Ok(memo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"メモ更新エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// メモ削除API
        /// DELETE /api/memos/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMemo(int id)
        {
            try
            {
                var userId = GetUserId();
                var memo = await _context.Memos
                    .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

                if (memo == null)
                {
                    return NotFound(new { message = "メモが見つかりません" });
                }

                _context.Memos.Remove(memo);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"メモ削除成功: ID={id}");
                return Ok(new { message = "メモを削除しました" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"メモ削除エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }
    }
}