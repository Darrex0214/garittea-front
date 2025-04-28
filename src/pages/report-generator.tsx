import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { Credit } from 'src/types/credit';
import { useGetCredits } from 'src/api/services/creditService';
import { CreditReport } from 'src/sections/reports/credit-report';
import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics-current-visits';
import { Iconify } from 'src/components/iconify';

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

// Interfaces para los datos extraídos
interface User {
  id: number;
  name: string;
}

interface Faculty {
  id: number;
  name: string;
}

export default function ReportGenerator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportType } = location.state || { reportType: 'creditReport' };
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [selectedState, setSelectedState] = useState<number>(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [facultySearchQuery, setFacultySearchQuery] = useState('');
  
  // Estados para agregar nuevos usuarios
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [userIdError, setUserIdError] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  
  // Estados para agregar nuevas facultades
  const [openFacultyDialog, setOpenFacultyDialog] = useState(false);
  const [newFacultyId, setNewFacultyId] = useState('');
  const [newFacultyName, setNewFacultyName] = useState('');
  const [facultyIdError, setFacultyIdError] = useState(false);
  const [facultyNameError, setFacultyNameError] = useState(false);
  
  // Estado para mostrar alertas
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

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

  // Extraer usuarios únicos de los créditos
  const [uniqueUsers, setUniqueUsers] = useState<User[]>([]);
  useEffect(() => {
    if (credits.length > 0) {
      const userMap = new Map<number, User>();
      credits.forEach((credit) => {
        if (credit.user && !userMap.has(credit.user.id)) {
          userMap.set(credit.user.id, { id: credit.user.id, name: credit.user.name });
        }
      });
      setUniqueUsers(Array.from(userMap.values()));
    }
  }, [credits]);

  // Extraer facultades únicas de los créditos
  const [uniqueFaculties, setUniqueFaculties] = useState<Faculty[]>([]);
  useEffect(() => {
    if (credits.length > 0) {
      const facultyMap = new Map<number, Faculty>();
      credits.forEach((credit) => {
        if (credit.faculty && !facultyMap.has(credit.faculty.id)) {
          facultyMap.set(credit.faculty.id, { id: credit.faculty.id, name: credit.faculty.name });
        }
      });
      setUniqueFaculties(Array.from(facultyMap.values()));
    }
  }, [credits]);

  // Filtrar usuarios por búsqueda
  const filteredUsers = useMemo(
    () => uniqueUsers.filter((user) => 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
    ),
    [uniqueUsers, userSearchQuery]
  );

  // Filtrar facultades por búsqueda
  const filteredFaculties = useMemo(
    () => uniqueFaculties.filter((faculty) => 
      faculty.name.toLowerCase().includes(facultySearchQuery.toLowerCase())
    ),
    [uniqueFaculties, facultySearchQuery]
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
    const paidPercentage = (totalDebt > 0) ? (paidDebt / totalDebt) * 100 : 0;

    return {
      totalDebt,
      paidDebt,
      paidPercentage,
    };
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const renderReportTitle = () => {
    switch (reportType) {
      case 'creditReport':
        return 'Reporte Crediticio';
      case 'technicalReport':
        return 'Reporte Técnico';
      case 'userReport':
        return 'Reporte de Usuarios';
      case 'facultyReport':
        return 'Reporte de Facultades';
      default:
        return 'Reporte';
    }
  };

  // Manejadores para el diálogo de usuarios
  const handleOpenUserDialog = () => {
    setNewUserId('');
    setNewUserName('');
    setUserIdError(false);
    setUserNameError(false);
    setOpenUserDialog(true);
  };
  
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };
  
  const handleAddUser = () => {
    // Validaciones
    let hasError = false;
    
    if (!newUserId.trim() || Number.isNaN(Number(newUserId))) {
      setUserIdError(true);
      hasError = true;
    } else {
      setUserIdError(false);
    }
    
    if (!newUserName.trim()) {
      setUserNameError(true);
      hasError = true;
    } else {
      setUserNameError(false);
    }
    
    if (hasError) return;
    
    const userId = Number(newUserId);
    
    // Verificar si el ID ya existe
    const userExists = uniqueUsers.some(user => user.id === userId);
    
    if (userExists) {
      setSnackbar({
        open: true,
        message: 'El ID de usuario ya existe.',
        severity: 'error',
      });
      return;
    }
    
    // Añadir el nuevo usuario a la lista (en una aplicación real, aquí iría una llamada a una API)
    const newUser: User = {
      id: userId,
      name: newUserName,
    };
    
    // En una aplicación real, esto se haría con una llamada a la API
    // Por ahora, solo actualizamos el estado local
    setUniqueUsers(prev => [...prev, newUser]);
    
    setSnackbar({
      open: true,
      message: 'Usuario añadido correctamente',
      severity: 'success',
    });
    
    handleCloseUserDialog();
  };
  
  // Manejadores para el diálogo de facultades
  const handleOpenFacultyDialog = () => {
    setNewFacultyId('');
    setNewFacultyName('');
    setFacultyIdError(false);
    setFacultyNameError(false);
    setOpenFacultyDialog(true);
  };
  
  const handleCloseFacultyDialog = () => {
    setOpenFacultyDialog(false);
  };
  
  const handleAddFaculty = () => {
    // Validaciones
    let hasError = false;
    
    if (!newFacultyId.trim() || Number.isNaN(Number(newFacultyId))) {
      setFacultyIdError(true);
      hasError = true;
    } else {
      setFacultyIdError(false);
    }
    
    if (!newFacultyName.trim()) {
      setFacultyNameError(true);
      hasError = true;
    } else {
      setFacultyNameError(false);
    }
    
    if (hasError) return;
    
    const facultyId = Number(newFacultyId);
    
    // Verificar si el ID ya existe
    const facultyExists = uniqueFaculties.some(faculty => faculty.id === facultyId);
    
    if (facultyExists) {
      setSnackbar({
        open: true,
        message: 'El ID de facultad ya existe.',
        severity: 'error',
      });
      return;
    }
    
    // Añadir la nueva facultad a la lista
    const newFaculty: Faculty = {
      id: facultyId,
      name: newFacultyName,
    };
    
    // En una aplicación real, esto se haría con una llamada a la API
    // Por ahora, solo actualizamos el estado local
    setUniqueFaculties(prev => [...prev, newFaculty]);
    
    setSnackbar({
      open: true,
      message: 'Facultad añadida correctamente',
      severity: 'success',
    });
    
    handleCloseFacultyDialog();
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <>
      <Helmet>
        <title> {`Generador de Reportes - ${CONFIG.appName}`}</title>
      </Helmet>

      <DashboardContent>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Typography variant="h4">
              {renderReportTitle()}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              onClick={handleGoBack}
            >
              Volver
            </Button>
          </Box>

          <Card>
            <CardContent>
              {reportType === 'creditReport' && (
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
              )}

              {reportType === 'technicalReport' && (
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

              {reportType === 'userReport' && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      Listado de Usuarios
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={handleOpenUserDialog}
                    >
                      Nuevo Usuario
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Buscar usuarios..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Nombre</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {reportType === 'facultyReport' && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                      Listado de Facultades
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      onClick={handleOpenFacultyDialog}
                    >
                      Nueva Facultad
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Buscar facultades..."
                    value={facultySearchQuery}
                    onChange={(e) => setFacultySearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Nombre</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredFaculties.map((faculty) => (
                          <TableRow key={faculty.id}>
                            <TableCell>{faculty.id}</TableCell>
                            <TableCell>{faculty.name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Container>
      </DashboardContent>
      
      {/* Diálogo para agregar nuevo usuario */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
        <DialogTitle>Agregar nuevo usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="ID"
              type="number"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              error={userIdError}
              helperText={userIdError ? "Por favor ingrese un ID válido" : ""}
              fullWidth
            />
            <TextField
              label="Nombre"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              error={userNameError}
              helperText={userNameError ? "El nombre es requerido" : ""}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancelar</Button>
          <Button onClick={handleAddUser} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para agregar nueva facultad */}
      <Dialog open={openFacultyDialog} onClose={handleCloseFacultyDialog}>
        <DialogTitle>Agregar nueva facultad</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="ID"
              type="number"
              value={newFacultyId}
              onChange={(e) => setNewFacultyId(e.target.value)}
              error={facultyIdError}
              helperText={facultyIdError ? "Por favor ingrese un ID válido" : ""}
              fullWidth
            />
            <TextField
              label="Nombre"
              value={newFacultyName}
              onChange={(e) => setNewFacultyName(e.target.value)}
              error={facultyNameError}
              helperText={facultyNameError ? "El nombre es requerido" : ""}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFacultyDialog}>Cancelar</Button>
          <Button onClick={handleAddFaculty} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para mostrar mensajes */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
} 