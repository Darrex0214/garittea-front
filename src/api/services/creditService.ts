// src/api/services/creditService.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { Credit } from 'src/types/credit';
import { endpoints } from '../endpoints';
import api from '../client';

// Define un tipo para los datos que se envían al crear un crédito
interface CreateCreditPayload {
  applicantId: number;
  managingPersonId: number | null; // Puede ser null según tu backend
  facultyId: number;
  debtAmount: number;
}

export const creditService = {
  getAllCredits: () => api.get<Credit[]>(endpoints.credits), // Devuelve la promesa directamente
  getCreditById: (id: string) => api.get<Credit>(endpoints.creditById(id)).then(res => res.data),
  createCredit: (data: CreateCreditPayload) =>
    api.post<Credit>(endpoints.credits, data).then(res => res.data),
  deleteCredit: (id: number) => api.delete(`/credits/${id}`).then(res => res.data),
  searchCredits: (filters: { faculty: string; estado: string }) =>
    api.get<Credit[]>(endpoints.credits, { params: filters }).then(res => res.data),
  getCreditsByFacultyAndState: (faculty: string, estado: string) => 
    api.get(endpoints.creditByFacultyAndState(faculty, estado)),
  updateCreditById: (id: string, data: Partial<Credit>) =>
    api.patch<Credit>(endpoints.updateCreditById(id), data).then((res) => res.data),
};

export const useCreateCredit = () => useMutation({
  mutationFn: (creditData: CreateCreditPayload) =>
    creditService.createCredit(creditData),
  // Opcional: Puedes agregar `onSuccess`, `onError`, etc.
});

export const useGetCredits = () => useQuery({
  queryKey: ['credits'],
  queryFn: async () => {
    const response = await api.get<Credit[]>(endpoints.credits);
    return response.data; // Extrae la data aquí en el hook
  },
});