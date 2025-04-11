// src/api/services/creditService.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Credit } from 'src/types/credit';
import { api } from '../client';
import { endpoints } from '../endpoints';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const creditService = {
  getAllCredits: () => api.get(endpoints.credits),
  getCreditById: (id: string) => api.get(endpoints.creditById(id)),
  createCredit: (data: any) => api.post(endpoints.credits, data),
  deleteCredit: (id: number) => api.delete(`/credits/${id}`),
};

export const useGetCredits = () => useQuery({
  queryKey: ['credits'],
  queryFn: async () => {
    const response = await axios.get<Credit[]>(`${API_URL}/credits`);
    return response.data;
  },
});
