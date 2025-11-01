import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import * as api from '../services/api';
import type { Memo } from '../types';

/**
 * メモ一覧画面
 * メモの作成・編集・削除
 */
export default function MemosList() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      const data = await api.getMemos();
      setMemos(data);
    } catch (error) {
      console.error('メモ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm('このメモを削除しますか?')) return;

    try {
      await api.deleteMemo(id);
      loadMemos();
    } catch (error) {
      console.error('メモ削除エラー:', error);
    }
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
      <Header title="メモ" />

      <main className="p-4">
        {/* 新規作成ボタン */}
        <button
          onClick={() => navigate('/memos/new')}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 mb-4"
        >
          + 新規メモ
        </button>

        {/* メモ一覧 */}
        <div className="space-y-3">
          {memos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">メモがありません</p>
          ) : (
            memos.map(memo => (
              <div
                key={memo.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  {/* タイトル・内容 */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/memos/${memo.id}/edit`)}
                  >
                    <h3 className="font-semibold text-lg mb-2">{memo.title}</h3>
                    {memo.content && (
                      <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
                        {memo.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(memo.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleDelete(memo.id)}
                    className="text-red-600 hover:text-red-800 ml-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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