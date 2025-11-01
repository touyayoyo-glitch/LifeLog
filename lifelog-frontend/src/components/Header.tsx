import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

/**
 * ヘッダーコンポーネント
 * タイトル、戻るボタン、ログアウトボタン
 */
export default function Header({ title, showBack = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:block">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}