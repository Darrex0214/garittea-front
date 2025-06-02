import { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Card, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { creditService } from '../../api/services/creditService';
import { Credit } from '../../types/credit';
import { CreditTable } from './components/CreditTable';
import { CreditDetailsModal } from './components/CreditDetailsModal';
import { EditCreditModal } from './components/EditCreditModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OptionsPopover } from './components/OptionsPopover';
import { CreditDialog } from './components/CreditDialog';
import { useCreditOperations } from './hooks/useCreditOperations';
import { SearchBar } from './components/SearchBarView';

interface Filters {
  faculty: string;
  estado: string;
  applicantId: string;
  managingPersonId: string;
  dates?: {
    start: string;
    end: string;
  } | undefined;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export default function HistoryView() {
  // Estados para gestión de modales y popovers
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [optionCredit, setOptionCredit] = useState<Credit | null>(null);
  const [optionAnchorEl, setOptionAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [originalCreditState, setOriginalCreditState] = useState<number | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  // 1. Actualizar el estado de filtros
  const [filters, setFilters] = useState<Filters>({
  faculty: '',
  estado: '',
  applicantId: '',
  managingPersonId: '',
  dates: undefined
  });
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Consulta principal actualizada con filtros
  const { data: credits = [], isLoading } = useQuery<Credit[]>({
  queryKey: ['credits', filters, page, rowsPerPage],
  queryFn: async () => {
      try {
        let response;
        
        // Si hay fechas definidas
        if (filters.dates?.start && filters.dates?.end) {
          response = await creditService.getOrdersByDates(
            filters.dates.start, 
            filters.dates.end
          );
        } 
        // Si hay filtro por solicitante
        else if (filters.applicantId) {
          response = await creditService.getOrdersByApplicant(filters.applicantId);
        }
        // Si hay filtro por gestor
        else if (filters.managingPersonId) {
          response = await creditService.getOrdersByIdManagingPerson(filters.managingPersonId);
        }
        // Si hay filtros de facultad o estado
        else if (filters.faculty || filters.estado) {
          response = await creditService.getOrdersByFacultyAndState(
            filters.faculty, 
            filters.estado
          );
        } 
        // Si no hay filtros, trae todos
        else {
          response = await creditService.getAllCredits();
        }
        
        return response || [];
      } catch (error) {
        console.error('Error al obtener créditos:', error);
        return [];
      }
    }
  });

  // Actualizar los hooks personalizados
  const { deleteMutation, updateMutation } = useCreditOperations(
    (message) => {
      setErrorModalMessage(message);
      setErrorModalOpen(true);
    }
  );

  // Handlers

  // Agregar el handler para cerrar el alert
  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  // Handlers actualizados
  const handleSearch = (newFilters: {
  faculty: string;
  estado: string;
  applicantId?: string;
  managingPersonId?: string;
  dates?: {
    start: string;
    end: string;
  };
}) => {
  setFilters({
    faculty: newFilters.faculty,
    estado: newFilters.estado,
    applicantId: newFilters.applicantId || '',
    managingPersonId: newFilters.managingPersonId || '',
    dates: newFilters.dates
  });
  setPage(0);
};

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset a primera página cuando cambia el número de filas
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>, credit: Credit) => {
    event.stopPropagation();
    setOptionAnchorEl(event.currentTarget);
    setOptionCredit(credit);
  };

  const openEditModal = (credit: Credit) => {
    setOptionCredit(credit);
    setOriginalCreditState(credit.state);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (creditToDelete: Credit) => {
    console.log('HistoryView - Iniciando eliminación de crédito:', creditToDelete);
    if (creditToDelete) {
      setOptionCredit(creditToDelete); // Guardamos el crédito a eliminar
      setConfirmDeleteOpen(true); // Abrimos el modal de confirmación
      setOptionAnchorEl(null); // Cerramos el popover
    }
  };

  // Actualizar el manejador de confirmación de eliminación
  const handleConfirmDelete = async () => {
    if (!optionCredit) return;
    
    try {
      console.log('Intentando eliminar crédito:', optionCredit.id);
      await deleteMutation.mutateAsync(optionCredit.id);
      
      // Cerrar modal y limpiar estado
      setConfirmDeleteOpen(false);
      setOptionCredit(null);
      
      // Mostrar mensaje de éxito
      setAlert({
        open: true,
        message: 'Venta a crédito eliminada exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar:', error);
      setAlert({
        open: true,
        message: 'Error al eliminar la venta a crédito',
        severity: 'error'
      });
    }
  };

  const paginatedCredits = credits.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, open: false }));
      }, 6000);

      return () => clearTimeout(timer);
    }
    return undefined; // Retorno explícito cuando alert.open es false
  }, [alert.open]);

  if (isLoading) {
    return <Typography>Cargando...</Typography>;
  }



