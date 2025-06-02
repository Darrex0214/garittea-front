import { Dialog, DialogTitle, DialogContent, Typography, Box, Button, TextField, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Credit } from '../../../types/credit';

interface EditCreditModalProps {
  open: boolean;
  credit: Credit | null;
  originalState: number | null;
  onClose: () => void;
  onSave: (credit: Credit, billId?: string, billDate?: Date) => void;
}

export const EditCreditModal = ({
  open,
  credit,
  originalState,
  onClose,
  onSave
}: EditCreditModalProps) => {
  const [billId, setBillId] = useState<string>('');
  const [billDate, setBillDate] = useState<Date>(new Date());
  const [localCredit, setLocalCredit] = useState<Credit | null>(credit);

  if (!credit) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Crédito</DialogTitle>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}
      >
        {credit && (
          <>
            {originalState === 4 && (
              <>
                <Typography>ID: {credit.id}</Typography>

                <TextField
                  type="number"
                  label="Nuevo Monto"
                  value={credit.debtAmount}
                  onChange={(e) => {
                    const newAmount = parseFloat(e.target.value);
                    setLocalCredit(prev => 
                      prev ? { ...prev, debtAmount: newAmount } : null
                    );
                  }}
                  fullWidth
                  size="small"
                  margin="normal"
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
              </>
            )}

            {/* Campo de Estado */}
            {originalState === 3 ? (
              <Typography color="success.main" sx={{ mt: 2, fontWeight: 'medium' }}>
                Este crédito está Pagado y no se puede cambiar su estado.
              </Typography>
            ) : originalState === 2 ? (
              <Typography color="warning.main" sx={{ mt: 2, fontWeight: 'medium' }}>
                El estado no puede ser modificado para notas de crédito.
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Estado</Typography>
                <Select
                  value={credit.state}
                  onChange={(e) => {
                    const newState = Number(e.target.value);
                    setLocalCredit(prev => 
                      prev ? { ...prev, state: newState } : null
                    );
                  }}
                  fullWidth
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  {originalState === 1 && (
                    <>
                      <MenuItem value={3}>Pagado</MenuItem>
                      <MenuItem value={1}>Pendiente</MenuItem>
                    </>
                  )}
                  {originalState === 4 && (
                    <>
                      <MenuItem value={4}>Generado</MenuItem>
                      <MenuItem value={1}>Pendiente</MenuItem>
                    </>
                  )}
                </Select>
              </Box>
            )}

            {/* Campos de Factura */}
            {originalState === 4 && (
              <>
                <TextField
                  label="ID de Factura"
                  type="number"
                  value={billId}
                  onChange={(e) => setBillId(e.target.value)}
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  helperText="Ingrese el ID de la factura a asociar"
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
                
                <TextField
                  label="Fecha de Factura"
                  type="date"
                  value={billDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    if (e.target.value) {
                      setBillDate(new Date(e.target.value));
                    }
                  }}
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Seleccione la fecha de la factura"
                  InputProps={{
                    sx: { borderRadius: 2 },
                  }}
                />
              </>
            )}

            {/* Botones */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (localCredit) {
                    onSave(localCredit, billId, billDate);
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
};