import React, { useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
  Typography, CircularProgress, Box, Popover, MenuList, MenuItem, IconButton, TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import { useGetCreditNotes } from 'src/api/services/creditNoteService';
import { CreditNote } from 'src/types/creditNote';
import { PaginationComponent } from 'src/components/pagination/pagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export function CreditNoteView() {
  const { data: creditNoteData, isPending, isError } = useGetCreditNotes();
  const [optionAnchorEl, setOptionAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [optionCreditNote, setOptionCreditNote] = useState<CreditNote | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  

  const getEstadoColor = (estado: string | undefined) => {
  switch ((estado || '').toLowerCase()) {
    case 'activo':
      return { text: 'Activo', color: '#2e7d32' }; // verde
    case 'anulada':
    case 'anulado':
      return { text: 'Anulado', color: '#c62828' }; // rojo
    case 'nota':
      return { text: 'Nota', color: '#1565c0' }; // azul
    default:
      return { text: estado || 'Desconocido', color: '#757575' }; // gris
  }
};


  const filteredData = creditNoteData?.filter((note: CreditNote) => {
    const noteDate = note.initialBill?.date ? dayjs(note.initialBill.date) : null;

    const matchesSearch =
      note.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.initialBill?.id?.toString().includes(searchTerm) ||
      note.finalBill?.id?.toString().includes(searchTerm)
  
      const matchesDate =
      (!startDate || (noteDate && noteDate.isAfter(startDate.subtract(1, 'day')))) &&
      (!endDate || (noteDate && noteDate.isBefore(endDate.add(1, 'day'))));
  
    return matchesSearch && matchesDate;
  }) ?? [];

  const displayData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTable = () => (
    <TableContainer
      component={Paper}
      sx={{ width: '90%', maxWidth: '90vw', height: '70vh', overflowY: 'auto', margin: '0 auto' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell>ID Factura Inicial</TableCell>
            <TableCell>Fecha Factura Inicial</TableCell>
            <TableCell>Estado Factura Inicial</TableCell>
            <TableCell>ID Factura Final</TableCell>
            <TableCell>Fecha Factura Final</TableCell>
            <TableCell>Estado Factura Final</TableCell>
            <TableCell align="right">Opción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((creditNote: CreditNote, index: number) => {
            const estadoInicial = getEstadoColor(creditNote.initialBill?.state);
            const estadoFinal = getEstadoColor(creditNote.finalBill?.state);

            return (
              <TableRow key={creditNote.id} hover>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{creditNote.amount.toLocaleString()}</TableCell>
                <TableCell>{creditNote.reason}</TableCell>
                <TableCell>{creditNote.initialBill?.id ?? '-'}</TableCell>
                <TableCell>
                  {creditNote.initialBill?.date
                    ? dayjs(creditNote.initialBill.date).format('DD/MM/YYYY')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      color: estadoInicial.color,
                      backgroundColor: alpha(estadoInicial.color, 0.15),
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {estadoInicial.text}
                  </Box>
                </TableCell>
                <TableCell>{creditNote.finalBill?.id ?? '-'}</TableCell>
                <TableCell>
                  {creditNote.finalBill?.date
                    ? dayjs(creditNote.finalBill.date).format('DD/MM/YYYY')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      color: estadoFinal.color,
                      backgroundColor: alpha(estadoFinal.color, 0.15),
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {estadoFinal.text}
                  </Box>
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
            );
          })}
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
            console.log('Ver detalles/Editar', optionCreditNote);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Ver Detalles
        </MenuItem>
      </MenuList>
    </Popover>
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
      <Typography variant="h5" sx={{ marginBottom: '20px', marginLeft: '3.5rem' }} gutterBottom>
        Historial de Notas de Crédito
      </Typography>

      <Box sx={{ mb: '1rem', display: 'flex', marginLeft: '3.5rem', gap: '1rem' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Motivo o factura"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ width: '300px' }}
        />
        <DatePicker
          label="Fecha inicial"
          value={startDate}
          format="DD/MM/YYYY"
          onChange={(date) => setStartDate(date)}
          sx={{ width: '190px' }}
        />
        <DatePicker
          label="Fecha final"
          value={endDate}
          format="DD/MM/YYYY"
          onChange={(date) => setEndDate(date)}
          sx={{ width: '190px' }}
        />

      </Box>

      {renderTable()}

      <PaginationComponent
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {renderPopover()}
    </>
  );
}
