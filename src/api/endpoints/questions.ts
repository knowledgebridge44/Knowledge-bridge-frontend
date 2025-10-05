import { api } from '../axios';
import { Question, QuestionFormData, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Questions (Q&A) API endpoints
 */

export const questionsApi = {
  // Get all questions
  getAll: async (params?: { page?: number; per_page?: number; lesson_id?: number }): Promise<PaginatedResponse<Question>> => {
    const response = await api.get<PaginatedResponse<Question>>('/api/questions', { params });
    return response.data;
  },

  // Get single question
  get: async (id: number): Promise<Question> => {
    const response = await api.get<ApiResponse<Question>>(`/api/questions/${id}`);
    return response.data.data!;
  },

  // Create question (enrolled users only)
  create: async (data: QuestionFormData): Promise<Question> => {
    const response = await api.post<ApiResponse<Question>>('/api/questions', data);
    return response.data.data!;
  },

  // Update question (author only)
  update: async (id: number, data: Partial<QuestionFormData>): Promise<Question> => {
    const response = await api.put<ApiResponse<Question>>(`/api/questions/${id}`, data);
    return response.data.data!;
  },

  // Delete question (author only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/questions/${id}`);
  },
};

