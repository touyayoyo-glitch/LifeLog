import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ImageUpload from '../components/ImageUpload';
import * as api from '../services/api';
import type { ItemRequest } from '../types';

/**
 * アイテム作成・編集フォーム
 * /items/new - 新規作成
 * /items/:id/edit - 編集
 */
export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // フォーム状態
  const [formData, setFormData] = useState<ItemRequest>({
    title: '',
    category: 'shopping',
    description: '',
    imageUrl: '',
    linkUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // カテゴリ選択肢
  const categories = [
    { value: 'shopping', label: '🛒 買い物' },
    { value: 'movie', label: '🎬 映画' },
    { value: 'drama', label: '📺 ドラマ' },
    { value: 'manga', label: '📚 漫画' },
    { value: 'place', label: '📍 場所' },
    { value: 'goal', label: '🎯 目標' },
  ];

  // 編集モードの場合、既存データを読み込み
  useEffect(() => {
    if (isEdit) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      const response = await api.getItems();
      const item = response.find(i => i.id === Number(id));
      if (item) {
        setFormData({
          title: item.title,
          category: item.category,
          description: item.description || '',
          imageUrl: item.imageUrl || '',
          linkUrl: item.linkUrl || '',
        });
      }
    } catch (err) {
      console.error('アイテムデータ取得エラー:', err);
    }
  };

  // 入力値変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 画像URL変更
  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await api.updateItem(Number(id), formData);
      } else {
        await api.createItem(formData);
      }

      navigate('/items');
    } catch (err: any) {
      setError(err.response?.data?.message || '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={isEdit ? 'アイテム編集' : 'アイテム作成'} showBack />

      <main className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* カテゴリ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
              maxLength={200}
              placeholder="例: 黒いスニーカー"
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="詳細な説明を入力..."
            />
          </div>

          {/* 画像アップロード */}
          <ImageUpload
            currentImageUrl={formData.imageUrl}
            onImageChange={handleImageChange}
            label="画像"
          />

          {/* リンクURL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              リンクURL
            </label>
            <input
              type="url"
              name="linkUrl"
              value={formData.linkUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              maxLength={500}
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : isEdit ? '更新' : '作成'}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}