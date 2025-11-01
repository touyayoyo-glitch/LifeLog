using Microsoft.AspNetCore.Mvc;
using LifeLogAPI.DTOs;
using LifeLogAPI.Services;

namespace LifeLogAPI.Controllers
{
    /// <summary>
    /// 認証コントローラー
    /// ユーザー登録・ログイン機能を提供
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="authService">認証サービス</param>
        /// <param name="logger">ログ出力</param>
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// ユーザー登録API
        /// POST /api/auth/register
        /// </summary>
        /// <param name="request">登録リクエスト（メール、パスワード、ユーザー名）</param>
        /// <returns>認証レスポンス（トークン+ユーザー情報）</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // 1. モデル検証（バリデーション）
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState); // 400エラー
                }

                // 2. 認証サービスでユーザー登録処理
                var response = await _authService.RegisterAsync(request);

                // 3. 成功レスポンスを返却
                _logger.LogInformation($"新規ユーザー登録成功: {request.Email}");
                return Ok(response); // 200 OK
            }
            catch (Exception ex)
            {
                // エラーハンドリング
                _logger.LogError($"登録エラー: {ex.Message}");
                return BadRequest(new { message = ex.Message }); // 400エラー
            }
        }

        /// <summary>
        /// ログインAPI
        /// POST /api/auth/login
        /// </summary>
        /// <param name="request">ログインリクエスト（メール、パスワード）</param>
        /// <returns>認証レスポンス（トークン+ユーザー情報）</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // 1. モデル検証（バリデーション）
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState); // 400エラー
                }

                // 2. 認証サービスでログイン処理
                var response = await _authService.LoginAsync(request);

                // 3. 認証失敗時
                if (response == null)
                {
                    _logger.LogWarning($"ログイン失敗: {request.Email}");
                    return Unauthorized(new { message = "メールアドレスまたはパスワードが正しくありません" }); // 401エラー
                }

                // 4. 成功レスポンスを返却
                _logger.LogInformation($"ログイン成功: {request.Email}");
                return Ok(response); // 200 OK
            }
            catch (Exception ex)
            {
                // エラーハンドリング
                _logger.LogError($"ログインエラー: {ex.Message}");
                return StatusCode(500, new { message = "サーバーエラーが発生しました" }); // 500エラー
            }
        }
    }
}