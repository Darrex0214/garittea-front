// src/sections/fileUpload/FileUploadView.tsx
import { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useGetAssociatedNotes } from 'src/api/services/billService';

const Input = styled('input')({
  display: 'none',
});

export function FileUploadView() {
  const [errorDialog, setErrorDialog] = useState('');
  const [successData, setSuccessData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const { mutate: getAssociatedNotes, isPending } = useGetAssociatedNotes({
    onSuccess: (results) => {
      if (!results.length) {
        setErrorDialog('No se encontraron facturas con notas asociadas.');
        setSuccessData([]);
      } else {
        setSuccessData(results);
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.error || 'Error procesando el archivo.';
      setErrorDialog(msg);
    },
  });

  const handleFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const rawFacturaList: string[] = [];
  
      (json as any[][]).slice(2).some((row) => {
        const facturaCell = Array.isArray(row) ? row[2] : null;
  
        if (!facturaCell || typeof facturaCell !== 'string' || facturaCell.trim() === '') {
          return true; // Detiene la iteración
        }
  
        const consecutivo = facturaCell.replace(/[^0-9]/g, '');
        if (consecutivo) {
          rawFacturaList.push(consecutivo);
        }
  
        return false; // Continúa la iteración
      });
  
      if (rawFacturaList.length === 0) {
        setErrorDialog('No se encontraron consecutivos válidos en la columna Factura.');
        return;
      }
  
      console.log('Consecutivos:', rawFacturaList);
      getAssociatedNotes(rawFacturaList);
    } catch (err) {
      console.error('Error reading file:', err);
      setErrorDialog('Error leyendo el archivo.');
    }
  };
  
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(successData.map(item => ({
      'Nota Crédito': item.idNote,
      'Factura Inicial': item.idInitialBill,
      'Factura Reemplazo': item.idFinalBill || '',
      'Motivo': item.reason,
      'Valor': item.amount,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer]), 'resultado_notas_credito.xlsx');
  };

  return (
    <>
      <Box sx={{ mt: 4, maxWidth: 500, mx: 'auto', textAlign: 'center', border: '2px dashed #ccc', p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Subir archivo Excel con facturas
        </Typography>
       
        <label htmlFor="file-upload">
         <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
                e.target.value = ''; // ← Limpia el valor para permitir cargar el mismo archivo de nuevo
              }
            }}
            style={{ display: 'none' }}
          />
          <Button variant="contained" startIcon={<CloudUploadIcon />} component="span">
            Seleccionar archivo
          </Button>
        </label>


        {isPending && (
          <Box mt={2}>
            <CircularProgress />
            <Typography variant="body2" mt={1}>Analizando reporte...</Typography>
          </Box>
        )}

        {successData.length > 0 && (
          <Box mt={3}>
            <Button variant="outlined" color="primary" onClick={exportToExcel}>
              Descargar Resultados
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={!!errorDialog} onClose={() => setErrorDialog('')}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{errorDialog}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog('')} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
