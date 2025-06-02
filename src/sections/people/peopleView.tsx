import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Person } from 'src/types/person';
import { personService } from 'src/api/services/personService';
import { facultyService } from 'src/api/services/facultyService'; // Asegúrate de tener este servicio
import { PaginationComponent } from '../../components/pagination/pagination'; // Ajusta la ruta según tu estructura\
import PersonModal from './personModal'; // Crearemos este componente después

interface FacultyFromAPI {
  id: number;
  name: string;
  lastName: string; // Nota: esto parece contener números telefónicos
  emails: object;
  inchargeperson: object;
}

export function PeopleView() {
  // Estados
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [faculties, setFaculties] = useState<{ id: number; name: string; phone: string; }[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(true);
  
  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  
  // Estado para el menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar datos
  // Corrige la función fetchPeople:
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        // Espera a que la promesa se resuelva
        const response = await personService.getAllPeople();
        const data = response.data;
        
        const normalizedPeople = data.map((p: Person) => ({
          ...p,
          faculty: p.faculty || [] // Asegura que faculty siempre sea al menos un array vacío
        }));

        setPeople(normalizedPeople);
        setFilteredPeople(normalizedPeople);
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoading(false);
    }
  };

  fetchPeople();
  }, []);

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoadingFaculties(true);
      try {
        const response = await facultyService.getAllFaculties();
        
        // Transformar los datos de la API al formato que necesitamos
        const transformedFaculties = response.data.map((faculty: FacultyFromAPI) => ({
          id: faculty.id,
          name: faculty.name,
          phone: faculty.lastName || '' // Parece que lastName contiene el teléfono según tu log
        }));
        
        setFaculties(transformedFaculties);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      } finally {
        setLoadingFaculties(false);
      }
    };
  
    fetchFaculties();
  }, []);

  // Filtrar personas cuando cambian los filtros
  useEffect(() => {
    let result = [...people];
    
    if (searchName) {
      result = result.filter(person => 
        person.firstname.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    if (facultyFilter) {
      result = result.filter(person => 
        person.faculty && 
        person.faculty.length > 0 && 
        person.faculty[0].name === facultyFilter
      );
    }
    
    setFilteredPeople(result);
    setPage(0); // Resetear a la primera página cuando se filtra
  }, [people, searchName, facultyFilter]);

  // Paginación
  const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Abrir/cerrar menú de acciones
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, personId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedPersonId(personId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPersonId(null);
  };

  // Funciones CRUD
  const handleOpenModal = (person: Person | null = null) => {
    setCurrentPerson(person);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentPerson(null);
  };

  const handleEdit = () => {
    if (selectedPersonId !== null) {
      const personToEdit = people.find(person => person.id === selectedPersonId);
      handleOpenModal(personToEdit || null);
      handleCloseMenu();
    }
  };

const handleDelete = async () => {
    if (selectedPersonId !== null) {
      try {
        await personService.deletePersonById(selectedPersonId);
        setPeople(people.filter(person => person.id !== selectedPersonId));
        handleCloseMenu();
      } catch (error: any) {
        console.error('Error deleting person:', error);
        let message = 'Error al eliminar la persona';
        
        if (error.response?.data?.error) {
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

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleSavePerson = async (person: Person) => {
    try {
      if (person.id) {
        const response = await personService.updatePersonById(person.id, person);
        const updatedPerson = response.data;
        setPeople(people.map(p => p.id === person.id ? updatedPerson : p));
      } else {
        const response = await personService.createPerson(person);
        const newPerson = response.data;
        setPeople([...people, newPerson]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving person:', error);
    }
  };

  // Paginación de datos
  const paginatedPeople = filteredPeople.slice(
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
          <Typography variant="h4">Personas</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Nueva Persona
          </Button>
        </Stack>

        <Card>
          <Box sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
            >
              {/* Filtro por nombre */}
              <TextField
                fullWidth
                label="Buscar por nombre"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
              
              {/* Filtro por facultad */}
              <FormControl fullWidth>
                <InputLabel>Facultad</InputLabel>
                <Select
                  value={facultyFilter}
                  label="Facultad"
                  onChange={(e: SelectChangeEvent) => setFacultyFilter(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Todas</em>
                  </MenuItem>
                    {faculties.map((faculty: { id: number; name: string; phone: string }) => (
                      <MenuItem key={faculty.id} value={faculty.name}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Facultad</TableCell>
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
                ) : paginatedPeople.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPeople.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>{person.firstname} {person.lastname}</TableCell>
                      <TableCell>{person.cellphone}</TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell>
                        {person.faculty && Array.isArray(person.faculty) && person.faculty.length > 0 
                          ? person.faculty[0].name 
                          : 'No asignado'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleOpenMenu(e, person.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <TablePagination
            component="div"
            count={filteredPeople.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
          </Box>
        </Card>
      </Stack>

      {/* Menú de opciones para cada fila */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>
          Editar
        </MenuItem>
        <MenuItem 
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
        >
          Eliminar
        </MenuItem>
      </Menu>

      {/* Modal para crear/editar personas */}
      <PersonModal
        open={modalOpen}
        onClose={handleCloseModal}
        person={currentPerson}
        onSave={handleSavePerson}
        faculties={faculties}
      />
      <Dialog
          open={errorDialogOpen}
          onClose={handleCloseErrorDialog}
        >
        <DialogTitle sx={{ color: 'error.main' }}>
          No se puede eliminar
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
