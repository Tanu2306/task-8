import { api } from './api';
import { Comment } from '../types';

export const commentService = {
  async getComments(taskId: number): Promise<Comment[]> {
    const res = await api.get<Comment[]>(`/tasks/${taskId}/comments`);
    return res.data;
  },

  async addComment(taskId: number, content: string): Promise<Comment> {
    const res = await api.post<Comment>(`/tasks/${taskId}/comments`, { content });
    return res.data;
  },

  async updateComment(commentId: number, content: string): Promise<Comment> {
    const res = await api.put<Comment>(`/comments/${commentId}`, { content });
    return res.data;
  },

  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  }
};
