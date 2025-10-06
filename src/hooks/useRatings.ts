import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '@/api';
import { useToast } from './useToast';

export const useRatings = (lessonId: number) => {
  return useQuery({
    queryKey: ['ratings', lessonId],
    queryFn: () => ratingsApi.getByLesson(lessonId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!lessonId,
  });
};

export const useCreateRating = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ lessonId, rating }: { lessonId: number; rating: number }) =>
      ratingsApi.create({ lesson_id: lessonId, rating }),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      toast.success('Rating submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit rating');
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, rating, lessonId }: { id: number; rating: number; lessonId: number }) =>
      ratingsApi.update(id, { rating }),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      toast.success('Rating updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update rating');
    },
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, lessonId }: { id: number; lessonId: number }) =>
      ratingsApi.delete(id),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
      toast.success('Rating deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete rating');
    },
  });
};

