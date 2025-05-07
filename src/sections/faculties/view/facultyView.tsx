import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Stack,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { facultyService } from 'src/api/services/facultyService';
import FacultyModal from './facultyModal';

// Tipo para Faculty
export interface Faculty {
    id: number;
    name: string;
    phone: string;
    inchargeperson?: {
        id: string;
        firstname: string;
        lastname: string;
    };
    facultyEmail?: {
        idEmail: number;
        email: string;
    };
}

export function FacultyView() {
  // Estados para los datos
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  // Estado para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);

  // Estado para el menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar datos
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await facultyService.getAllFaculties();
        setFaculties(response.data);
        setFilteredFaculties(response.data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  // Filtrar facultades cuando cambia la búsqueda
  useEffect(() => {
    if (searchName) {
      const filtered = faculties.filter(
        (faculty) => faculty.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredFaculties(filtered);
    } else {
      setFilteredFaculties(faculties);
    }
    setPage(0); // Reset a la primera página al filtrar
  }, [searchName, faculties]);

  // Manejadores para el modal
  const handleOpenModal = (faculty: Faculty | null = null) => {
    setCurrentFaculty(faculty);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentFaculty(null);
  };

  // Manejadores para el menú de acciones
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, facultyId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedFacultyId(facultyId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedFacultyId(null);
  };

  // Manejadores para acciones CRUD
  const handleEdit = () => {
    const faculty = faculties.find(f => f.id === selectedFacultyId) || null;
    handleOpenModal(faculty);
    handleCloseMenu();
  };

  const handleDelete = async () => {
    if (selectedFacultyId) {
      try {
        await facultyService.deleteFacultyById(selectedFacultyId);
        setFaculties(faculties.filter(faculty => faculty.id !== selectedFacultyId));
        setFilteredFaculties(filteredFaculties.filter(faculty => faculty.id !== selectedFacultyId));
        handleCloseMenu();
      } catch (error: any) {
        console.error('Error deleting faculty:', error);
        
        // Mostrar mensaje de error en un diálogo
        let message = 'Error al eliminar la facultad';
        
        if (error.response && error.response.data && error.response.data.error) {
          message = error.response.data.error;
        } else if (error.message) {
          message = error.message;
        }
        
        setErrorMessage(message);
        setErrorDialogOpen(true);
        handleCloseMenu();
      }
    }
  };

  const handleSaveFaculty = async (faculty: Faculty) => {
    try {
      if (faculty.id) {
        // Actualizar facultad existente
        const response = await facultyService.updateFaculty(faculty.id, faculty);
        const updatedFaculty = response.data;
        setFaculties(faculties.map(f => f.id === faculty.id ? updatedFaculty : f));
      } else {
        // Crear nueva facultad
        const response = await facultyService.createFaculty(faculty);
        const newFaculty = response.data;
        setFaculties([...faculties, newFaculty]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving faculty:', error);
      
      // Opcional: mostrar mensaje de error
      let message = 'Error al guardar la facultad';
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      setErrorMessage(message);
      setErrorDialogOpen(true);
    }
  };

  // Manejadores para la paginación
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  // Paginación de datos
  const paginatedFaculties = filteredFaculties.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Facultades</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Nueva Facultad
          </Button>
        </Stack>

        <Card>
          <Box sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
            >
              <TextField
                fullWidth
                label="Buscar por nombre"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
            </Stack>
          </Box>

        <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Correo Electrónico</TableCell>
                    <TableCell>Persona a Cargo</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {loading ? (
                    <TableRow>
                    <TableCell colSpan={5} align="center">
                        Cargando...
                    </TableCell>
                    </TableRow>
                ) : paginatedFaculties.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={5} align="center">
                        No se encontraron facultades
                    </TableCell>
                    </TableRow>
                ) : (
                    paginatedFaculties.map((faculty) => (
                    <TableRow key={faculty.id}>
                        <TableCell>{faculty.name}</TableCell>
                        <TableCell>{faculty.phone || 'No asignado'}</TableCell>
                        <TableCell>{faculty.facultyEmail?.email || 'No asignado'}</TableCell>
                        <TableCell>
                        {faculty.inchargeperson 
                            ? `${faculty.inchargeperson.firstname} ${faculty.inchargeperson.lastname}` 
                            : 'No asignado'}
                        </TableCell>
                        <TableCell align="right">
                        <IconButton
                            onClick={(event) => handleOpenMenu(event, faculty.id)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
        </TableContainer>

          <TablePagination
            component="div"
            count={filteredFaculties.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      <FacultyModal
        open={modalOpen}
        onClose={handleCloseModal}
        faculty={currentFaculty}
        onSave={handleSaveFaculty}
      />

      {/* Diálogo de error */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Error
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default FacultyView;