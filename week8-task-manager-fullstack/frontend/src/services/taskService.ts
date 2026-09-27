import { api } from './api';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskFilters, DashboardStats } from '../types';

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);

    const res = await api.get<Task[]>(`/tasks?${params.toString()}`);
    return res.data;
  },

  async getTaskById(id: number): Promise<Task> {
    const res = await api.get<Task>(`/tasks/${id}`);
    return res.data;
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const res = await api.post<Task>('/tasks', data);
    return res.data;
  },

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task> {
    const res = await api.put<Task>(`/tasks/${id}`, data);
    return res.data;
  },

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const res = await api.put<Task>(`/tasks/${id}/status`, { status });
    return res.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>('/tasks/stats');
    return res.data;
  }
};
