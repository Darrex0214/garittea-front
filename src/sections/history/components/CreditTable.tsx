import { 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableContainer, 
  Paper, 
  IconButton, 
  Typography, 
  Box,
  TablePagination // Añadido aquí
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import { Credit } from '../../../types/credit';
import { getEstadoTexto } from '../utils/creditHelpers';

interface CreditTableProps {
  displayData: Credit[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onCreditSelect: (credit: Credit) => void;
  onOptionsClick: (event: React.MouseEvent<HTMLButtonElement>, credit: Credit) => void;
}

export const CreditTable = ({
  displayData,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onCreditSelect,
  onOptionsClick
}: CreditTableProps) => (
  <>
    <TableContainer sx={{ overflowX: 'auto', minWidth: '100%' }}>
      <Table sx={{ minWidth: 1200 }}>
      <TableHead>
        <TableRow>
          <TableCell align="center" width="5%">ID</TableCell>
          <TableCell align="center" width="20%">Solicitante</TableCell>
          <TableCell align="center" width="20%">Facultad</TableCell>
          <TableCell align="center" width="15%">Deuda</TableCell>
          <TableCell align="center" width="15%">Estado</TableCell>
          <TableCell align="center" width="15%">Factura</TableCell>
          <TableCell align="center" width="10%">Opción</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          {displayData.map((credit, index) => (
            <TableRow 
              key={credit.id} 
              hover 
              onClick={() => onCreditSelect(credit)} 
              sx={{ cursor: 'pointer' }}
            >
              <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
              <TableCell align="center">
                {`${credit.applicant?.name} ${credit.applicant?.lastname}`}
              </TableCell>
              <TableCell align="center">{credit.faculty.name}</TableCell>
              <TableCell align="center">
                ${credit.debtAmount.toLocaleString('es-CO')} {/* Añadido locale colombiano */}
              </TableCell>
              <TableCell align="center">
                <span style={{
                  color: getEstadoTexto(credit.state).color,
                  fontWeight: 'bold',
                  backgroundColor: alpha(getEstadoTexto(credit.state).color, 0.15),
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {getEstadoTexto(credit.state).text}
                </span>
              </TableCell>
              <TableCell align="center">
                {credit.bill ? (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: credit.bill.state === 'activo' ? '#2e7d32' : '#c62828',
                      backgroundColor: alpha(credit.bill.state === 'activo' ? '#2e7d32' : '#c62828', 0.1),
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}
                  >
                    #{credit.bill.idBill}
                    {credit.bill.state === 'inactivo' && ' (Inactiva)'}
                  </Typography>
                ) : (
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
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptionsClick(e, credit);
                  }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
      rowsPerPageOptions={[5, 10, 25]}
      labelRowsPerPage="Filas por página"
      labelDisplayedRows={({ from, to, count }) => 
        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
    />
  </>
);