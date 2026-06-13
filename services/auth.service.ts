import { api } from './api';
import { useAuthStore } from '@/store/auth.store';
import { ApiResponse, AuthResponse, UserResponse } from '@/types/auth.types';

export const authService = {
  async register(name: string, email: string, password: string, roles: string[] = ['ROLE_CLIENT_VIEWER']): Promise<UserResponse> {
    const response = await api.post<ApiResponse<UserResponse>>('/auth/register', {
      name,
      email,
      password,
      roles,
    });
    return response.data.data;
  },

  async login(email: string, password: string): Promise<UserResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    const { accessToken, user } = response.data.data;
    useAuthStore.getState().setAuth(accessToken, user);
    return user;
  },

  async refresh(): Promise<string> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', {});
      const { accessToken, user } = response.data.data;
      useAuthStore.getState().setAuth(accessToken, user);
      return accessToken;
    } catch (error) {
      useAuthStore.getState().clearAuth();
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post<ApiResponse<void>>('/auth/logout', {});
    } finally {
      useAuthStore.getState().clearAuth();
    }
  },

  async me(): Promise<UserResponse> {
    const response = await api.get<ApiResponse<UserResponse>>('/auth/me');
    const user = response.data.data;
    const token = useAuthStore.getState().accessToken;
    if (token) {
      useAuthStore.getState().setAuth(token, user);
    }
    return user;
  },

  async changePassword(currentPassword: string, newPassword: string, otp: string): Promise<void> {
    await api.put<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
      otp,
    });
  },

  async requestOtp(currentPassword: string): Promise<void> {
    await api.post<ApiResponse<void>>('/auth/change-password/request-otp', {
      currentPassword,
    });
  },
};
export default authService;
