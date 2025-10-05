import { api } from '../axios';
import { Rating, ApiResponse } from '@/types';

/**
 * Ratings API endpoints
 */

export const ratingsApi = {
  // Create rating for lesson (enrolled users only, one per lesson)
  create: async (lessonId: number, rating: number): Promise<Rating> => {
    const response = await api.post<ApiResponse<Rating>>(`/api/lessons/${lessonId}/ratings`, {
      rating,
    });
    return response.data.data!;
  },

  // Update rating (author only)
  update: async (id: number, rating: number): Promise<Rating> => {
    const response = await api.put<ApiResponse<Rating>>(`/api/ratings/${id}`, {
      rating,
    });
    return response.data.data!;
  },

  // Delete rating (author only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/ratings/${id}`);
  },
};