return (
  <Container 
    maxWidth={false} 
    sx={{ 
      display: 'flex',
      flexDirection: 'column',
      width: '95%',
      maxWidth: '1800px',
      mx: 'auto'
    }}
  >
    {alert.open && (
        <Alert 
          severity={alert.severity}
          onClose={handleCloseAlert}
          sx={{ 
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 2000,
            minWidth: '300px',
            boxShadow: (theme) => theme.shadows[3],
            '& .MuiAlert-message': {
              flex: 1
            }
          }}
        >
          {alert.message}
        </Alert>
      )}
    {/* Título justificado a la derecha */}
    <Typography 
      variant="h4" 
      sx={{ 
        mb: 3,
        width: '100%',
        textAlign: 'left'  // Alineación a la derecha
      }}
    >
      Historial de Ventas a Crédito
    </Typography>

    {/* Box para contener el botón y SearchBar en la misma línea */}
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        width: '100%'
      }}
    >
      {/* Botón a la izquierda */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setCreateDialogOpen(true)}
      >
        Nueva Venta a Crédito
      </Button>

      {/* SearchBar a la derecha */}
      <SearchBar 
        onSearch={handleSearch}
        initialFilters={filters}
      />
    </Box>

      <Card sx={{ mb: 3, overflow: 'hidden', width: '100%' }}>
        <CreditTable 
          displayData={paginatedCredits}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={credits.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onCreditSelect={setSelectedCredit}
          onOptionsClick={handleOptionsClick}
        />
      </Card>

      <CreditDetailsModal 
        credit={selectedCredit} 
        onClose={() => setSelectedCredit(null)} 
      />

        <EditCreditModal 
          open={editModalOpen}
          credit={optionCredit}
          originalState={originalCreditState}
          onClose={() => {
            setEditModalOpen(false);
            setOptionCredit(null);
          }}
          onSave={async (updatedCredit, billId, billDate) => {
            try {
              if (updatedCredit.state === 4 && billId) {
                await updateMutation.mutateAsync({
                  id: updatedCredit.id.toString(),
                  data: {
                    debtAmount: updatedCredit.debtAmount,
                    state: updatedCredit.state,
                    bills: [{
                      idBill: parseInt(billId, 10),
                      id: 0,
                      billdate: billDate || new Date(),
                      state: "active"
                    }]
                  },
                });
              } else {
                await updateMutation.mutateAsync({
                  id: updatedCredit.id.toString(),
                  data: {
                    debtAmount: updatedCredit.debtAmount,
                    state: updatedCredit.state,
                  },
                });
              }
              
              setEditModalOpen(false);
              setOptionCredit(null);
            } catch (error: any) {
              setErrorModalMessage(error.response?.data?.error || "Error al actualizar el crédito");
              setErrorModalOpen(true);
            }
          }}
        />

        <DeleteConfirmModal 
          open={confirmDeleteOpen}
          credit={optionCredit} // Pasamos el crédito guardado
          onClose={() => {
            setConfirmDeleteOpen(false);
            setOptionCredit(null);
            setOptionAnchorEl(null); // Aseguramos que el popover esté cerrado
          }}
          onSuccess={() => {
            setAlert({
              open: true,
              message: 'Venta a crédito eliminada exitosamente',
              severity: 'success'
            });
            // Limpiamos todos los estados
            setOptionCredit(null);
            setOptionAnchorEl(null);
          }}
        />

        <CreditDialog 
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={() => {
            // Recargar datos si es necesario
          }}
        />

        {/* Actualizar el OptionsPopover */}
        <OptionsPopover 
          anchorEl={optionAnchorEl}
          credit={optionCredit}
          onClose={() => {
            setOptionAnchorEl(null);
            setOptionCredit(null);
          }}
          onEditClick={openEditModal}
          onDeleteClick={handleDeleteClick}
        />
    </Container>
  );
}