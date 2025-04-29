export interface CreditNote {
  id: number;
  amount: number;
  reason: string;
  bill: {
    idbill: number;
    billdate: string;
    amount: number;
    state: string;
  };
}
