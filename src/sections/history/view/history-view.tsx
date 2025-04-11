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
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  } from '@mui/material';
import { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import { useQuery } from '@tanstack/react-query';
import { creditService } from '../../../api/services/creditService';
import { Credit } from '../../../types/credit';


export function HistoryView() {
  const { data: creditData, isPending, isError } = useQuery<Credit[]>({
    queryKey: ['credits'],
    queryFn: () => creditService.getAllCredits().then((res) => res.data),
  });

  // Estado para el modal de detalles
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  
  // Estados para el Popover de opciones (tres puntos)
  const [optionAnchorEl, setOptionAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [optionCredit, setOptionCredit] = useState<Credit | null>(null);

  type EstadoInfo = {
    text: string;
    color: string;
  };

  const getEstadoTexto = (estado: number): EstadoInfo => {
    switch (estado) {
      case 1:
        return { text: 'Pendiente', color: '#c62828' }; // rojo
      case 2:
        return { text: 'Nota crédito', color: '#f9a825' };   // amarillo
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
              <TableCell align="right">Opción</TableCell>
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
                {/* Columna de opción: botón de tres puntos */}
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      // Evita que se dispare el onClick del row (abrir el modal)
                      e.stopPropagation();
                      setOptionCredit(credit);
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

      {/* Popover de opciones (Editar / Eliminar) */}
      <Popover
        open={Boolean(optionAnchorEl)}
        anchorEl={optionAnchorEl}
        onClose={() => {
          setOptionAnchorEl(null);
          setOptionCredit(null);
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
              // Aquí agrega la lógica para editar el crédito (opción: abrir modal de edición, redirigir, etc.)
              setOptionAnchorEl(null);
              setOptionCredit(null);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              // Aquí agrega la lógica para eliminar el crédito (opción: llamar API de DELETE, mostrar confirmación, etc.)
              setOptionAnchorEl(null);
              setOptionCredit(null);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Modal de detalles */}
      <Dialog open={!!selectedCredit} onClose={() => setSelectedCredit(null)}>
        <DialogTitle>Detalles del Crédito #{selectedCredit?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedCredit && (
            <>
              <Typography>
                <b>Usuario:</b> {selectedCredit.user.name} {selectedCredit.user.lastName}
              </Typography>
              <Typography>
                <b>Solicitante:</b> {selectedCredit.applicant.name} {selectedCredit.applicant.lastName}
              </Typography>
              <Typography>
                <b>Gestor:</b>{' '}
                {selectedCredit.managingPerson
                  ? `${selectedCredit.managingPerson.name} ${selectedCredit.managingPerson.lastName}`
                  : 'Sin asignar'}
              </Typography>
              <Typography>
                <b>Facultad:</b> {selectedCredit.faculty.name}
              </Typography>
              <Typography>
                <b>Deuda:</b> ${selectedCredit.debtAmount.toLocaleString()}
              </Typography>
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
