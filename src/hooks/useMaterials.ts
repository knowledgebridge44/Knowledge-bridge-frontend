import { useQuery } from '@tanstack/react-query';
import { materialsApi } from '@/api';

export const useMaterials = (lessonId: number) => {
  return useQuery({
    queryKey: ['materials', lessonId],
    queryFn: () => materialsApi.getByLesson(lessonId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!lessonId,
  });
};

export const downloadMaterial = async (materialId: number, filename: string) => {
  try {
    const blob = await materialsApi.download(materialId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download material:', error);
    throw error;
  }
};

