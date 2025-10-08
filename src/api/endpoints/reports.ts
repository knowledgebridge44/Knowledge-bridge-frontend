import { api } from '../axios';
import { Report, ApiResponse, PaginatedResponse } from '@/types';

/**
 * Reports API endpoints
 */

export const reportsApi = {
  // Get all reports (Admin only)
  getAll: async (): Promise<Report[]> => {
    const response = await api.get('/api/reports');
    return response.data.reports || [];
  },

  // Get a single report
  get: async (id: number): Promise<Report> => {
    const response = await api.get(`/api/reports/${id}`);
    return response.data.report!;
  },

  // Create a new report
  create: async (data: {
    target_type: 'lesson' | 'question' | 'comment';
    target_id: number;
    reason: string;
  }): Promise<Report> => {
    const response = await api.post('/api/reports', data);
    return response.data.report!;
  },

  // Update a report (Admin only - change status)
  update: async (id: number, status: 'open' | 'resolved' | 'dismissed'): Promise<Report> => {
    const response = await api.put(`/api/reports/${id}`, { status });
    return response.data.report!;
  },

  // Delete a report (Admin only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/reports/${id}`);
  },
};


