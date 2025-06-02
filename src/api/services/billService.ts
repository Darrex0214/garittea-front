import { useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';

interface BillData {
  idbill: number;
  orderId: number;
  billdate?: Date;
}

interface UpdateBillStateData {
  state: 'activo' | 'nota' | 'anulado';
}

export const billService = {
  // Servicio existente
  getAssociatedNotes: async (consecutivos: string[]) => {
    const response = await api.post(endpoints.associatedNotes, { consecutivos });
    return response.data;
  },

  // Nuevo servicio para crear factura
  dispatchBill: async (data: BillData) => {
    const response = await api.post(endpoints.dispatchBill, data);
    return response.data;
  },

  // Nuevo servicio para actualizar estado
  updateBillState: async (id: number, data: UpdateBillStateData) => {
    const response = await api.patch(endpoints.updateBillStatus(id), data);
    return response.data;
  }
};

// Hook existente
export const useGetAssociatedNotes = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => useMutation({
  mutationFn: billService.getAssociatedNotes,
  ...options,
});

// Nuevos hooks
export const useDispatchBill = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => useMutation({
  mutationFn: billService.dispatchBill,
  ...options,
});

export const useUpdateBillState = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => useMutation({
  mutationFn: ({ id, data }: { id: number; data: UpdateBillStateData }) => 
    billService.updateBillState(id, data),
  ...options,
});