import { useQuery } from '@tanstack/react-query'
import type { CreditProps } from '../credito-table-row';
import { creditService } from '../../../api/services/creditService'
import { Credit } from '../../../types/credit'

// ----------------------------------------------------------------------
// Datos mock (realistas según tabla de BD)
const _creditos: CreditProps[] = [
  {
    idcredit: 1,
    user: 2,
    applicantperson: 15,
    managingperson: 3,
    debtamount: 6495,
    state: 1,
    faculty: 3,
  },
  {
    idcredit: 2,
    user: 6,
    applicantperson: 8,
    managingperson: 17,
    debtamount: 29414,
    state: 3,
    faculty: 5,
  },
  {
    idcredit: 3,
    user: 2,
    applicantperson: 7,
    managingperson: 14,
    debtamount: 23372,
    state: 2,
    faculty: 3,
  },
];

// ----------------------------------------------------------------------

export function UserView() {

  const {data: creditData, isError, isPending} = useQuery<Credit[]>({
    queryKey: ['credits'],
    queryFn: () => creditService.getAllCredits().then((res) => res.data),
  });

  console.log(creditData);

  if (isError) {
    return <div>Error loading credits</div>
  }

  return (
    <div>
      {creditData?.map(credit => (
        <p key={credit.id}>{credit.debtAmount}</p>
      ))}
    </div>
  )
  
}