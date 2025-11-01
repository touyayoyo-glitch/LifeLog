import axios from 'axios';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  Todo,
  TodoRequest,
  Item,
  ItemRequest,
  Memo,
  MemoRequest
} from '../types';

// APIのベースURL（環境変数から取得、デフォルトはローカル）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7257/api';

// Axiosインスタンス作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（トークンを自動付与）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプター（401エラー時にログアウト）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== 認証API =====

/**
 * ユーザー登録
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * ログイン
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

// ===== Todo API =====

/**
 * Todo一覧取得
 */
export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get<Todo[]>('/todos');
  return response.data;
};

/**
 * Todo作成
 */
export const createTodo = async (data: TodoRequest): Promise<Todo> => {
  const response = await api.post<Todo>('/todos', data);
  return response.data;
};

/**
 * Todo更新
 */
export const updateTodo = async (id: number, data: TodoRequest): Promise<Todo> => {
  const response = await api.put<Todo>(`/todos/${id}`, data);
  return response.data;
};

/**
 * Todo削除
 */
export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

/**
 * Todo完了切替
 */
export const toggleTodo = async (id: number): Promise<Todo> => {
  const response = await api.patch<Todo>(`/todos/${id}/toggle`);
  return response.data;
};

// ===== Item API =====

/**
 * アイテム一覧取得
 */
export const getItems = async (category?: string): Promise<Item[]> => {
  const url = category ? `/items?category=${category}` : '/items';
  const response = await api.get<Item[]>(url);
  return response.data;
};

/**
 * アイテム作成
 */
export const createItem = async (data: ItemRequest): Promise<Item> => {
  const response = await api.post<Item>('/items', data);
  return response.data;
};

/**
 * アイテム更新
 */
export const updateItem = async (id: number, data: ItemRequest): Promise<Item> => {
  const response = await api.put<Item>(`/items/${id}`, data);
  return response.data;
};

/**
 * アイテム削除
 */
export const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};

/**
 * アイテム完了切替
 */
export const toggleItem = async (id: number): Promise<Item> => {
  const response = await api.patch<Item>(`/items/${id}/toggle`);
  return response.data;
};

// ===== Memo API =====

/**
 * メモ一覧取得
 */
export const getMemos = async (): Promise<Memo[]> => {
  const response = await api.get<Memo[]>('/memos');
  return response.data;
};

/**
 * メモ作成
 */
export const createMemo = async (data: MemoRequest): Promise<Memo> => {
  const response = await api.post<Memo>('/memos', data);
  return response.data;
};

/**
 * メモ更新
 */
export const updateMemo = async (id: number, data: MemoRequest): Promise<Memo> => {
  const response = await api.put<Memo>(`/memos/${id}`, data);
  return response.data;
};

/**
 * メモ削除
 */
export const deleteMemo = async (id: number): Promise<void> => {
  await api.delete(`/memos/${id}`);
};

// ===== 画像アップロードAPI =====

/**
 * 画像をアップロード
 * @param file - アップロードする画像ファイル
 * @returns アップロードされた画像のURL
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ url: string }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

/**
 * 画像を削除
 * @param fileName - 削除する画像のファイル名
 */
export const deleteImage = async (fileName: string): Promise<void> => {
  await api.delete(`/upload?fileName=${fileName}`);
};