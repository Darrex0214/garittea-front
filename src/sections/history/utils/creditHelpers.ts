import { alpha } from '@mui/material/styles';

export const getEstadoTexto = (estado: number) => {
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

export const getEstadoStyle = (estado: number) => {
  const { color } = getEstadoTexto(estado);
  return {
    color,
    backgroundColor: alpha(color, 0.15),
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  };
};