import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@/api';
import { LessonFormData } from '@/types';
import { useToast } from './useToast';

export const useLesson = (id: number) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsApi.get(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCourseLessons = (courseId: number, page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['course-lessons', courseId, page, perPage],
    queryFn: () => lessonsApi.getForCourse(courseId, { page, per_page: perPage }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!courseId,
  });
};

export const usePendingLessons = (page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['pending-lessons', page, perPage],
    queryFn: () => lessonsApi.getPending({ page, per_page: perPage }),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent refresh for admin)
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: LessonFormData }) =>
      lessonsApi.create(courseId, data),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      toast.success('Lesson created successfully (pending approval)');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lesson');
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LessonFormData> }) =>
      lessonsApi.update(id, data),
    onSuccess: (lesson) => {
      queryClient.invalidateQueries({ queryKey: ['lesson', lesson.id] });
      queryClient.invalidateQueries({ queryKey: ['course-lessons', lesson.course_id] });
      toast.success('Lesson updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lesson');
    },
  });
};

export const useApproveLesson = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => lessonsApi.approve(id),
    onSuccess: (lesson) => {
      queryClient.invalidateQueries({ queryKey: ['pending-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', lesson.id] });
      queryClient.invalidateQueries({ queryKey: ['course-lessons', lesson.course_id] });
      toast.success('Lesson approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve lesson');
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => lessonsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['pending-lessons'] });
      toast.success('Lesson deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete lesson');
    },
  });
};



