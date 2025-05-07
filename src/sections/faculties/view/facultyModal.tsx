import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { personService } from 'src/api/services/personService';

interface Person {
  id: string;
  firstname: string;
  lastname: string;
}

interface Faculty {
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

interface FacultyModalProps {
  open: boolean;
  onClose: () => void;
  faculty: Faculty | null;
  onSave: (faculty: Faculty) => void;
}

export default function FacultyModal({
  open,
  onClose,
  faculty,
  onSave,
}: FacultyModalProps) {
  const [formData, setFormData] = useState<Faculty>({
    id: 0,
    name: '',
    phone: '',
    facultyEmail: { idEmail: 0, email: '' },
    inchargeperson: undefined
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    person: ''
  });

  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);

  // Cargar la lista de personas disponibles
  useEffect(() => {
    const fetchPeople = async () => {
      setLoadingPeople(true);
      try {
        const response = await personService.getAllPeople();
        setPeople(response.data);
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoadingPeople(false);
      }
    };

    if (open) {
      fetchPeople();
    }
  }, [open]);

  useEffect(() => {
    if (faculty) {
      setFormData({
        id: faculty.id,
        name: faculty.name,
        phone: faculty.phone || '',
        facultyEmail: faculty.facultyEmail || { idEmail: 0, email: '' },
        inchargeperson: faculty.inchargeperson
      });
    } else {
      setFormData({
        id: 0,
        name: '',
        phone: '',
        facultyEmail: { idEmail: 0, email: '' },
        inchargeperson: undefined
      });
      
      setErrors({
        name: '',
        phone: '',
        email: '',
        person: ''
      });
    }
  }, [faculty, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario escribe
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      facultyEmail: {
        ...(prev.facultyEmail || { idEmail: 0 }),
        email: value
      }
    }));
    // Limpiar error cuando el usuario escribe
    setErrors((prev) => ({
      ...prev,
      email: ''
    }));
  };

  const handlePersonChange = (event: SelectChangeEvent) => {
    const personId = event.target.value;
    
    if (personId) {
      const selectedPerson = people.find(p => p.id === personId);
      if (selectedPerson) {
        setFormData(prev => ({
          ...prev,
          inchargeperson: {
            id: selectedPerson.id,
            firstname: selectedPerson.firstname,
            lastname: selectedPerson.lastname
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        inchargeperson: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      person: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    if (!formData.inchargeperson || !formData.inchargeperson.id) {
      newErrors.person = 'La persona a cargo es requerida';
      isValid = false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Ingrese un número telefónico válido (10 dígitos)';
      isValid = false;
    }
    
    // Validar email si se proporciona
    if (formData.facultyEmail?.email && !/\S+@\S+\.\S+/.test(formData.facultyEmail.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {faculty ? 'Editar Facultad' : 'Nueva Facultad'}
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
          />
          
          <TextField
            fullWidth
            label="Correo Electrónico *"
            name="email"
            value={formData.facultyEmail?.email || ''}
            onChange={handleEmailChange}
            error={Boolean(errors.email)}
            helperText={errors.email || 'Campo obligatorio'}
          />
          
          <FormControl fullWidth>
            <InputLabel>Persona a Cargo</InputLabel>
            <Select
              value={formData.inchargeperson?.id || ''}
              label="Persona a Cargo *"
              onChange={handlePersonChange}
              disabled={loadingPeople}
            >

              {people.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {`${person.firstname} ${person.lastname}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {faculty ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}