import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Select, 
  MenuItem 
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Credit } from '../../../types/credit';

interface EditCreditModalProps {
  open: boolean;
  credit: Credit | null;
  onClose: () => void;
  onSave: (credit: Credit, billId?: string, billDate?: Date) => Promise<void>;
}

export const EditCreditModal = ({
  open,
  credit,
  onClose,
  onSave
}: EditCreditModalProps) => {
  const [billId, setBillId] = useState<string>('');
  const [billDate, setBillDate] = useState<Date>(new Date());
  const [localCredit, setLocalCredit] = useState<Credit | null>(credit);
  const [observaciones, setObservaciones] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (credit) {
      setLocalCredit(credit);
      setObservaciones(credit.observaciones || '');
      setError(null);
    }
  }, [credit]);

  if (!credit) return null;

  const canEditAmount = !credit.bill;
  const isGeneratedState = credit.state === 4;
  const isPendingState = credit.state === 1;
  const isPaidState = credit.state === 3;
  const isCreditNoteState = credit.state === 2;

  const handleSave = async () => {
    if (!localCredit) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updatedCredit = {
        ...localCredit,
        observaciones
      };

      await onSave(updatedCredit, billId, billDate);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el crédito');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Editar Crédito #{credit?.id}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>ID: {credit.id}</Typography>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {/* Campo de Monto - Solo editable si no hay factura */}
      
        {canEditAmount && (
          <TextField
            type="number"
            label="Monto"
            value={localCredit?.debtAmount || ''}
            onChange={(e) => {
              const newAmount = parseFloat(e.target.value);
              setLocalCredit(prev => 
                prev ? { ...prev, debtAmount: newAmount } : null
              );
            }}
            fullWidth
            size="small"
            disabled={!canEditAmount}
          />
        )}

        {/* Campos de Factura - Solo en estado Generado */}
        {isGeneratedState && (
          <>
            <TextField
              label="ID de Factura"
              type="number"
              value={billId}
              onChange={(e) => setBillId(e.target.value)}
              fullWidth
              size="small"
              required
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
              required
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}

        {/* Estado - Solo visible en estado Pendiente */}
        {isPendingState && (
          <Select
            value={localCredit?.state || ''}
            onChange={(e) => {
              const newState = Number(e.target.value);
              setLocalCredit(prev => 
                prev ? { ...prev, state: newState } : null
              );
            }}
            fullWidth
            size="small"
            label="Estado"
          >
            <MenuItem value={1}>Pendiente</MenuItem>
            <MenuItem value={3}>Pagado</MenuItem>
          </Select>
        )}

        {/* Observaciones - Siempre editable */}
        <TextField
          label="Observaciones"
          multiline
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          fullWidth
          size="small"
        />

        {/* Mensajes informativos según estado */}
        {isPaidState && (
          <Typography color="success.main">
            Este crédito está Pagado. Solo puedes modificar las observaciones.
          </Typography>
        )}
        
        {isCreditNoteState && (
          <Typography color="info.main">
            Este crédito tiene una Nota Crédito. Solo puedes modificar las observaciones.
          </Typography>
        )}

        {/* Botones */}
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSubmitting || (isGeneratedState && !billId)}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};