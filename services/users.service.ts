import { api } from './api';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: string[];
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password?: string;
  status: string;
  roles: string[];
}

export interface UserUpdateRequest {
  name: string;
  status: string;
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const usersService = {
  async getAllUsers(): Promise<UserResponse[]> {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users');
    return response.data.data;
  },

  async getActiveTechnicians(): Promise<UserResponse[]> {
    const response = await api.get<ApiResponse<UserResponse[]>>('/users/technicians');
    return response.data.data;
  },

  async searchUsers(query: string): Promise<UserResponse[]> {
    const response = await api.get<ApiResponse<UserResponse[]>>(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return response.data.data;
  },

  async createUser(data: UserCreateRequest): Promise<UserResponse> {
    const response = await api.post<ApiResponse<UserResponse>>('/users', data);
    return response.data.data;
  },

  async updateUser(id: string, data: UserUpdateRequest): Promise<UserResponse> {
    const response = await api.put<ApiResponse<UserResponse>>(`/users/${id}`, data);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async updatePassword(id: string, password: string): Promise<void> {
    await api.put(`/users/${id}/password`, { password });
  }
};
