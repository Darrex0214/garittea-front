export type Bill = {
  id: number;
  idBill: number;
  billdate: Date;
  state: 'activo' | 'inactivo';  // Más específico que string
}

export type Credit = {
  id: number;
  user: {
    id: number;
    firstname: string;  // Cambiado de name
    lastname: string;   // Cambiado de lastName
  };
  applicant: {
    id: number;
    name: string;
    lastname: string;   // Cambiado de lastName
  };
  managingPerson: {
    id: number;
    name: string;
    lastname: string;   // Cambiado de lastName
  };
  faculty: {
    id: number;
    name: string;
  };
  debtAmount: number;
  createdAt: Date;
  state: number;
  observaciones?: string;
  bill: Bill | null;
}
