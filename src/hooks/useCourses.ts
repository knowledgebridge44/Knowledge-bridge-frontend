import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/api';
import { Course } from '@/types';
import { useToast } from './useToast';

export const useCourses = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['courses', page, perPage],
    queryFn: () => coursesApi.getAll({ page, per_page: perPage }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useCourse = (id: number, includeLessons = false) => {
  return useQuery({
    queryKey: ['course', id, includeLessons],
    queryFn: () => coursesApi.get(id, includeLessons ? { include: 'lessons' } : undefined),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (courseId: number) => coursesApi.enroll(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Successfully enrolled in course');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to enroll in course');
    },
  });
};

export const useUnenrollCourse = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (courseId: number) => coursesApi.unenroll(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Successfully unenrolled from course');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unenroll from course');
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { title: string; description: string }) => coursesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create course');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) => 
      coursesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      toast.success('Course updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update course');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete course');
    },
  });
};

