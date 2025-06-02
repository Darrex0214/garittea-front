import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Credit } from '../../../types/credit';
import { getEstadoTexto } from '../utils/creditHelpers';

interface CreditDetailsModalProps {
  credit: Credit | null;
  onClose: () => void;
}

export const CreditDetailsModal = ({ credit, onClose }: CreditDetailsModalProps) => {
  if (!credit) return null;

  return (
    <Dialog open={!!credit} onClose={onClose}>
      <DialogTitle>Detalles del Crédito #{credit.id}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Usuario actualizado con los nuevos campos */}
          <Typography>
            <b>Usuario:</b> {credit.user.firstname} {credit.user.lastname}
          </Typography>
          
          {/* Solicitante actualizado */}
          <Typography>
            <b>Solicitante:</b> {credit.applicant.name} {credit.applicant.lastname}
          </Typography>
          
          {/* Gestor con manejo null */}
          <Typography>
            <b>Gestor:</b> {credit.managingPerson.name} {credit.managingPerson.lastname}
          </Typography>
          
          <Typography>
            <b>Facultad:</b> {credit.faculty.name}
          </Typography>
          
          <Typography>
            <b>Deuda:</b> ${credit.debtAmount.toLocaleString()}
          </Typography>
          
          <Typography>
            <b>Fecha de Creación:</b>{' '}
            {new Date(credit.createdAt).toLocaleDateString('es-CO')}
          </Typography>

          {/* Estado con estilos */}
          <Typography sx={{ 
            color: getEstadoTexto(credit.state).color,
            backgroundColor: alpha(getEstadoTexto(credit.state).color, 0.15),
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            alignSelf: 'flex-start'
          }}>
            <b>Estado:</b> {getEstadoTexto(credit.state).text}
          </Typography>

          {/* Observaciones (nuevo campo) */}
          {credit.observaciones && (
            <Typography>
              <b>Observaciones:</b> {credit.observaciones}
            </Typography>
          )}

          {/* Factura actualizada con nuevo tipo Bill */}
          {credit.bill && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                <b>Información de Factura:</b>
              </Typography>
              <Box sx={{ ml: 2 }}>
                <Typography>
                  <b>Número de Factura:</b> #{credit.bill.idBill}
                </Typography>
                <Typography>
                  <b>Fecha de Factura:</b>{' '}
                  {new Date(credit.bill.billdate).toLocaleDateString('es-CO')}
                </Typography>
                <Typography>
                  <b>Estado de Factura:</b>{' '}
                  <span style={{ 
                    color: credit.bill.state === 'activo' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {credit.bill.state}
                  </span>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};