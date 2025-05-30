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
  const [originalCreditState, setOriginalCreditState] = useState<number | null>(null);
  const [billId, setBillId] = useState<string>('');
  const [billDate, setBillDate] = useState<Date | null>(new Date());


  const queryClient = useQueryClient();

  const openEditModal = (credit: Credit) => {
    // Create a deep copy of the credit to avoid reference issues
    setOptionCredit({...credit});
    setOriginalCreditState(credit.state);
    setEditModalOpen(true);
    
    // Reset other related fields
    if (credit.bills && credit.bills.length > 0) {
      setBillId(credit.bills[0].idBill.toString());
      setBillDate(new Date(credit.bills[0].billdate));
    } else {
      setBillId('');
      setBillDate(new Date());
    }
  };

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
        return { text: 'Pendiente', color: '#e67e22' };
      case 2:
        return { text: 'Nota crédito', color: '#8e44ad' };
      case 3:
        return { text: 'Pagado', color: '#27ae60' };
      case 4:
        return { text: 'Generado', color: '#3498db' };
      default:
        return { text: 'Desconocido', color: '#757575' };
    }
  };

  const renderTable = () => (
    <TableContainer component={Paper} sx={{ width: '90%', maxWidth: '90vw', height: '70vh', overflowY: 'auto', margin: '0 auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" width="5%">ID</TableCell>
            <TableCell align="center" width="15%">Solicitante</TableCell>
            <TableCell align="center" width="15%">Facultad</TableCell> {/* Nueva columna */}
            <TableCell align="center" width="10%">Deuda</TableCell>
            <TableCell align="center" width="10%">Estado</TableCell>
            <TableCell align="center" width="10%">Factura</TableCell> {/* Nueva columna */}
            <TableCell align="center" width="5%">Opción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((credit, index) => (
            <TableRow key={credit.id} hover onClick={() => setSelectedCredit(credit)} sx={{ cursor: 'pointer' }}>
              <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
              <TableCell align="center">{`${credit.applicant.name} ${credit.applicant.lastName}`}</TableCell>
              <TableCell align="center">{credit.faculty.name}</TableCell>
              <TableCell align="center">${credit.debtAmount.toLocaleString()}</TableCell>
              <TableCell align="center" sx={{
                color: getEstadoTexto(credit.state).color,
                fontWeight: 'bold',
                backgroundColor: alpha(getEstadoTexto(credit.state).color, 0.15),
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                marginTop: '18px',
                marginLeft: '58px'
              }}>
                {getEstadoTexto(credit.state).text}
              </TableCell>

              <TableCell align="center">
                {credit.bills && credit.bills.length > 0 ? (
                  // Mostrar el número de factura en lugar del ícono
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#2e7d32',
                      backgroundColor: alpha('#2e7d32', 0.1),
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                  >
                    #{credit.bills[0].idBill}
                  </Typography>
                ) : (
                  // Centrar el ícono cuando no hay factura
                  <Box display="flex" justifyContent="center">
                    <Iconify 
                      icon="mdi:file-document-remove" 
                      width={24} 
                      height={24} 
                      sx={{ color: '#c62828' }}
                    />
                  </Box>
                )}
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
        {optionCredit && optionCredit.state !== 2 && optionCredit.state !== 3 && (
          <MenuItem
            onClick={() => {
              setOptionAnchorEl(null);
              openEditModal(optionCredit!);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
        )}
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
            {originalCreditState === 4 && (
              <>
                <Typography>ID: {optionCredit.id}</Typography>

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
              </>
            )}

            {/* Campo para editar estado */}
            {originalCreditState === 3 ? (
              /* Si está Pagado, mostrar mensaje informativo */
              <Typography color="success.main" sx={{ mt: 2, fontWeight: 'medium' }}>
                Este crédito está Pagado y no se puede cambiar su estado.
              </Typography>
            ) : originalCreditState === 2 ? (
              /* Si es Nota Crédito, mostrar mensaje informativo */
              <Typography color="warning.main" sx={{ mt: 2, fontWeight: 'medium' }}>
                El estado no puede ser modificado para notas de crédito.
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Estado</Typography>
                <Select
                  value={optionCredit.state}
                  onChange={(e) => {
                    const newState = Number(e.target.value);
                    setOptionCredit((prev) => 
                      prev ? { ...prev, state: newState } : null
                    );
                  }}
                  fullWidth
                  size="small"
                  sx={{ borderRadius: 2 }}
                  renderValue={(selected) => {
                    // Explicitly render the selected text
                    switch (Number(selected)) {
                      case 1: return "Pendiente";
                      case 3: return "Pagado";
                      case 4: return "Generado";
                      default: return "";
                    }
                  }}
                >
                  {/* Cuando el original es Pendiente (1) */}
                  {originalCreditState === 1 && <MenuItem value={3}>Pagado</MenuItem> }
                  {originalCreditState === 1 && <MenuItem value={1}>Pendiente</MenuItem>}

                  {/* Cuando el original es Generado (4) */}
                  {originalCreditState === 4 && <MenuItem value={4}>Generado</MenuItem> }
                  {originalCreditState === 4 && <MenuItem value={1}>Pendiente</MenuItem>}
                </Select>
              </Box>
            )}

            {/* Campo para ID de factura - MOSTRAR SIEMPRE excepto en estados bloqueados */}
            {originalCreditState === 4 && (
              <>
                <TextField
                  label="ID de Factura"
                  type="number"
                  value={billId}
                  onChange={(e) => setBillId(e.target.value)}
                  fullWidth
                  size="small"
                  margin="normal"
                  required={originalCreditState === 4} // Solo requerido si es Generado
                  helperText="Ingrese el ID de la factura a asociar"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                    },
                  }}
                />
                
                {/* Nuevo campo para fecha de factura */}
                <TextField
                  label="Fecha de Factura"
                  type="date"
                  value={billDate ? billDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setBillDate(new Date(e.target.value));
                    } else {
                      // Si intentan borrar, mantener la fecha actual
                      setBillDate(new Date());
                    }
                  }}
                  fullWidth
                  size="small"
                  margin="normal"
                  required={originalCreditState === 4} // Solo requerido si es Generado
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Seleccione la fecha de la factura"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                    },
                  }}
                />
              </>
            )}

            {/* Botones */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  if (optionCredit) {
                    // Validaciones específicas
                    
                    // Verificar cambio de Pendiente (1) a Pagado (3)
                    if (originalCreditState === 1 && optionCredit.state === 3) {
                      // Verificar si tiene facturas asociadas
                      if (!optionCredit.bills || optionCredit.bills.length === 0) {
                        setErrorModalMessage("No se puede cambiar a Pagado sin una factura asociada");
                        setErrorModalOpen(true);
                        return;
                      }
                    }
                    
                    if (originalCreditState === 4) {
                      if (!billId || billId.trim() === '') {
                        setErrorModalMessage("Debe ingresar un ID de factura para el estado Generado");
                        setErrorModalOpen(true);
                        return;
                      }
                      
                      if (!billDate) {
                        setErrorModalMessage("Debe seleccionar una fecha para la factura");
                        setErrorModalOpen(true);
                        return;
                      }
                    }
                                        
                    try {
                      if (optionCredit.state === 4 && billId) {
                        await updateMutation.mutate({
                          id: optionCredit.id.toString(),
                          data: {
                            debtAmount: optionCredit.debtAmount,
                            state: optionCredit.state,
                            bills: 
                            [
                              {
                                idBill: parseInt(billId, 10),
                                id: 0,
                                billdate: billDate || new Date(),
                                state: "active"
                              }
                            ]
                          },
                        });
                      } else {
                        updateMutation.mutate({
                          id: optionCredit.id.toString(),
                          data: {
                            debtAmount: optionCredit.debtAmount,
                            state: optionCredit.state,
                          },
                        });
                      }
                      
                      setEditModalOpen(false);
                      setOptionCredit(null);
                      setBillId(''); // Limpiar el ID de factura
                    } catch (error: any) {
                      console.error("Error al actualizar:", error);
                      setErrorModalMessage(error.response?.data?.error || "Error al actualizar el crédito");
                      setErrorModalOpen(true);
                    }
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
    setCreateCreditModalOpen(false);
    refetch(); // Recarga los datos del historial
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
        onClose={() => setCreateCreditModalOpen(false)}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        key={createCreditModalOpen ? 'modal-open' : 'modal-closed'} // Esto fuerza un remount
      >
        <DialogTitle>
          Crear Nueva Venta a Crédito
          <IconButton
            aria-label="close"
            onClick={() => setCreateCreditModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {createCreditModalOpen && ( // Esto asegura que se renderice solo cuando está abierto
            <CreateCreditView onSuccess={handleCreateCreditSuccess} onCancel={() => setCreateCreditModalOpen(false)} />
          )}
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