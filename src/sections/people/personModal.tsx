import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Person } from 'src/types/person';

interface PersonModalProps {
  open: boolean;
  onClose: () => void;
  person: Person | null;
  onSave: (person: Person) => void;
  faculties: { id: number; name: string; phone: string }[];
}

export default function PersonModal({
  open,
  onClose,
  person,
  onSave,
  faculties,
}: PersonModalProps) {
  const [formData, setFormData] = useState<Omit<Person, 'id'> & { id?: number }>({
    firstname: '',
    lastname: '',
    cellphone: '',
    email: '',
    faculty: [{ id: 0, name: '', phone: '' }],
  });
  
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    cellphone: '',
    email: '',
    faculty: { id: 0, name: '', phone: '' },  // Simplifica esto para facilitar la gestión de errores
  });

  useEffect(() => {
    if (person) {
      setFormData({
        id: person.id,
        firstname: person.firstname,
        lastname: person.lastname,
        cellphone: person.cellphone,
        email: person.email,
        faculty: person.faculty && person.faculty.length > 0 
          ? person.faculty.map(f => ({
              id: Number(f.id), // Convertir a número explícitamente
              name: f.name,
              phone: f.phone || ''
            }))
          : [{ id: 0, name: '', phone: '' }]
      });
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        cellphone: '',
        email: '',
        faculty: []
      });
      
      setErrors({
        firstname: '',
        lastname: '',
        cellphone: '',
        email: '',
        faculty: { id: 0, name: '', phone: '' }
      });
    }
  }, [person, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Limpiar error cuando el usuario escribe
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFacultyChange = (event: SelectChangeEvent) => {
    const facultyId = Number(event.target.value);
    
    const selectedFaculty = faculties.find(f => f.id === facultyId);
    
    if (selectedFaculty) {
      // Actualizar el faculty como un array con un objeto
      setFormData(prev => ({
        ...prev,
        faculty: [{ 
          id: selectedFaculty.id,
          name: selectedFaculty.name,
          phone: selectedFaculty.phone || ''
        }]
      }));
    } else if (event.target.value === '') {
      // Manejar el caso de "Ninguna" seleccionado
      setFormData(prev => ({
        ...prev,
        faculty: []
      }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      firstname: '',
      lastname: '',
      cellphone: '',
      email: '',
      faculty: { id: 0, name: '', phone: '' },
    };

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'El nombre es requerido';
      isValid = false;
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'El apellido es requerido';
      isValid = false;
    }

    if (!formData.cellphone.trim()) {
      newErrors.cellphone = 'El teléfono es requerido';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.cellphone)) {
      newErrors.cellphone = 'Ingrese un número telefónico válido (10 dígitos)';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const personToSave: Person = {
        id: formData.id || 0, // Usar 0 como valor por defecto para nuevas personas
        firstname: formData.firstname,
        lastname: formData.lastname,
        cellphone: formData.cellphone,
        email: formData.email,
        faculty: formData.faculty && formData.faculty.length > 0
          ? formData.faculty.map(fac => ({
              id: Number(fac.id),
              name: fac.name,
              phone: fac.phone || ''
            }))
          : []
      };
      
      onSave(personToSave);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {person ? 'Editar Persona' : 'Crear Nueva Persona'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            error={Boolean(errors.firstname)}
            helperText={errors.firstname}
          />

          <TextField
            fullWidth
            label="Apellido"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            error={Boolean(errors.lastname)}
            helperText={errors.lastname}
          />

          <TextField
            fullWidth
            label="Teléfono"
            name="cellphone"
            value={formData.cellphone}
            onChange={handleChange}
            error={Boolean(errors.cellphone)}
            helperText={errors.cellphone}
          />

          <TextField
            fullWidth
            label="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <FormControl fullWidth error={Boolean(errors.faculty)}>
            <InputLabel>Facultad (opcional)</InputLabel>
            <Select
              name="faculty"
              value={formData.faculty && formData.faculty.length > 0 ? String(formData.faculty[0].id) : ''}
              label="Facultad (opcional)"
              onChange={handleFacultyChange}
              renderValue={(selected) => {
                // Si hay un valor seleccionado, busca la facultad y muestra su nombre
                if (selected && selected !== '') {
                  const selectedId = Number(selected);
                  const selectedFaculty = faculties.find(f => f.id === selectedId);
                  return selectedFaculty ? selectedFaculty.name : 'Facultad seleccionada';
                }
                return 'Ninguna';
              }}
            >
              <MenuItem value="">
                <em>Ninguna</em>
              </MenuItem>
              {faculties.map((faculty) => (
                <MenuItem key={faculty.id} value={String(faculty.id)}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
            {errors.faculty && <p className="error-text">{errors.faculty.name}</p>}
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {person ? 'Guardar cambios' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}