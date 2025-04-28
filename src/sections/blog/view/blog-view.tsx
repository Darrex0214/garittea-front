import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Estilo común para todas las tarjetas
const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const cardActionAreaStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export function BlogView() {
  const navigate = useNavigate();

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Reportes
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardActionArea 
              onClick={() => navigate('/report-generator', { state: { reportType: 'creditReport' } })}
              sx={cardActionAreaStyle}
            >
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
                <Iconify icon="solar:file-text-bold" width={64} sx={{ color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography gutterBottom variant="h5" component="div">
                    Reporte Crediticio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generar un informe detallado mensual de los créditos registrados incluyendo información de usuarios, solicitantes y estados de deuda.
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardActionArea 
              onClick={() => navigate('/report-generator', { state: { reportType: 'technicalReport' } })}
              sx={cardActionAreaStyle}
            >
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                  <Iconify icon="solar:chart-pie-bold" width={48} sx={{ color: 'primary.main', mb: 1 }} />
                  <Iconify icon="solar:chart-square-bold" width={64} sx={{ color: 'info.main' }} />
                </Box>
                <Box>
                  <Typography gutterBottom variant="h5" component="div">
                    Reporte Técnico
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visualizar estadísticas mediante diagramas de torta sobre compras por facultad, clientes principales y estados de deuda.
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardActionArea 
              onClick={() => navigate('/report-generator', { state: { reportType: 'userReport' } })}
              sx={cardActionAreaStyle}
            >
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
                <Iconify icon="solar:users-group-rounded-bold" width={64} sx={{ color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography gutterBottom variant="h5" component="div">
                    Reporte de Usuarios
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listado de todos los usuarios del sistema con sus respectivos IDs. Incluye una barra de búsqueda para filtrar resultados.
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardActionArea 
              onClick={() => navigate('/report-generator', { state: { reportType: 'facultyReport' } })}
              sx={cardActionAreaStyle}
            >
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
                <Iconify icon="mdi:bank" width={64} sx={{ color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography gutterBottom variant="h5" component="div">
                    Reporte de Facultades
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listado de todas las facultades registradas con sus respectivos IDs. Incluye una barra de búsqueda para filtrar resultados.
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
