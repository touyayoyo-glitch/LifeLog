import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import * as api from '../services/api';
import type { Todo } from '../types';

/**
 * Todo一覧画面
 * フィルタ・検索機能付き
 */
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Todo取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // フィルタリング
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 完了切替
  const handleToggle = async (id: number) => {
    try {
      await api.toggleTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Todo切替エラー:', error);
    }
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm('このTodoを削除しますか?')) return;

    try {
      await api.deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Todo削除エラー:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Todo" />

      <main className="p-4">
        {/* フィルタボタン */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            すべて ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            未完了 ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            完了 ({todos.filter(t => t.completed).length})
          </button>
        </div>

        {/* 新規作成ボタン */}
        <button
          onClick={() => navigate('/todos/new')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
        >
          + 新規Todo
        </button>

        {/* Todo一覧 */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Todoがありません</p>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-3">
                  {/* チェックボックス */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                    className="mt-1 w-5 h-5 cursor-pointer"
                  />

                  {/* 内容 */}
                  <div className="flex-1" onClick={() => navigate(`/todos/${todo.id}/edit`)}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.title}
                      </h3>
                      {getPriorityBadge(todo.priority)}
                    </div>

                    {todo.description && (
                      <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                    )}

                    {todo.deadline && (
                      <p className="text-sm text-gray-500">
                        📅 {new Date(todo.deadline).toLocaleString('ja-JP')}
                      </p>
                    )}

                    {todo.imageUrl && (
                      <img
                        src={todo.imageUrl}
                        alt={todo.title}
                        className="mt-2 w-full h-40 object-cover rounded"
                      />
                    )}

                    {todo.linkUrl && (
                      <a
                        href={todo.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-2 block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 リンクを開く
                      </a>
                    )}
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-600 hover:text-red-800"
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