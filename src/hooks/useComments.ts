import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api';
import { useToast } from './useToast';

export const useComments = (lessonId: number) => {
  return useQuery({
    queryKey: ['comments', lessonId],
    queryFn: () => commentsApi.getByLesson(lessonId),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!lessonId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ lessonId, content }: { lessonId: number; content: string }) =>
      commentsApi.createForLesson(lessonId, { content }),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', lessonId] });
      toast.success('Comment posted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to post comment');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string; lessonId?: number }) =>
      commentsApi.update(id, { content }),
    onSuccess: (_, { lessonId }) => {
      if (lessonId) {
        queryClient.invalidateQueries({ queryKey: ['comments', lessonId] });
      }
      toast.success('Comment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, lessonId }: { id: number; lessonId: number }) =>
      commentsApi.delete(id),
    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', lessonId] });
      toast.success('Comment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment');
    },
  });
};


