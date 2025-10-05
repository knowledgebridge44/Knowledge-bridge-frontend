import { api } from '../axios';
import {
  LessonViewStats,
  StudentActivityStats,
  TeacherEngagementStats,
  PlatformStats,
  ApiResponse
} from '@/types';

/**
 * Analytics API endpoints (admin only)
 */

export const analyticsApi = {
  // Get most viewed lessons
  getMostViewedLessons: async (params?: { limit?: number }): Promise<LessonViewStats[]> => {
    const response = await api.get<ApiResponse<LessonViewStats[]>>('/api/analytics/lessons/most-viewed', { params });
    return response.data.data!;
  },

  // Get student activity over time
  getStudentActivity: async (params?: { days?: number }): Promise<StudentActivityStats[]> => {
    const response = await api.get<ApiResponse<StudentActivityStats[]>>('/api/analytics/students/activity', { params });
    return response.data.data!;
  },

  // Get teacher engagement metrics
  getTeacherEngagement: async (): Promise<TeacherEngagementStats[]> => {
    const response = await api.get<ApiResponse<TeacherEngagementStats[]>>('/api/analytics/teachers/engagement');
    return response.data.data!;
  },

  // Get platform-wide statistics
  getPlatformStats: async (): Promise<PlatformStats> => {
    const response = await api.get<ApiResponse<PlatformStats>>('/api/analytics/platform/stats');
    return response.data.data!;
  },
};

