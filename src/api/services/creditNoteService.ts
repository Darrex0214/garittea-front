// src/api/services/creditNoteService.ts
import { useQuery } from '@tanstack/react-query';
import { CreditNote } from 'src/types/creditNote'; // Mueve esta importación arriba
import { api } from '../client';
import { endpoints } from '../endpoints';

export const creditNoteService = {
  getAllCreditNotes: () => api.get(endpoints.creditNotes),
  // Podrías agregar otras funciones aquí si las necesitas (obtener por ID, etc.)
};

export const useGetCreditNotes = () => useQuery({
  queryKey: ['creditNotes'],
  queryFn: async () => {
    const response = await creditNoteService.getAllCreditNotes();
    return response.data;
  },
});