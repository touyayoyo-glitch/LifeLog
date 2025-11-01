using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeLogAPI.Controllers
{
    /// <summary>
    /// 画像アップロードコントローラー
    /// 画像ファイルをサーバーに保存し、URLを返却
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        // 許可する画像形式
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        
        // 最大ファイルサイズ (5MB)
        private const long MaxFileSize = 5 * 1024 * 1024;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// 画像アップロードAPI
        /// POST /api/upload
        /// </summary>
        /// <param name="file">アップロードする画像ファイル</param>
        /// <returns>アップロードされた画像のURL</returns>
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                // 1. ファイルが送信されているか確認
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "ファイルが選択されていません" });
                }

                // 2. ファイルサイズチェック
                if (file.Length > MaxFileSize)
                {
                    return BadRequest(new { message = "ファイルサイズは5MB以下にしてください" });
                }

                // 3. ファイル拡張子チェック
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(extension))
                {
                    return BadRequest(new { message = "jpg, jpeg, png, gif, webp形式のファイルのみアップロード可能です" });
                }

                // 4. 保存先ディレクトリを作成（存在しない場合）
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // 5. ユニークなファイル名を生成（タイムスタンプ + GUID）
                var uniqueFileName = $"{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // 6. ファイルを保存
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 7. アクセス可能なURLを生成
                var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";

                _logger.LogInformation($"画像アップロード成功: {uniqueFileName}");

                // 8. URLを返却
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError($"画像アップロードエラー: {ex.Message}");
                return StatusCode(500, new { message = "画像のアップロードに失敗しました" });
            }
        }

        /// <summary>
        /// 画像削除API (オプション)
        /// DELETE /api/upload
        /// </summary>
        /// <param name="fileName">削除するファイル名</param>
        [HttpDelete]
        public IActionResult DeleteImage([FromQuery] string fileName)
        {
            try
            {
                // 1. ファイル名のバリデーション（パストラバーサル対策）
                if (string.IsNullOrEmpty(fileName) || fileName.Contains(".."))
                {
                    return BadRequest(new { message = "無効なファイル名です" });
                }

                // 2. ファイルパスを構築
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);

                // 3. ファイルが存在するか確認
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new { message = "ファイルが見つかりません" });
                }

                // 4. ファイルを削除
                System.IO.File.Delete(filePath);

                _logger.LogInformation($"画像削除成功: {fileName}");
                return Ok(new { message = "画像を削除しました" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"画像削除エラー: {ex.Message}");
                return StatusCode(500, new { message = "画像の削除に失敗しました" });
            }
        }
    }
}