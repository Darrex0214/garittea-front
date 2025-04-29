// src/sections/creditNote/CreditNoteView.tsx
import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Popover,
  MenuList,
  MenuItem,
  IconButton,
} from '@mui/material';
import { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import { useGetCreditNotes } from 'src/api/services/creditNoteService';
import { CreditNote } from 'src/types/creditNote';
import { PaginationComponent } from 'src/components/pagination/pagination';

export function CreditNoteView() {
  const { data: creditNoteData, isPending, isError } = useGetCreditNotes();
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);
  const [optionAnchorEl, setOptionAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [optionCreditNote, setOptionCreditNote] = useState<CreditNote | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const displayData = creditNoteData
    ? creditNoteData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Adaptar según los estados de tus facturas si es necesario
  const getEstadoTexto = (estado: number | undefined | null) => {
    switch (estado) {
      case 1:
        return { text: 'Pendiente', color: '#c62828' };
      case 2:
        return { text: 'Aprobada', color: '#2e7d32' };
      // Agrega más casos según tus estados
      default:
        return { text: 'Desconocido', color: '#757575' };
    }
  };

  const renderTable = () => (
    <TableContainer
      component={Paper}
      sx={{ width: '90%', maxWidth: '90vw', height: '70vh', overflowY: 'auto', margin: '0 auto' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>ID Factura Inicial</TableCell>
            <TableCell>Fecha Factura Inicial</TableCell>
            <TableCell>Monto Factura Inicial</TableCell>
            <TableCell>Estado Factura Inicial</TableCell>
            <TableCell>ID Factura Final</TableCell>
            <TableCell>Fecha Factura Final</TableCell>
            <TableCell>Monto Factura Final</TableCell>
            <TableCell>Estado Factura Final</TableCell>
            <TableCell align="right">Opción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((creditNote: CreditNote, index: number) => (
            <TableRow
              key={creditNote.id}
              hover
              onClick={() => setSelectedCreditNote(creditNote)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>{creditNote.initialBill?.id || '-'}</TableCell>
              <TableCell>{creditNote.initialBill?.date ? new Date(creditNote.initialBill.date).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{creditNote.initialBill?.amount ? creditNote.initialBill.amount.toLocaleString() : '-'}</TableCell>
              <TableCell>
                {creditNote.initialBill?.state !== undefined && creditNote.initialBill?.state !== null
                  ? getEstadoTexto(creditNote.initialBill.state).text
                  : '-'}
              </TableCell>
              <TableCell>{creditNote.finalBill?.id || '-'}</TableCell>
              <TableCell>{creditNote.finalBill?.date ? new Date(creditNote.finalBill.date).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{creditNote.finalBill?.amount ? creditNote.finalBill.amount.toLocaleString() : '-'}</TableCell>
              <TableCell>
                {creditNote.finalBill?.state !== undefined && creditNote.finalBill?.state !== null
                  ? getEstadoTexto(creditNote.finalBill.state).text
                  : '-'}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setOptionCreditNote(creditNote);
                    setOptionAnchorEl(e.currentTarget);
                  }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPopover = () => (
    <Popover
      open={Boolean(optionAnchorEl)}
      anchorEl={optionAnchorEl}
      onClose={() => {
        setOptionAnchorEl(null);
        setOptionCreditNote(null);
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuList
        sx={{
          p: 0.5,
          gap: 0.5,
          width: 140,
          display: 'flex',
          flexDirection: 'column',
          [`& .${menuItemClasses.root}`]: {
            px: 1,
            gap: 2,
            borderRadius: 0.75,
            [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOptionAnchorEl(null);
            setOptionCreditNote(null);
            // Aquí podrías agregar la lógica para ver detalles o editar
            console.log('Ver detalles/Editar', optionCreditNote);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Ver Detalles
        </MenuItem>
        {/* Puedes agregar más opciones aquí */}
      </MenuList>
    </Popover>
  );

  const renderCreditNoteModal = () => (
    // Puedes crear un modal similar a renderCreditModal en HistoryView si necesitas mostrar detalles
    <></>
  );

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Typography color="error">Error al cargar las notas de crédito.</Typography>;
  }

  return (
    <>
      <Typography variant="h5" sx={{ margin: '10px' }} gutterBottom>
        Historial de Notas de Crédito
      </Typography>
      {renderTable()}
      <PaginationComponent
        count={creditNoteData ? creditNoteData.length : 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {renderPopover()}
      {renderCreditNoteModal()}
    </>
  );
}