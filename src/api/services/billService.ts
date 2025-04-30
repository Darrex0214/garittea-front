import { useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';


export const billService = {
  getAssociatedNotes: async (consecutivos: string[]) => {
    const response = await api.post(endpoints.associatedNotes, { consecutivos });
    return response.data;
  },
};

export const useGetAssociatedNotes = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) =>
  useMutation({
    mutationFn: billService.getAssociatedNotes,
    ...options,
  });
