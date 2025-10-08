import { api } from '../axios';
import {
  LessonViewStats,
  StudentActivityStats,
  TeacherEngagementStats,
  PlatformStats
} from '@/types';

/**
 * Analytics API endpoints (admin only)
 */

export const analyticsApi = {
  // Get most viewed lessons
  getMostViewedLessons: async (params?: { limit?: number }): Promise<LessonViewStats[]> => {
    const response = await api.get('/api/analytics/lessons/most-viewed', { params });
    // Backend returns { most_viewed_lessons: [...] }, so we need to extract that
    return response.data.most_viewed_lessons || [];
  },

  // Get student activity over time
  getStudentActivity: async (params?: { days?: number }): Promise<StudentActivityStats[]> => {
    const response = await api.get('/api/analytics/students/activity', { params });
    // Backend returns { student_activity: [...] }, so we need to extract that
    return response.data.student_activity || [];
  },

  // Get teacher engagement metrics
  getTeacherEngagement: async (): Promise<TeacherEngagementStats[]> => {
    const response = await api.get('/api/analytics/teachers/engagement');
    // Backend returns { teacher_engagement: [...] }, transform to match frontend types
    const teachers = response.data.teacher_engagement || [];
    return teachers.map((teacher: any) => ({
      teacher_id: teacher.id,
      teacher_name: teacher.name,
      lessons_count: teacher.uploaded_lessons_count || 0,
      average_rating: 4.5, // Placeholder since backend doesn't calculate this yet
    }));
  },

  // Get platform-wide statistics
  getPlatformStats: async (): Promise<PlatformStats> => {
    const response = await api.get('/api/analytics/platform/stats');
    const stats = response.data.platform_stats || {};
    return {
      total_users: stats.total_users || 0,
      total_students: stats.total_students || 0,
      total_teachers: stats.total_teachers || 0,
      total_admins: stats.total_admins || 0,
      total_courses: stats.total_courses || 0,
      total_lessons: stats.total_lessons || 0,
      total_enrollments: stats.total_enrollments || 0,
    };
  },
};



