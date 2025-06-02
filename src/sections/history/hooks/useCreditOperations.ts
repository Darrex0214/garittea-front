import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '../../../api/services/creditService';
import { billService } from '../../../api/services/billService';

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

interface UpdateCreditInput {
  id: number;  // Cambiado a number para coincidir con el tipo Credit
  data: {
    debtAmount?: number;
    state?: number;
    observaciones?: string;
    bill?: {
      idBill: number;
      billdate: Date;
      state: string;
    };
  }
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
    mutationFn: ({ id, data }: UpdateCreditInput) => {
      console.log('Actualizando crédito:', { id, data });
      return creditService.updateCreditById(id.toString(), {
        ...data,
        // Validaciones específicas según el estado
        debtAmount: data.debtAmount && !data.bill ? data.debtAmount : undefined,
        state: data.state !== undefined ? data.state : undefined,
        observaciones: data.observaciones,
        bill: data.bill ? {
          idBill: data.bill.idBill,
          billdate: data.bill.billdate,
          state: data.bill.state
        } : undefined
    });
      },
      onSuccess: (response) => {
        console.log('Crédito actualizado exitosamente:', response);
        queryClient.invalidateQueries({ queryKey: ['credits'] });
      },
      onError: (error: any) => {
        console.error('Error en updateMutation:', error);
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

  const createBillMutation = useMutation({
    mutationFn: ({ billId, orderId }: { billId: number; orderId: number }) => 
      billService.dispatchBill({
        idbill: billId,
        orderId,
        billdate: new Date()
      }),
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Error al crear la factura';
      onError(message);
    }
  });

  return { 
    createMutation,
    updateMutation,
    deleteMutation,
    createBillMutation
  };
};