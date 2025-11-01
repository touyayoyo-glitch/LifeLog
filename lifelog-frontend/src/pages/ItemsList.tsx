import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import * as api from '../services/api';
import type { Item } from '../types';

/**
 * アイテム一覧画面
 * カテゴリタブで切り替え可能
 */
export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // カテゴリマッピング（英語 → 日本語）
  const categories = [
    { value: 'all', label: 'すべて', icon: '📋' },
    { value: 'shopping', label: '買い物', icon: '🛒' },
    { value: 'movie', label: '映画', icon: '🎬' },
    { value: 'drama', label: 'ドラマ', icon: '📺' },
    { value: 'manga', label: '漫画', icon: '📚' },
    { value: 'place', label: '場所', icon: '📍' },
    { value: 'goal', label: '目標', icon: '🎯' },
  ];

  useEffect(() => {
    loadItems();
  }, [category]);

  const loadItems = async () => {
    try {
      const data = category === 'all' 
        ? await api.getItems()
        : await api.getItems(category);
      setItems(data);
    } catch (error) {
      console.error('アイテム取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 完了切替
  const handleToggle = async (id: number) => {
    try {
      await api.toggleItem(id);
      loadItems();
    } catch (error) {
      console.error('アイテム切替エラー:', error);
    }
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm('このアイテムを削除しますか?')) return;

    try {
      await api.deleteItem(id);
      loadItems();
    } catch (error) {
      console.error('アイテム削除エラー:', error);
    }
  };

  // カテゴリラベル取得
  const getCategoryLabel = (cat: string) => {
    return categories.find(c => c.value === cat)?.label || cat;
  };

  // カテゴリアイコン取得
  const getCategoryIcon = (cat: string) => {
    return categories.find(c => c.value === cat)?.icon || '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="リスト" />

      <main className="p-4">
        {/* カテゴリタブ */}
        <div className="overflow-x-auto mb-4">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  category === cat.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 新規作成ボタン */}
        <button
          onClick={() => navigate('/items/new')}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 mb-4"
        >
          + 新規アイテム
        </button>

        {/* アイテム一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-8">
              アイテムがありません
            </p>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow p-4 ${
                  item.completed ? 'opacity-60' : ''
                }`}
              >
                {/* カテゴリバッジ */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    {getCategoryIcon(item.category)} {getCategoryLabel(item.category)}
                  </span>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggle(item.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                {/* 画像 */}
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}

                {/* タイトル */}
                <h3
                  className={`font-semibold mb-2 cursor-pointer ${
                    item.completed ? 'line-through text-gray-400' : ''
                  }`}
                  onClick={() => navigate(`/items/${item.id}/edit`)}
                >
                  {item.title}
                </h3>

                {/* 説明 */}
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                )}

                {/* リンク */}
                {item.linkUrl && (
                  <a // ✨ 修正: <a> タグを追加
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block mb-2"
                  >
                    🔗 リンクを開く
                  </a>
                )}

                {/* アクションボタン */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/items/${item.id}/edit`)}
                    className="flex-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}