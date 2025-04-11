import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { Credit } from 'src/types/credit';
import { useGetCredits } from 'src/api/services/creditService';
import { CreditReport } from 'src/sections/reports/credit-report';
import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics-current-visits';

// Registrando los plugins de dayjs
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// ----------------------------------------------------------------------

const PDFDownloadLink = lazy(() => import('@react-pdf/renderer').then(module => ({
  default: module.PDFDownloadLink
})));

const stateOptions = [
  { value: 0, label: 'Todos' },
  { value: 1, label: 'Pendiente' },
  { value: 2, label: 'Nota crédito' },
  { value: 3, label: 'Pagado' },
];

const getStateLabel = (state: number): string => {
  switch (state) {
    case 1:
      return 'Pendiente';
    case 2:
      return 'Nota crédito';
    case 3:
      return 'Pagado';
    default:
      return 'Desconocido';
  }
};

const formatDate = (date: Date) => dayjs(date).format('DD/MM/YYYY');

export default function ReportGenerator() {
  const location = useLocation();
  const { reportType } = location.state || { reportType: 'creditReport' };
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [selectedState, setSelectedState] = useState<number>(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const { data: creditsData, isLoading } = useGetCredits();

  useEffect(() => {
    if (creditsData) {
      setCredits(creditsData);
      setLoading(false);
    }
  }, [creditsData]);

  const filteredCredits = useMemo(
    () => credits.filter((credit) => {
      const stateMatch = selectedState === 0 || credit.state === selectedState;
      const creditDate = dayjs(credit.createdAt);
      const dateMatch = 
        (!startDate || creditDate.isSameOrAfter(startDate, 'day')) &&
        (!endDate || creditDate.isSameOrBefore(endDate, 'day'));
      return stateMatch && dateMatch;
    }),
    [credits, selectedState, startDate, endDate]
  );

  const calculateFacultyStats = () => {
    const facultyStats = credits.reduce((acc, credit) => {
      const facultyName = credit.faculty.name;
      acc[facultyName] = (acc[facultyName] || 0) + credit.debtAmount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(facultyStats).map(([label, value]) => ({
      label,
      value,
    }));
  };

  const calculateUserStats = () => {
    const userStats = credits.reduce((acc, credit) => {
      const userName = credit.user.name;
      acc[userName] = (acc[userName] || 0) + credit.debtAmount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userStats).map(([label, value]) => ({
      label,
      value,
    }));
  };

  const calculateDebtStats = () => {
    const totalDebt = credits.reduce((acc, credit) => acc + credit.debtAmount, 0);
    const paidDebt = credits
      .filter((credit) => credit.state === 3)
      .reduce((acc, credit) => acc + credit.debtAmount, 0);
    const paidPercentage = (paidDebt / totalDebt) * 100;

    return {
      totalDebt,
      paidDebt,
      paidPercentage,
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title> {`Generador de Reportes - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {reportType === 'creditReport' ? 'Reporte Crediticio' : 'Reporte Técnico'}
          </Typography>

          <Card>
            <CardContent>
              {reportType === 'creditReport' ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Reporte Mensual de Créditos
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          select
                          label="Filtrar por estado"
                          value={selectedState}
                          onChange={(e) => setSelectedState(Number(e.target.value))}
                          sx={{ minWidth: 200 }}
                        >
                          {stateOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                        <DatePicker
                          label="Fecha inicial"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              sx: { minWidth: 200 },
                            },
                          }}
                        />
                        <DatePicker
                          label="Fecha final"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              sx: { minWidth: 200 },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    <Suspense fallback={<Button variant="contained" disabled>Cargando PDF...</Button>}>
                      <PDFDownloadLink
                        document={
                          <CreditReport
                            credits={filteredCredits}
                            currentDate={new Date().toLocaleDateString()}
                            getStateLabel={getStateLabel}
                          />
                        }
                        fileName="reporte-crediticio.pdf"
                      >
                        {({ loading: pdfLoading }) => (
                          <Button variant="contained" disabled={pdfLoading}>
                            {pdfLoading ? 'Generando PDF...' : 'Descargar PDF'}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    </Suspense>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Usuario</TableCell>
                          <TableCell>Solicitante</TableCell>
                          <TableCell align="right">Deuda</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Fecha de Creación</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredCredits.map((credit) => (
                          <TableRow key={credit.id}>
                            <TableCell>{credit.id}</TableCell>
                            <TableCell>{credit.user.name}</TableCell>
                            <TableCell>{credit.applicant.name}</TableCell>
                            <TableCell align="right">${credit.debtAmount.toLocaleString()}</TableCell>
                            <TableCell>{getStateLabel(credit.state)}</TableCell>
                            <TableCell>{formatDate(credit.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Estadísticas de Créditos
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Compras por Facultad
                    </Typography>
                    <AnalyticsCurrentVisits
                      title="Distribución por Facultad"
                      chart={{
                        series: calculateFacultyStats(),
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Compras por Cliente
                    </Typography>
                    <AnalyticsCurrentVisits
                      title="Distribución por Cliente"
                      chart={{
                        series: calculateUserStats(),
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Estado de Deudas
                    </Typography>
                    <AnalyticsCurrentVisits
                      title="Estado de Pagos"
                      chart={{
                        series: [
                          {
                            label: 'Pagado',
                            value: calculateDebtStats().paidDebt,
                          },
                          {
                            label: 'Pendiente',
                            value: calculateDebtStats().totalDebt - calculateDebtStats().paidDebt,
                          },
                        ],
                      }}
                    />
                  </Box>

                  <Typography variant="body1">
                    Porcentaje de deuda pagada: {calculateDebtStats().paidPercentage.toFixed(2)}%
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </DashboardContent>
    </>
  );
} 