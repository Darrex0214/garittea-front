import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ReportGeneratorPage() {
  const location = useLocation();
  const [reportType, setReportType] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  
  useEffect(() => {
    if (location.state?.reportType) {
      setReportType(location.state.reportType);
    }
  }, [location.state]);

  const handleGenerarReporte = () => {
    // Esta función se activará cuando se haga clic en el botón
    console.log('Generando reporte con los siguientes filtros:');
    console.log({
      reportType,
      fechaInicio,
      fechaFin,
      nombre,
      monto
    });
    // Aquí iría la lógica para generar el reporte
  };

  return (
    <>
      <Helmet>
        <title> {`Generador de Reportes - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Generador de Reportes
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" mb={3}>
              Selecciona los criterios de búsqueda
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Reporte"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="creditosRegistrados">Créditos Registrados</MenuItem>
                  <MenuItem value="seguimientoPagos">Seguimiento de Pagos</MenuItem>
                  <MenuItem value="validacionPagos">Validación de Pagos</MenuItem>
                </TextField>
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Inicial (DD/MM/AAAA)"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  placeholder="01/01/2023"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Final (DD/MM/AAAA)"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  placeholder="31/12/2023"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del cliente"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monto"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 1000000"
                  type="number"
                />
              </Grid>

              <Grid xs={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:file-text-outline" />}
                  onClick={handleGenerarReporte}
                >
                  Generar Reporte
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DashboardContent>
    </>
  );
} 