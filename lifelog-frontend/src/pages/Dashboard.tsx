import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import * as api from '../services/api';
import type { Todo, Item, Memo } from '../types';

/**
 * ダッシュボード画面
 * 今日のTodo、最近のアイテム、メモを表示
 */
export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [todosData, itemsData, memosData] = await Promise.all([
        api.getTodos(),
        api.getItems(),
        api.getMemos(),
      ]);
      setTodos(todosData);
      setItems(itemsData);
      setMemos(memosData);
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // Todo完了切替
  const handleToggleTodo = async (id: number) => {
    try {
      await api.toggleTodo(id);
      loadData();
    } catch (error) {
      console.error('Todo切替エラー:', error);
    }
  };

  // 優先度バッジ
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 2:
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">緊急</span>;
      case 1:
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">重要</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  // 未完了のTodoのみ表示
  const activeTodos = todos.filter(t => !t.completed);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="LifeLog" />

      <main className="p-4 space-y-6">
        {/* ウェルカムメッセージ */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">おかえりなさい！</h2>
          <p className="text-blue-100">
            今日のタスク: {activeTodos.length}件
          </p>
        </div>

        {/* 今日のTodo */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800">📝 今日のTodo</h3>
            <button
              onClick={() => navigate('/todos')}
              className="text-sm text-blue-600 hover:underline"
            >
              もっと見る →
            </button>
          </div>

          <div className="space-y-2">
            {activeTodos.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                予定がありません
              </div>
            ) : (
              activeTodos.slice(0, 5).map(todo => (
                <div key={todo.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo.id)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{todo.title}</h4>
                        {getPriorityBadge(todo.priority)}
                      </div>
                      {todo.deadline && (
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {new Date(todo.deadline).toLocaleString('ja-JP')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 最近のアイテム */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800">🎯 最近のリスト</h3>
            <button
              onClick={() => navigate('/items')}
              className="text-sm text-blue-600 hover:underline"
            >
              もっと見る →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {items.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-3 cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/items/${item.id}/edit`)}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}
                <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                <h4 className="font-semibold text-sm truncate">{item.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* 最近のメモ */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800">📝 最近のメモ</h3>
            <button
              onClick={() => navigate('/memos')}
              className="text-sm text-blue-600 hover:underline"
            >
              もっと見る →
            </button>
          </div>

          <div className="space-y-2">
            {memos.slice(0, 3).map(memo => (
              <div
                key={memo.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => navigate(`/memos/${memo.id}/edit`)}
              >
                <h4 className="font-semibold mb-1">{memo.title}</h4>
                {memo.content && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {memo.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}