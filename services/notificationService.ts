import { api } from './api';

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  eventType: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const notificationService = {
  getUserNotifications: async (userId: string): Promise<NotificationDto[]> => {
    const response = await api.get<ApiResponse<NotificationDto[]>>(`/notifications/user/${userId}`);
    return response.data.data;
  },

  getUnreadNotifications: async (userId: string): Promise<NotificationDto[]> => {
    const response = await api.get<ApiResponse<NotificationDto[]>>(`/notifications/user/${userId}/unread`);
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<NotificationDto> => {
    const response = await api.post<ApiResponse<NotificationDto>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/notifications/user/${userId}/read-all`);
  }
};
