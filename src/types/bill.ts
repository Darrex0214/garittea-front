export interface Bill {
  id: number;
  idbill: number;
  orderId: number;
  billdate: Date;
  state: 'activo' | 'nota' | 'anulado';
}

export interface AssociatedNoteResponse {
  idbill: number;
  stateBill: string;
  hasNote: 'sí' | 'no';
  idNote: number | null;
  amountNote: number | null;
  reasonNote: string | null;
  wasReplaced: 'sí' | 'no';
  replacedBy: number | null;
}