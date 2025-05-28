export type Bill = {
  id: number;
  idBill: number;
  billdate: Date;
  state: string;
}

export type Credit = {
  id: number;
  user: {
    id: number;
    name: string;
    lastName: string;
  };
  applicant: {
    id: number;
    name: string;
    lastName: string;
  };
  managingPerson: {
    id: number;
    name: string;
    lastName: string;
  } | null;
  faculty: {
    id: number;
    name: string;
  };
  debtAmount: number;
  createdAt: Date;
  state: number;
  bills: Bill[];
}
