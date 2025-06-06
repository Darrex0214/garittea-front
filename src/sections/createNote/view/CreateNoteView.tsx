import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useCreateNoteCredit } from 'src/api/services/creditNoteService';

export function CreateNoteCreditView() {
  const [formData, setFormData] = useState({
    initialBillId: '',
    finalBillId: '',
    idcreditNote: '',
    valor: '',
    motivo: '',
  });

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: createNote, isPending } = useCreateNoteCredit({
    onSuccess: () => setSuccessModalOpen(true),
    onError: (error: any) => {
      const msg = error?.response?.data?.error || error.message || 'Ocurrió un error inesperado.';
      setErrorMessage(msg);
      setErrorModalOpen(true);
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.initialBillId || !formData.valor || !formData.motivo || !formData.idcreditNote) {
      setErrorMessage('Debe llenar todos los campos obligatorios.');
      setErrorModalOpen(true);
      return;
    }

    createNote({
      initialBillId: parseInt(formData.initialBillId, 10),
      finalBillId: formData.finalBillId ? parseInt(formData.finalBillId, 10) : undefined,
      idcreditNote: parseInt(formData.idcreditNote, 10),
      amount: parseFloat(formData.valor),
      reason: formData.motivo,
    });
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Crear Nota Crédito
        </Typography>

        <TextField
          label="ID Factura Inicial"
          name="initialBillId"
          value={formData.initialBillId}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="ID Factura Final"
          name="finalBillId"
          value={formData.finalBillId}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
         <TextField
          label="ID Nota Crédito"
          name="idcreditNote"
          value={formData.idcreditNote}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Valor"
          name="valor"
          type="number"
          value={formData.valor}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Motivo"
          name="motivo"
          value={formData.motivo}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" disabled={isPending} fullWidth>
          {isPending ? <CircularProgress size={24} /> : 'Crear Nota Crédito'}
        </Button>
      </Box>

      <Dialog open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <DialogTitle>¡Éxito!</DialogTitle>
        <DialogContent>La nota crédito se ha creado y se ha asignado exitosamente.</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessModalOpen(false)} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{errorMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorModalOpen(false)} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
