// src/api/services/creditNoteService.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';

export const creditNoteService = {
  getAllCreditNotes: () => api.get(endpoints.creditNotes),

  createCreditNote: async (data: { idBill: number; amount: number; reason: string }) => {
    const response = await api.post(endpoints.createCreditNote, data);
    return response.data;
  },
};

export const useGetCreditNotes = () => useQuery({
  queryKey: ['creditNotes'],
  queryFn: async () => {
    const response = await creditNoteService.getAllCreditNotes();
    return response.data;
  },
});

export const useCreateNoteCredit = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) =>
  useMutation({
    mutationFn: creditNoteService.createCreditNote,
    ...options,
  });
