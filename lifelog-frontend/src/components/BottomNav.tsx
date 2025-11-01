import { Link, useLocation } from 'react-router-dom';

/**
 * スマホ用ボトムナビゲーション
 * Dashboard, Todo, Items, Memosへの遷移
 */
export default function BottomNav() {
  const location = useLocation();

  // 現在のパスをチェック
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {/* ダッシュボード */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/') && location.pathname === '/' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">ホーム</span>
        </Link>

        {/* Todo */}
        <Link
          to="/todos"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/todos') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-xs mt-1">Todo</span>
        </Link>

        {/* アイテム */}
        <Link
          to="/items"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/items') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs mt-1">リスト</span>
        </Link>

        {/* メモ */}
        <Link
          to="/memos"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/memos') ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs mt-1">メモ</span>
        </Link>
      </div>
    </nav>
  );
}