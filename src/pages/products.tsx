import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

export default function CreditosPage() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [montoCredito, setMontoCredito] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleCrearCredito = () => {
    console.log('Creando crédito con los siguientes datos:');
    console.log({ nombreCliente, montoCredito, fechaInicio, fechaFin });
    // Aquí iría la lógica para enviar los datos al backend
  };

  return (
    <>
      <Helmet>
        <title>{`Créditos - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Crear Nuevo Crédito
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" mb={3}>
              Ingresa los datos del crédito
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre del Cliente"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monto del Crédito"
                  value={montoCredito}
                  onChange={(e) => setMontoCredito(e.target.value)}
                  type="number"
                  placeholder="Ej: 1000000"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Inicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  placeholder="DD/MM/AAAA"
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Finalización"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  placeholder="DD/MM/AAAA"
                />
              </Grid>

              <Grid xs={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-circle-outline" />}
                  onClick={handleCrearCredito}
                >
                  Crear Crédito
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DashboardContent>
    </>
  );
} 

