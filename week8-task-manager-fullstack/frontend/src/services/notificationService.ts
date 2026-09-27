import { api } from './api';
import { Notification, User } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await api.get<Notification[]>('/notifications');
    return res.data;
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get<{ unreadCount: number }>('/notifications/unread-count');
    return res.data.unreadCount;
  },

  async markAsRead(id: number): Promise<Notification> {
    const res = await api.put<Notification>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  }
};

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const res = await api.get<User[]>('/users');
    return res.data;
  }
};
