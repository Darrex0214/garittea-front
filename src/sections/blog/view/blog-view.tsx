import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function BlogView() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Reportes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/report-generator', { state: { reportType: 'creditosRegistrados' } })}>
              <CardMedia
                component="img"
                height="140"
                image="/assets/icons/reports/credit-report.png"
                alt="Créditos Registrados"
                sx={{ padding: 2, objectFit: 'contain' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Creación de reporte de Créditos Registrados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generar un informe detallado de los créditos registrados en el sistema.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/report-generator', { state: { reportType: 'seguimientoPagos' } })}>
              <CardMedia
                component="img"
                height="140"
                image="/assets/icons/reports/payment-tracking.png"
                alt="Seguimiento de Pagos"
                sx={{ padding: 2, objectFit: 'contain' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Creación de reporte de Seguimiento de Pagos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generar un informe detallado del seguimiento de pagos en el sistema.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardActionArea onClick={() => navigate('/report-generator', { state: { reportType: 'validacionPagos' } })}>
              <CardMedia
                component="img"
                height="140"
                image="/assets/icons/reports/payment-validation.png"
                alt="Validación de Pagos"
                sx={{ padding: 2, objectFit: 'contain' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Creación de reporte de Validación de Pagos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generar un informe detallado de validación de pagos en el sistema.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
