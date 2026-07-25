import api from '../config/api';
import type { ApiResponse, LoginRequest, TokenResponse, User } from '../types/user';

export const authService = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await api.post<ApiResponse<TokenResponse>>('/auth/login', data);
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const response = await api.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );
    return response.data.data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
};
