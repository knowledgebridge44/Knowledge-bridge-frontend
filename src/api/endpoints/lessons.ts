import { api } from '../axios';
import { Lesson, LessonFormData, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Lessons API endpoints
 */

export const lessonsApi = {
  // Get lessons for a course
  getForCourse: async (courseId: number, params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Lesson>> => {
    const response = await api.get<PaginatedResponse<Lesson>>(`/api/courses/${courseId}/lessons`, { params });
    return response.data;
  },

  // Get single lesson
  get: async (id: number): Promise<Lesson> => {
    const response = await api.get<ApiResponse<Lesson>>(`/api/lessons/${id}`);
    return response.data.data!;
  },

  // Create lesson (teacher only)
  create: async (courseId: number, data: LessonFormData): Promise<Lesson> => {
    const response = await api.post<ApiResponse<Lesson>>(`/api/courses/${courseId}/lessons`, data);
    return response.data.data!;
  },

  // Update lesson (teacher only)
  update: async (id: number, data: Partial<LessonFormData>): Promise<Lesson> => {
    const response = await api.put<ApiResponse<Lesson>>(`/api/lessons/${id}`, data);
    return response.data.data!;
  },

  // Delete lesson (teacher only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/lessons/${id}`);
  },

  // Approve lesson (admin only)
  approve: async (id: number): Promise<Lesson> => {
    const response = await api.patch<ApiResponse<Lesson>>(`/api/lessons/${id}/approve`);
    return response.data.data!;
  },

  // Get pending lessons (admin only)
  getPending: async (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Lesson>> => {
    const response = await api.get<PaginatedResponse<Lesson>>('/api/lessons', {
      params: { ...params, status: 'pending' },
    });
    return response.data;
  },
};



