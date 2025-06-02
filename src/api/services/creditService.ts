import { Credit } from 'src/types/credit';
import { endpoints } from '../endpoints';
import api from '../client';

interface CreateCreditPayload {
  userId: number;         // Agregado para coincidir con backend
  applicantId: number;
  managingPersonId: number;
  facultyId: number;
  debtAmount: number;
  observaciones?: string;
}

interface UpdateCreditPayload {
  debtAmount?: number;
  state?: number;
  managingPersonId?: number;
  observaciones?: string;
  bill?: {
    idBill: number;
    billdate: Date;
    state: string;
  };
}

interface DeleteCreditResponse {
  deletedId: number;
  message: string;
}

export const creditService = {
  // Servicios base
  getAllCredits: () => 
    api.get<Credit[]>(endpoints.credits)
    .then(res => res.data),

  getCreditById: (id: string) => 
    api.get<Credit>(endpoints.creditById(id))
    .then(res => res.data),

  // Servicios de búsqueda
  getOrdersByDates: (startDate: string, endDate: string) =>
    api.get<Credit[]>(endpoints.creditsByDates, { 
      params: { startDate, endDate } 
    }).then(res => res.data),

  getOrdersByFacultyAndState: (faculty?: string, state?: string) =>
    api.get<Credit[]>(endpoints.creditsByFaculty, { 
      params: { facultyId: faculty, state } 
    }).then(res => res.data),

  getOrdersByApplicant: (applicantId: string) =>
    api.get<Credit[]>(endpoints.creditsByApplicant, {
      params: { id: applicantId }
    }).then(res => res.data),

  getOrdersByIdManagingPerson: (id: string) =>
    api.get<Credit[]>(endpoints.creditsByManagingPerson, { 
      params: { id } 
    }).then(res => res.data),

  // Servicios de gestión
  createCredit: (data: CreateCreditPayload) =>
    api.post<Credit>(endpoints.credits, data)
    .then(res => res.data),

  updateCreditById: (id: string, data: UpdateCreditPayload) =>
    api.patch<Credit>(endpoints.updateCreditById(id), data)
    .then(res => res.data),

  deleteCredit: (id: number) => 
    api.delete<DeleteCreditResponse>(endpoints.deleteCreditById(id.toString()))
    .then(res => res.data)
    .catch(error => {
      if (error.response?.status === 400 && error.response?.data?.error === 'ORDER_HAS_BILL') {
        throw new Error('No se puede eliminar un pedido que tiene factura asociada');
      }
      throw error;
    }),

  // Servicios de verificación
  checkCreditHasBill: (id: string) =>
    api.get<{hasBill: boolean}>(endpoints.checkCreditBill(id))
    .then(res => res.data),
};