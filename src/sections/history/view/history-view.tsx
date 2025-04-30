import React, { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
  Dialog, DialogTitle, DialogContent, Typography, CircularProgress, Box,
  IconButton, Popover, MenuList, MenuItem, Button, TextField, Select,
  Collapse,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { menuItemClasses } from '@mui/material/MenuItem';
import Zoom, { ZoomProps } from '@mui/material/Zoom';
import { Iconify } from 'src/components/iconify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '../../../api/services/creditService';
import { Credit } from '../../../types/credit';
import { PaginationComponent } from '../../../components/pagination/pagination';
import { SearchFilterModal } from '../../../components/filter/creditFilter';
import { CreateCreditView } from '../../createCredit/CreateCreditView';

const Transition = React.forwardRef<unknown, ZoomProps>(
  (props, ref) => <Zoom ref={ref} {...props} />
);

Transition.displayName = 'Transition';

export function HistoryView() {
  // Estados del componente
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [optionAnchorEl, setOptionAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [optionCredit, setOptionCredit] = useState<Credit | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [filters, setFilters] = useState({ faculty: '', estado: '' });
  // Estados de modales
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [createCreditModalOpen, setCreateCreditModalOpen] = useState(false);
  const [creditCreatedSuccess, setCreditCreatedSuccess] = useState(false);

  const queryClient = useQueryClient();

  // Consulta que se actualiza según los filtros
  const { data: creditData, isPending, isError, refetch } = useQuery<Credit[]>({
    queryKey: ['credits', filters],
    queryFn: () => {
      if (filters.faculty || filters.estado) {
        return creditService
          .getCreditsByFacultyAndState(filters.faculty, filters.estado)
          .then((res) => res.data);
      }
      return creditService
        .getAllCredits()
        .then((res) => res.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => creditService.deleteCredit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
    onError: (error: any) => {
      let message = 'Ocurrió un error al eliminar el crédito. Intente nuevamente.';
      if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      setErrorModalMessage(message);
      setErrorModalOpen(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Credit> }) =>
      creditService.updateCreditById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] }); // Refresca los datos de la tabla
    },
    onError: (error: any) => {
      let message = 'Ocurrió un error al actualizar el crédito. Intente nuevamente.';
      if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      setErrorModalMessage(message);
      setErrorModalOpen(true);
    },
  });

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
    setOptionAnchorEl(null);
  };

  const confirmDelete = () => {
    if (optionCredit) {
      deleteMutation.mutate(optionCredit.id);
    }
    setConfirmDeleteOpen(false);
    setOptionCredit(null);
  };

  // Uso directo de creditData, ya viene filtrado desde backend
  const displayData = creditData
    ? creditData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  // Handlers de paginación
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEstadoTexto = (estado: number) => {
    switch (estado) {
      case 1:
        return { text: 'Pendiente', color: '#c62828' };
      case 2:
        return { text: 'Nota crédito', color: '#f9a825' };
      case 3:
        return { text: 'Pagado', color: '#2e7d32' };
      default:
        return { text: 'Desconocido', color: '#757575' };
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ width: '90%', maxWidth: '90vw', height: '70vh', overflowY: 'auto', margin: '0 auto' }}>
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
          {displayData.map((credit, index) => (
            <TableRow key={credit.id} hover onClick={() => setSelectedCredit(credit)} sx={{ cursor: 'pointer' }}>
              <TableCell>{page * rowsPerPage + index + 1}</TableCell>
              <TableCell>{`${credit.user.name} ${credit.user.lastName}`}</TableCell>
              <TableCell>{`${credit.applicant.name} ${credit.applicant.lastName}`}</TableCell>
              <TableCell>${credit.debtAmount.toLocaleString()}</TableCell>
              <TableCell sx={{
                color: getEstadoTexto(credit.state).color,
                fontWeight: 'bold',
                backgroundColor: alpha(getEstadoTexto(credit.state).color, 0.15),
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '18px',
              }}>
                {getEstadoTexto(credit.state).text}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  setOptionCredit(credit);
                  setOptionAnchorEl(e.currentTarget);
                }}>
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
    <Popover open={Boolean(optionAnchorEl)} anchorEl={optionAnchorEl} onClose={() => { setOptionAnchorEl(null); setOptionCredit(null); }}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuList sx={{ p: 0.5, gap: 0.5, width: 140, display: 'flex', flexDirection: 'column', [`& .${menuItemClasses.root}`]: { px: 1, gap: 2, borderRadius: 0.75, [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' } } }}>
        <MenuItem
          onClick={() => {
            setOptionAnchorEl(null);
            setEditModalOpen(true);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />Eliminar
        </MenuItem>
      </MenuList>
    </Popover>
  );

  const renderCreditModal = () => (
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
            <Typography sx={{ color: getEstadoTexto(selectedCredit.state).color, backgroundColor: alpha(getEstadoTexto(selectedCredit.state).color, 0.15), padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
              <b>Estado:</b> {getEstadoTexto(selectedCredit.state).text}
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );


  const renderEditModal = () => (
    <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
      <DialogTitle>Editar Crédito</DialogTitle>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}
      >
        {optionCredit && (
          <>
            <Typography>ID: {optionCredit.id}</Typography>

            {/* Campo para editar monto */}
            <TextField
              type="number"
              label="Nuevo Monto"
              value={optionCredit?.debtAmount ?? ''}
              onChange={(e) =>
                setOptionCredit((prev) =>
                  prev ? { ...prev, debtAmount: parseFloat(e.target.value) } : null
                )
              }
              fullWidth
              size="small"
              margin="normal"
              InputProps={{
                sx: {
                  borderRadius: 2,
                },
              }}
            />

            {/* Campo para editar estado */}
            <Select
              label="Estado"
              value={optionCredit.state}
              onChange={(e) =>
                setOptionCredit((prev) =>
                  prev ? { ...prev, state: Number(e.target.value) } : null
                )
              }
              fullWidth
              size="small"
              displayEmpty
              sx={{ mt: 2, borderRadius: 2 }}
            >
              <MenuItem value={1}>Pendiente</MenuItem>
              <MenuItem value={2}>Nota Crédito</MenuItem>
              <MenuItem value={3}>Pagado</MenuItem>
            </Select>

            {/* Botones */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (optionCredit) {
                    updateMutation.mutate({
                      id: optionCredit.id.toString(),
                      data: {
                        debtAmount: optionCredit.debtAmount,
                        state: optionCredit.state,
                      },
                    });
                    setEditModalOpen(false);
                    setOptionCredit(null);
                  }
                }}
              >
                Guardar
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );


  const renderErrorModal = () => (
    <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
      <DialogTitle sx={{ color: 'error.main' }}>Error</DialogTitle>
      <DialogContent dividers>
        <Typography color="error">{errorModalMessage}</Typography>
        <Box mt={2} textAlign="right">
          <Button variant="contained" color="error" onClick={() => setErrorModalOpen(false)}>Cerrar</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderConfirmDeleteModal = () => (
    <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent dividers>
        <Typography>¿Estás seguro de que deseas eliminar este crédito?</Typography>
        <Box mt={2} textAlign="right" display="flex" gap={2}>
          <Button variant="outlined" onClick={() => setConfirmDeleteOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Confirmar</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const handleCreateCreditSuccess = () => {
    setCreditCreatedSuccess(true);
    setTimeout(() => {
      setCreditCreatedSuccess(false);
      setCreateCreditModalOpen(false);
      refetch(); // Recarga los datos del historial
    }, 1500); // Duración de la animación
  };

  const handleCloseCreateCreditModal = () => {
    setCreateCreditModalOpen(false);
    setCreditCreatedSuccess(false);
    refetch(); // Recarga los datos al cerrar el modal
  };

  if (isPending) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (isError) return <Typography color="error">Error al cargar los créditos.</Typography>;

  return (
    <>
      <Typography variant="h5" sx={{ margin: '10px' }} gutterBottom>
        Historial de Ventas a Crédito
      </Typography>

      {/* Botón para abrir el modal de búsqueda */}
      <Box display="flex" justifyContent="flex-start" mb={2} marginLeft="80px">
        <Button variant="contained" color="primary" onClick={() => setCreateCreditModalOpen(true)}>
          Crear Venta a Crédito
        </Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setSearchModalOpen(true)}>Buscar Créditos</Button>
      </Box>

      <SearchFilterModal
        open={searchModalOpen}
        initialFilters={filters}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(newFilters) => {
          setFilters({ faculty: newFilters.faculty ?? '', estado: newFilters.estado ?? '' });
          setPage(0);
        }}
      />

      {renderTable()}

      <PaginationComponent
        count={creditData ? creditData.length : 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={createCreditModalOpen}
        onClose={handleCloseCreateCreditModal}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogTitle>Crear Nuevo Crédito</DialogTitle>
        <DialogContent>
          <CreateCreditView onSuccess={handleCreateCreditSuccess} />
          <Collapse in={creditCreatedSuccess}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="body2" color="success">Crédito creado exitosamente.</Typography>
            </Box>
          </Collapse>
        </DialogContent>
      </Dialog>

      {renderEditModal()}
      {renderPopover()}
      {renderCreditModal()}
      {renderErrorModal()}
      {renderConfirmDeleteModal()}
    </>
  );
}