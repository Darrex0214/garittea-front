export interface CreditNote {
  id: number;
  amount: number;
  reason: string;
  initialBill: {
    idbill: number;
    billdate: string;
    state: string;
  };
  finalBill: {
    idbill: number;
    billdate: string;
    state: string;
  };
}
