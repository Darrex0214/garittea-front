import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Button } from '@mui/material';
import { Credit } from '../../../types/credit';
import { useCreditOperations } from '../hooks/useCreditOperations';

interface DeleteConfirmModalProps {
  open: boolean;
  credit: Credit | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteConfirmModal = ({
  open,
  credit,
  onClose,
  onSuccess
}: DeleteConfirmModalProps) => {
  const [error, setError] = useState<string | null>(null);

  const { deleteMutation } = useCreditOperations((errorMessage) => {
    setError(errorMessage);
    return undefined; // Retorno explícito
  });

  useEffect(() => {
    if (!open) {
      setError(null);
    }
    return () => {
      // Limpieza al desmontar
      setError(null);
    };
  }, [open]);

  const handleDelete = async () => {
    if (!credit) {
      console.error('No hay crédito seleccionado para eliminar');
      return;
    }

    try {
      console.log('Intentando eliminar crédito:', credit.id);
      await deleteMutation.mutateAsync(credit.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error en handleDelete:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent dividers>
        <Typography>
          ¿Estás seguro de que deseas eliminar esta venta a crédito?
        </Typography>

        {credit && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>ID:</strong> {credit.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Solicitante:</strong> {credit.applicant.name} {credit.applicant.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Facultad:</strong> {credit.faculty.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Monto:</strong> ${credit.debtAmount.toLocaleString()}
            </Typography>
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};