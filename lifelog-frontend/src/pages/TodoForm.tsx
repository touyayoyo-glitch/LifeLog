import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ImageUpload from '../components/ImageUpload';
import * as api from '../services/api';
import type { TodoRequest } from '../types';

/**
 * Todo作成・編集フォーム
 * /todos/new - 新規作成
 * /todos/:id/edit - 編集
 */
export default function TodoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // フォーム状態
  const [formData, setFormData] = useState<TodoRequest>({
    title: '',
    description: '',
    deadline: '',
    notifyBeforeMinutes: 30,
    priority: 0,
    imageUrl: '',
    linkUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 編集モードの場合、既存データを読み込み
  useEffect(() => {
    if (isEdit) {
      loadTodo();
    }
  }, [id]);

  const loadTodo = async () => {
    try {
      const response = await api.getTodos();
      const todo = response.find(t => t.id === Number(id));
      if (todo) {
        setFormData({
          title: todo.title,
          description: todo.description || '',
          deadline: todo.deadline ? new Date(todo.deadline).toISOString().slice(0, 16) : '',
          notifyBeforeMinutes: todo.notifyBeforeMinutes,
          priority: todo.priority,
          imageUrl: todo.imageUrl || '',
          linkUrl: todo.linkUrl || '',
        });
      }
    } catch (err) {
      console.error('Todoデータ取得エラー:', err);
    }
  };

  // 入力値変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' || name === 'notifyBeforeMinutes' ? Number(value) : value,
    }));
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
      // 期限がある場合はISO形式に変換
      const submitData: TodoRequest = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      };

      if (isEdit) {
        await api.updateTodo(Number(id), submitData);
      } else {
        await api.createTodo(submitData);
      }

      navigate('/todos');
    } catch (err: any) {
      setError(err.response?.data?.message || '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={isEdit ? 'Todo編集' : 'Todo作成'} showBack />

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              maxLength={200}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 期限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              期限
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 通知時間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              期限の何分前に通知
            </label>
            <select
              name="notifyBeforeMinutes"
              value={formData.notifyBeforeMinutes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5分前</option>
              <option value={15}>15分前</option>
              <option value={30}>30分前</option>
              <option value={60}>1時間前</option>
              <option value={1440}>1日前</option>
            </select>
          </div>

          {/* 優先度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              優先度
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>通常</option>
              <option value={1}>重要</option>
              <option value={2}>緊急</option>
            </select>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              maxLength={500}
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : isEdit ? '更新' : '作成'}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}