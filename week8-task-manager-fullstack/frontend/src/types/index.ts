export type Role = 'USER' | 'ADMIN';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type NotificationType = 
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'TASK_DELETED'
  | 'COMMENT_ADDED'
  | 'DUE_SOON'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  lastSeen?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  overdue: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  status?: TaskStatus;
  assignedToId?: number;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  assignedToId?: number;
  dueDate?: string;
}

export interface Comment {
  id: number;
  taskId: number;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
  taskId?: number;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | '';
  priority?: Priority | '';
  assignedToId?: number | '';
  sortBy?: 'newest' | 'oldest' | 'priority' | 'duedate';
  sortDirection?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionPercentage: number;
}

export interface WebSocketEvent<T = any> {
  type: string;
  payload: T;
  triggeredBy: string;
  timestamp: string;
}
