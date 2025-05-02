export interface CreditNote {
  id: number;
  amount: number;
  reason: string;
  initialBill: {
    id: number;
    date: string;
    state: string;
  };
  finalBill: {
    id: number;
    date: string;
    state: string;
  };
}
