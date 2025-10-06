import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/api';
import { useToast } from '@/providers/ToastProvider';

export const useQuestions = (page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['questions', page, perPage],
    queryFn: () => questionsApi.getAll({ page, per_page: perPage }),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionsApi.get(id),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { lesson_id: number; title: string; content: string }) =>
      questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Question posted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to post question');
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title?: string; content?: string } }) =>
      questionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', id] });
      toast.success('Question updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update question');
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast.success('Question deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete question');
    },
  });
};

export const useQuestionComments = (questionId: number) => {
  return useQuery({
    queryKey: ['questionComments', questionId],
    queryFn: () => commentsApi.getByQuestion(questionId),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!questionId,
  });
};

export const useCreateQuestionComment = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ questionId, content }: { questionId: number; content: string }) =>
      commentsApi.create({ question_id: questionId, content }),
    onSuccess: (_, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: ['questionComments', questionId] });
      toast.success('Answer posted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to post answer');
    },
  });
};

// Import commentsApi to avoid duplication
import { commentsApi } from '@/api';


