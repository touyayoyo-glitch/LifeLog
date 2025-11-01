import { useState, useRef } from 'react';
import * as api from '../services/api';

interface ImageUploadProps {
  /** 現在の画像URL */
  currentImageUrl?: string;
  /** 画像が変更されたときのコールバック */
  onImageChange: (url: string) => void;
  /** ラベル文字列 */
  label?: string;
}

/**
 * 画像アップロードコンポーネント
 * ファイル選択 → プレビュー → アップロード
 */
export default function ImageUpload({ 
  currentImageUrl, 
  onImageChange,
  label = "画像"
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * ファイル選択時の処理
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください');
      return;
    }

    // ファイル形式チェック
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('jpg, jpeg, png, gif, webp形式のファイルのみアップロード可能です');
      return;
    }

    setError('');

    // プレビュー表示
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // アップロード実行
    try {
      setUploading(true);
      const url = await api.uploadImage(file);
      onImageChange(url);
    } catch (err: any) {
      setError(err.response?.data?.message || '画像のアップロードに失敗しました');
      setPreview(currentImageUrl || '');
    } finally {
      setUploading(false);
    }
  };

  /**
   * 画像削除
   */
  const handleRemove = () => {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* プレビュー */}
      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="プレビュー"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* ファイル選択ボタン */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer text-sm"
        >
          {uploading ? 'アップロード中...' : preview ? '画像を変更' : '画像を選択'}
        </label>
        {uploading && (
          <span className="text-sm text-gray-500">アップロード中...</span>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}