import { api, setTokens, clearTokens } from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    setTokens(res.data.accessToken, res.data.refreshToken);
    localStorage.setItem('user_data', JSON.stringify(res.data.user));
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    setTokens(res.data.accessToken, res.data.refreshToken);
    localStorage.setItem('user_data', JSON.stringify(res.data.user));
    return res.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      // Silently catch logout API errors
    } finally {
      clearTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    localStorage.setItem('user_data', JSON.stringify(res.data));
    return res.data;
  }
};
