/*
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

export function HistoryView() {

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
        <p key={credit.id}>{credit.id}</p>
      ))}
    </div>
  )
  
}
  */

import React, { useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { creditService } from '../../../api/services/creditService';
import { Credit } from '../../../types/credit';


export function HistoryView() {
  const { data: creditData, isPending, isError } = useQuery<Credit[]>({
    queryKey: ['credits'],
    queryFn: () => creditService.getAllCredits().then((res) => res.data),
  });

  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);

  type EstadoInfo = {
    text: string;
    color: string;
  };
  
  const getEstadoTexto = (estado: number): EstadoInfo => {
    switch (estado) {
      case 1:
        return { text: 'Pendiente', color: '#c62828' }; // rojo
      case 2:
        return { text: 'Nota credito', color: '#f9a825' };   // amarillo
      case 3:
        return { text: 'Pagado', color: '#2e7d32' };    // verde
      default:
        return { text: 'Desconocido', color: '#757575' }; // gris
    }
  };

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography color="error">Error al cargar los créditos.</Typography>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Historial de Créditos
      </Typography>
      <TableContainer   
      component={Paper}
      
        sx={{
          width: '90%',         
          maxWidth: '1200px',   
          height: '60vh',       
          overflowY: 'auto',
          margin: '0 auto',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Solicitante</TableCell>
              <TableCell>Deuda</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creditData?.map((credit) => (
              <TableRow
                key={credit.id}
                hover
                onClick={() => setSelectedCredit(credit)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{credit.id}</TableCell>
                <TableCell>{`${credit.user.name} ${credit.user.lastName}`}</TableCell>
                <TableCell>{`${credit.applicant.name} ${credit.applicant.lastName}`}</TableCell>
                <TableCell>${credit.debtAmount.toLocaleString()}</TableCell>
                <TableCell
                  sx={{
                    color: getEstadoTexto(credit.state).color,
                    fontWeight: 'bold',
                    backgroundColor: alpha(getEstadoTexto(credit.state).color, 0.15), 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  {getEstadoTexto(credit.state).text}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de detalles */}
      <Dialog open={!!selectedCredit} onClose={() => setSelectedCredit(null)}>
        <DialogTitle>Detalles del Crédito #{selectedCredit?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedCredit && (
            <>
              <Typography><b>Usuario:</b> {selectedCredit.user.name} {selectedCredit.user.lastName}</Typography>
              <Typography><b>Solicitante:</b> {selectedCredit.applicant.name} {selectedCredit.applicant.lastName}</Typography>
              <Typography><b>Gestor:</b> {selectedCredit.managingPerson ? `${selectedCredit.managingPerson.name} ${selectedCredit.managingPerson.lastName}` : 'Sin asignar'}</Typography>
              <Typography><b>Facultad:</b> {selectedCredit.faculty.name}</Typography>
              <Typography><b>Deuda:</b> ${selectedCredit.debtAmount.toLocaleString()}</Typography>
              <Typography
                sx={{
                  color: getEstadoTexto(selectedCredit.state).color,
                  backgroundColor: alpha(getEstadoTexto(selectedCredit.state).color, 0.15), 
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}
              >
                <b>Estado:</b> {getEstadoTexto(selectedCredit.state).text}
              </Typography>

            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

