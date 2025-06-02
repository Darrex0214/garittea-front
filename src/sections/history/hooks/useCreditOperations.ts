import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '../../../api/services/creditService';

interface FormInputs {
  applicantId: number;
  facultyId: number;
  debtAmount: number;
  managingPersonId: number;
  observaciones?: string;
}

interface CreateCreditPayload {
  applicantId: number;
  facultyId: number;
  debtAmount: number;
  managingPersonId: number;
  userId: number;
  state?: number;
  observaciones?: string;
}

export const useCreditOperations = (onError: (message: string) => void) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormInputs) => {
      const payload: CreateCreditPayload = {
        ...data,
        userId: 1, // O el ID del usuario actual
        state: 4,
        observaciones: data.observaciones
      };
      return creditService.createCredit(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Error al crear el crédito';
      onError(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      creditService.updateCreditById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Error al actualizar el crédito';
      onError(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      console.log('Llamando a deleteCredit con id:', id);
      return creditService.deleteCredit(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
    onError: (error: any) => {
      console.error('Error en deleteMutation:', error);
      const message = error?.response?.data?.error || 'Error al eliminar el crédito';
      onError(message);
    },
  });

  return { 
    createMutation,
    updateMutation,
    deleteMutation 
  };
};