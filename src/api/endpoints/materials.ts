import { api } from '../axios';
import { Material, ApiResponse } from '@/types';

/**
 * Materials API endpoints
 */

export const materialsApi = {
  // Get materials for a lesson
  getByLesson: async (lessonId: number): Promise<{ data: Material[] }> => {
    const response = await api.get(`/api/lessons/${lessonId}/materials`);
    return response.data;
  },

  // Upload material for lesson (teacher only)
  upload: async (lessonId: number, data: FormData): Promise<Material> => {
    const response = await api.post<ApiResponse<Material>>(
      `/api/lessons/${lessonId}/materials`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data!;
  },

  // Get download URL (enrolled users only)
  getDownloadUrl: (materialId: number): string => {
    return `/api/materials/${materialId}/download`;
  },

  // Download material (enrolled users only)
  download: async (materialId: number): Promise<Blob> => {
    const response = await api.get(`/api/materials/${materialId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete material (teacher only)
  delete: async (materialId: number): Promise<void> => {
    await api.delete(`/api/materials/${materialId}`);
  },
};



