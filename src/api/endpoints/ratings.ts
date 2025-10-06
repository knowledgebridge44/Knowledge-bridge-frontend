import { api } from '../axios';
import { Rating, ApiResponse } from '@/types';

/**
 * Ratings API endpoints
 */

export const ratingsApi = {
  // Get ratings for a lesson
  getByLesson: async (lessonId: number): Promise<{ data: Rating[] }> => {
    const response = await api.get(`/api/lessons/${lessonId}/ratings`);
    return response.data;
  },

  // Create rating for lesson (enrolled users only, one per lesson)
  create: async (lessonId: number, rating: number): Promise<Rating> => {
    const response = await api.post<ApiResponse<Rating>>(`/api/lessons/${lessonId}/ratings`, {
      rating: rating,
    });
    return response.data.data!;
  },

  // Update rating (author only)
  update: async (id: number, rating: number): Promise<Rating> => {
    const response = await api.put<ApiResponse<Rating>>(`/api/ratings/${id}`, {
      rating: rating,
    });
    return response.data.data!;
  },

  // Delete rating (author only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/ratings/${id}`);
  },
};



