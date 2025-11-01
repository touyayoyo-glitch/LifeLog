import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import * as api from '../services/api';
import type { MemoRequest } from '../types';

/**
 * メモ作成・編集フォーム
 * /memos/new - 新規作成
 * /memos/:id/edit - 編集
 */
export default function MemoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // フォーム状態
  const [formData, setFormData] = useState<MemoRequest>({
    title: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 編集モードの場合、既存データを読み込み
  useEffect(() => {
    if (isEdit) {
      loadMemo();
    }
  }, [id]);

  const loadMemo = async () => {
    try {
      const response = await api.getMemos();
      const memo = response.find(m => m.id === Number(id));
      if (memo) {
        setFormData({
          title: memo.title,
          content: memo.content || '',
        });
      }
    } catch (err) {
      console.error('メモデータ取得エラー:', err);
    }
  };

  // 入力値変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await api.updateMemo(Number(id), formData);
      } else {
        await api.createMemo(formData);
      }

      navigate('/memos');
    } catch (err: any) {
      setError(err.response?.data?.message || '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={isEdit ? 'メモ編集' : 'メモ作成'} showBack />

      <main className="p-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
              maxLength={100}
              placeholder="例: サイズ表"
            />
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              placeholder="メモの内容を入力..."
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : isEdit ? '更新' : '作成'}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}