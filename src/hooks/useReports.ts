import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/api';
import { Report } from '@/types';
import { useToast } from '@/providers/ToastProvider';

/**
 * Hook to fetch all reports (Admin only)
 */
export const useReports = () => {
  return useQuery<Report[], Error>({
    queryKey: ['reports'],
    queryFn: () => reportsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single report
 */
export const useReport = (id: number) => {
  return useQuery<Report, Error>({
    queryKey: ['report', id],
    queryFn: () => reportsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a report
 */
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: { target_type: 'lesson' | 'question' | 'comment'; target_id: number; reason: string }) =>
      reportsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report submitted successfully. Our team will review it shortly.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit report');
    },
  });
};

/**
 * Hook to update a report (Admin only)
 */
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'open' | 'resolved' | 'dismissed' }) =>
      reportsApi.update(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update report');
    },
  });
};

/**
 * Hook to delete a report (Admin only)
 */
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number) => reportsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete report');
    },
  });
};


