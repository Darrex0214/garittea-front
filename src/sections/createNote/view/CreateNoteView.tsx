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
import { useMutation } from '@tanstack/react-query';
import { useCreateNoteCredit } from 'src/api/services/creditNoteService'; // crea esta función en tu servicio

export function CreateNoteCreditView() {
  const [formData, setFormData] = useState({
    consecutivoFactura: '',
    valor: '',
    motivo: '',
  });

  const [modalOpen, setModalOpen] = useState(false);

  const { mutate: createNote, isPending } = useCreateNoteCredit({
    onSuccess: () => setModalOpen(true),
    onError: (error: any) => alert(`Error: ${error.message}`),
  });


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.consecutivoFactura || !formData.valor || !formData.motivo) {
      alert('Todos los campos son obligatorios');
      return;
    }

    createNote({
      idBill: formData.consecutivoFactura,
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
          label="Consecutivo de Factura"
          name="consecutivoFactura"
          value={formData.consecutivoFactura}
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

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>¡Éxito!</DialogTitle>
        <DialogContent>La nota crédito se ha creado y se ha asignado exitosamente.</DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
