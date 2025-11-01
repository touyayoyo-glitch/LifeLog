// ユーザー型
export interface User {
  id: number;
  email: string;
  username: string;
}

// 認証レスポンス型
export interface AuthResponse {
  token: string;
  user: User;
}

// ログインリクエスト型
export interface LoginRequest {
  email: string;
  password: string;
}

// 登録リクエスト型
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

// Todo型
export interface Todo {
  id: number;
  userId: number;
  title: string;
  description?: string;
  deadline?: string;
  notifyBeforeMinutes: number;
  priority: number;
  completed: boolean;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

// Todoリクエスト型
export interface TodoRequest {
  title: string;
  description?: string;
  deadline?: string;
  notifyBeforeMinutes?: number;
  priority?: number;
  imageUrl?: string;
  linkUrl?: string;
}

// アイテム型
export interface Item {
  id: number;
  userId: number;
  title: string;
  category: string;
  description?: string;
  completed: boolean;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
}

// アイテムリクエスト型
export interface ItemRequest {
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
}

// メモ型
export interface Memo {
  id: number;
  userId: number;
  title: string;
  content?: string;
  createdAt: string;
}

// メモリクエスト型
export interface MemoRequest {
  title: string;
  content?: string;
}