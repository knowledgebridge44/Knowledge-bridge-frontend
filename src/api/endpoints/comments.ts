import { api } from '../axios';
import { Comment, CommentFormData, ApiResponse } from '@/types';

/**
 * Comments API endpoints
 */

export const commentsApi = {
  // Get comments for a lesson
  getByLesson: async (lessonId: number): Promise<{ data: Comment[] }> => {
    const response = await api.get(`/api/lessons/${lessonId}/comments`);
    return response.data;
  },

  // Get comments for a question
  getByQuestion: async (questionId: number): Promise<{ data: Comment[] }> => {
    const response = await api.get(`/api/questions/${questionId}/comments`);
    return response.data;
  },

  // Get comment
  get: async (id: number): Promise<Comment> => {
    const response = await api.get<ApiResponse<Comment>>(`/api/comments/${id}`);
    return response.data.data!;
  },

  // Create comment for lesson
  createForLesson: async (lessonId: number, data: CommentFormData): Promise<Comment> => {
    const response = await api.post<ApiResponse<Comment>>(`/api/lessons/${lessonId}/comments`, data);
    return response.data.data!;
  },

  // Create comment for question (answer)
  createForQuestion: async (questionId: number, data: CommentFormData): Promise<Comment> => {
    const response = await api.post<ApiResponse<Comment>>(`/api/questions/${questionId}/comments`, data);
    return response.data.data!;
  },

  // Update comment (author only)
  update: async (id: number, data: CommentFormData): Promise<Comment> => {
    const response = await api.put<ApiResponse<Comment>>(`/api/comments/${id}`, data);
    return response.data.data!;
  },

  // Delete comment (author only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/comments/${id}`);
  },
};



