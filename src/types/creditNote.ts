// src/types/creditNote.ts
export interface CreditNote {
    id: number;
    initialBill: {
      id?: number | null;
      date?: string | null;
      amount?: number | null;
      state?: number | null;
    } | null;
    finalBill: {
      id?: number | null;
      date?: string | null;
      amount?: number | null;
      state?: number | null;
    } | null;
  }