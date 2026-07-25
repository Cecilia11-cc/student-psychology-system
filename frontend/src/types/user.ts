export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'psychologist' | 'parent';
  school_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
