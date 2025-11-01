import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TodoList from './pages/TodoList';
import TodoForm from './pages/TodoForm';
import ItemsList from './pages/ItemsList';
import ItemForm from './pages/ItemForm';
import MemosList from './pages/MemosList';
import MemoForm from './pages/MemoForm';

/**
 * 認証が必要なルート用のラッパーコンポーネント
 * ログインしていない場合は/loginにリダイレクト
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 公開ルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 保護されたルート（認証必須） */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Todo関連ルート */}
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route
            path="/todos/new"
            element={
              <PrivateRoute>
                <TodoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/todos/:id/edit"
            element={
              <PrivateRoute>
                <TodoForm />
              </PrivateRoute>
            }
          />

          {/* アイテム関連ルート */}
          <Route
            path="/items"
            element={
              <PrivateRoute>
                <ItemsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/items/new"
            element={
              <PrivateRoute>
                <ItemForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/items/:id/edit"
            element={
              <PrivateRoute>
                <ItemForm />
              </PrivateRoute>
            }
          />

          {/* メモ関連ルート */}
          <Route
            path="/memos"
            element={
              <PrivateRoute>
                <MemosList />
              </PrivateRoute>
            }
          />
          <Route
            path="/memos/new"
            element={
              <PrivateRoute>
                <MemoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/memos/:id/edit"
            element={
              <PrivateRoute>
                <MemoForm />
              </PrivateRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;