import { api } from '../axios';
import { Course, PaginatedResponse, ApiResponse } from '@/types';

/**
 * Courses API endpoints
 */

export const coursesApi = {
  // Get all courses
  getAll: async (params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<Course>> => {
    const response = await api.get<PaginatedResponse<Course>>('/api/courses', { params });
    return response.data;
  },

  // Get single course (with optional lessons included)
  get: async (id: number, options?: { include?: 'lessons' }): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(`/api/courses/${id}`, {
      params: options,
    });
    return response.data.data!;
  },

  // Create course (teacher only)
  create: async (data: { title: string; description: string }): Promise<Course> => {
    const response = await api.post<ApiResponse<Course>>('/api/courses', data);
    return response.data.data!;
  },

  // Update course (teacher only)
  update: async (id: number, data: { title?: string; description?: string }): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(`/api/courses/${id}`, data);
    return response.data.data!;
  },

  // Delete course (teacher only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/courses/${id}`);
  },

  // Enroll in course
  enroll: async (courseId: number): Promise<void> => {
    await api.post(`/api/courses/${courseId}/enroll`);
  },

  // Unenroll from course
  unenroll: async (courseId: number): Promise<void> => {
    await api.delete(`/api/courses/${courseId}/unenroll`);
  },
};


