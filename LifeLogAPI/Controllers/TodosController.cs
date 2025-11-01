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
    /// Todoコントローラー
    /// Todo（やること）のCRUD操作を提供
    /// 全てのエンドポイントは認証が必要
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // JWT認証が必須
    public class TodosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TodosController> _logger;

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="context">DBコンテキスト</param>
        /// <param name="logger">ログ出力</param>
        public TodosController(AppDbContext context, ILogger<TodosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// ログイン中のユーザーIDを取得
        /// JWTトークンからユーザーIDを抽出
        /// </summary>
        /// <returns>ユーザーID</returns>
        private int GetUserId()
        {
            // JWTトークンのClaimからユーザーIDを取得
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim!);
        }

        /// <summary>
        /// Todo一覧取得API
        /// GET /api/todos
        /// ログインユーザーのTodoのみ取得
        /// </summary>
        /// <returns>Todo一覧</returns>
        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            try
            {
                // 1. ログイン中のユーザーIDを取得
                var userId = GetUserId();

                // 2. ユーザーのTodoを全て取得（作成日時の降順）
                var todos = await _context.Todos
                    .Where(t => t.UserId == userId)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                // 3. レスポンスを返却
                _logger.LogInformation($"Todo一覧取得成功: ユーザーID={userId}, 件数={todos.Count}");
                return Ok(todos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Todo一覧取得エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// Todo詳細取得API
        /// GET /api/todos/{id}
        /// </summary>
        /// <param name="id">TodoID</param>
        /// <returns>Todo詳細</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTodo(int id)
        {
            try
            {
                // 1. ログイン中のユーザーIDを取得
                var userId = GetUserId();

                // 2. 指定されたIDのTodoを取得
                var todo = await _context.Todos
                    .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

                // 3. Todoが存在しない、または他人のTodoの場合
                if (todo == null)
                {
                    return NotFound(new { message = "Todoが見つかりません" });
                }

                // 4. レスポンスを返却
                return Ok(todo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Todo詳細取得エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// Todo作成API
        /// POST /api/todos
        /// </summary>
        /// <param name="request">Todo作成リクエスト</param>
        /// <returns>作成されたTodo</returns>
        [HttpPost]
        public async Task<IActionResult> CreateTodo([FromBody] TodoRequest request)
        {
            try
            {
                // 1. モデル検証
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // 2. ログイン中のユーザーIDを取得
                var userId = GetUserId();

                // 3. Todoエンティティを作成
                var todo = new Todo
                {
                    UserId = userId,
                    Title = request.Title,
                    Description = request.Description,
                    Deadline = request.Deadline,
                    NotifyBeforeMinutes = request.NotifyBeforeMinutes,
                    Priority = request.Priority,
                    ImageUrl = request.ImageUrl,
                    LinkUrl = request.LinkUrl,
                    Completed = false,
                    CreatedAt = DateTime.UtcNow
                };

                // 4. DBに保存
                _context.Todos.Add(todo);
                await _context.SaveChangesAsync();

                // 5. レスポンスを返却（作成されたリソースのURIと共に）
                _logger.LogInformation($"Todo作成成功: ID={todo.Id}, ユーザーID={userId}");
                return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Todo作成エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// Todo更新API
        /// PUT /api/todos/{id}
        /// </summary>
        /// <param name="id">TodoID</param>
        /// <param name="request">Todo更新リクエスト</param>
        /// <returns>更新されたTodo</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoRequest request)
        {
            try
            {
                // 1. モデル検証
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // 2. ログイン中のユーザーIDを取得
                var userId = GetUserId();

                // 3. 更新対象のTodoを取得
                var todo = await _context.Todos
                    .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

                if (todo == null)
                {
                    return NotFound(new { message = "Todoが見つかりません" });
                }

                // 4. Todoの内容を更新
                todo.Title = request.Title;
                todo.Description = request.Description;
                todo.Deadline = request.Deadline;
                todo.NotifyBeforeMinutes = request.NotifyBeforeMinutes;
                todo.Priority = request.Priority;
                todo.ImageUrl = request.ImageUrl;
                todo.LinkUrl = request.LinkUrl;

                // 5. DBに保存
                await _context.SaveChangesAsync();

                // 6. レスポンスを返却
                _logger.LogInformation($"Todo更新成功: ID={id}, ユーザーID={userId}");
                return Ok(todo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Todo更新エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// Todo削除API
        /// DELETE /api/todos/{id}
        /// </summary>
        /// <param name="id">TodoID</param>
        /// <returns>削除成功メッセージ</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            try
            {
                // 1. ログイン中のユーザーIDを取得
                var userId = GetUserId();

                // 2. 削除対象のTodoを取得
                var todo = await _context.Todos
                    .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

                if (todo == null)
                {
                    return NotFound(new { message = "Todoが見つかりません" });
                }

                // 3. Todoを削除
                _context.Todos.Remove(todo);
                await _context.SaveChangesAsync();

                // 4. レスポンスを返却
                _logger.LogInformation($"Todo削除成功: ID={id}, ユーザーID={userId}");
                return Ok(new { message = "Todoを削除しました" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Todo削除エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }

        /// <summary>
        /// Todo完了切替API
        /// PATCH /api/todos/{id}/toggle
        /// 完了⇔未完了を切り替え
        /// </summary>
        /// <param name="id">TodoID</param>
        /// <returns>更新されたTodo</returns>
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleTodo(int id)
        {
            try
            {
                // 1. ログイン中のユーザーIDを取得
                var userId = GetUserId();

                // 2. 対象のTodoを取得
                var todo = await _context.Todos
                    .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

                if (todo == null)
                {
                    return NotFound(new { message = "Todoが見つかりません" });
                }

                // 3. 完了状態を反転
                todo.Completed = !todo.Completed;

                // 4. DBに保存
                await _context.SaveChangesAsync();

                // 5. レスポンスを返却
                _logger.LogInformation($"Todo完了切替成功: ID={id}, 完了={todo.Completed}");
                return Ok(todo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Todo完了切替エラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" });
            }
        }
    }
}