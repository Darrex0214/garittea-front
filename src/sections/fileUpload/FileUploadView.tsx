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
// Use xlsx-style here ONLY
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useGetAssociatedNotes } from 'src/api/services/billService';

const Input = styled('input')({
  display: 'none',
});

export function FileUploadView() {
  const [errorDialog, setErrorDialog] = useState('');
  const [infoDialog, setInfoDialog] = useState('');
  const [successData, setSuccessData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getEstadoColor = (estado: string | undefined) => {
    switch ((estado || '').toLowerCase()) {
      case 'activo':
        return { text: 'Activo', color: '#C8E6C9' }; // verde claro
      case 'anulado':
      case 'anulada':
        return { text: 'Anulado', color: '#FFCDD2' }; // rojo claro
      case 'nota':
        return { text: 'Nota', color: '#BBDEFB' }; // azul claro
      default:
        return { text: estado || 'Desconocido', color: '#E0E0E0' }; // gris claro
    }
};

  const { mutate: getAssociatedNotes, isPending } = useGetAssociatedNotes({
    onSuccess: (results) => {
      if (!results.length) {
        setInfoDialog('No se encontraron facturas, asegúrese de que el formato excel sea correcto y que las facturas en el formato estén registradas en el sistema.');
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
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());

    const worksheet = workbook.worksheets[0]; // toma la primera hoja
    const rawFacturaList: string[] = [];

    // Suponemos que la data empieza en la fila 3 (índice 2)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber < 3) return; // saltar cabecera y fila 2

      const cell = row.getCell(3); // columna C = índice 3 (factura)
      const facturaText = cell?.text?.trim();

      if (!facturaText) return;

      const consecutivo = facturaText.replace(/[^0-9]/g, '');
      if (consecutivo) {
        rawFacturaList.push(consecutivo);
      }
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

  
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resultados');

    const headerRow = [
      'Factura',
      'Estado Factura',
      '¿Tiene Nota Crédito?',
      'Nota Crédito',
      'Valor Nota Crédito',
      'Razón Nota Crédito',
      '¿Fue Reemplazada?',
      'Factura Reemplazo',
    ];

    worksheet.addRow(headerRow);

    // Estilo encabezados
    const header = worksheet.getRow(1);
    header.font = { bold: true };
    header.alignment = { horizontal: 'center' };
    if (header.eachCell) {
      header.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'BBDEFB' } // azul bebé
        };
        cell.border = {
          bottom: { style: 'thin' },
        };
      });
    }

    // Agregar filas
    successData.forEach(item => {
      const estado = (item.stateBill || '').toLowerCase();
      const hasNote = (item.hasNote || '').toLowerCase();

      const row = worksheet.addRow([
        item.idbill,
        capitalizeEstado(estado),
        hasNote === 'sí' ? 'Sí' : 'No',
        item.idNote ?? 'NA',
        item.amountNote ?? 'NA',
        item.reasonNote ?? 'NA',
        item.wasReplaced ?? 'NA',
        item.replacedBy ?? 'NA'
      ]);
      // Centrar todas las celdas de la fila
      row.eachCell(cell => {
        cell.alignment = { horizontal: 'center' };
      });

      // Colorear Estado Factura
      const estadoCell = row.getCell(2);
      switch (estado) {
        case 'activo':
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C8E6C9' } }; // verde
          break;
        case 'anulado':
        case 'anulada':
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCDD2' } }; // rojo
          break;
        case 'nota':
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BBDEFB' } }; // azul
          break;
        default:
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E0E0' } }; // gris
          break;
      }
      estadoCell.font = { bold: true };
      estadoCell.alignment = { horizontal: 'center' };

      // Colorear ¿Tiene Nota Crédito?
      const noteCell = row.getCell(3);
      noteCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: hasNote === 'sí' ? 'C8E6C9' : 'E0E0E0' }, // verde o gris
      };
      noteCell.alignment = { horizontal: 'center' };
    });

    // Autoajuste de columnas
    worksheet.columns.forEach(column => {
    let maxLength = 10;
    if (column.eachCell) {
      column.eachCell({ includeEmpty: true }, cell => {
        const val = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, val.length);
      });
    }
    column.width = maxLength + 2;
  });


    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'resultado_notas_credito.xlsx');
  };


const capitalizeEstado = (estado: string): string => {
  if (!estado) return 'Desconocido';
  return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
};


  return (
    <>
      <Box sx={{ mt: 4, maxWidth: 500, mx: 'auto', textAlign: 'center', border: '2px dashed #ccc', p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Subir archivo Excel de cuentas por cobrar
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
      <Dialog open={!!infoDialog} onClose={() => setInfoDialog('')}>
        <DialogTitle>Información</DialogTitle>
        <DialogContent>{infoDialog}</DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialog('')} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
