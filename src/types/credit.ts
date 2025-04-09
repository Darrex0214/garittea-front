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
  state: number;
}
