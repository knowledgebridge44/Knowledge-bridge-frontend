import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api';

export const useMostViewedLessons = (limit = 10) => {
  return useQuery({
    queryKey: ['analytics', 'most-viewed-lessons', limit],
    queryFn: () => analyticsApi.getMostViewedLessons({ limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudentActivity = (days = 30) => {
  return useQuery({
    queryKey: ['analytics', 'student-activity', days],
    queryFn: () => analyticsApi.getStudentActivity({ days }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTeacherEngagement = () => {
  return useQuery({
    queryKey: ['analytics', 'teacher-engagement'],
    queryFn: () => analyticsApi.getTeacherEngagement(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['analytics', 'platform-stats'],
    queryFn: () => analyticsApi.getPlatformStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  });
};

