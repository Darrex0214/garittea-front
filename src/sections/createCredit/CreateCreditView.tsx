import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Autocomplete,
  Container,
  Card,
  InputAdornment,
} from '@mui/material';
import { useCreateCredit } from 'src/api/services/creditService';
import { personService } from 'src/api/services/personService';
import { facultyService } from 'src/api/services/facultyService';
import { useAuth } from 'src/hooks/useAuth'; 

interface FormData {
  applicantId: string;
  managingPersonId: string;
  facultyId: string;
  debtAmount: string;
}

interface Option {
  id: number;
  name: string;
}

interface CreateCreditViewProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const initialFormData: FormData = {
  applicantId: '',
  managingPersonId: '',
  facultyId: '',
  debtAmount: '',
};

export function CreateCreditView({ onSuccess, onCancel }: CreateCreditViewProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [peopleOptions, setPeopleOptions] = useState<Option[]>([]);
  const [facultyManagerOptions, setFacultyManagerOptions] = useState<Option[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [facultiesOptions, setFacultiesOptions] = useState<Option[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const { user } = useAuth();

  const {
    mutate: createCredit,
    isPending,
    isError,
    error,
  } = useCreateCredit();

  // Resetear formulario cuando el componente se monta/remonta
  useEffect(() => {
    setFormData(initialFormData);
  }, [onSuccess]);

  // Fetch people
  useEffect(() => {
    const fetchPeople = async () => {
      setLoadingPeople(true);
      try {
        const response = await personService.getAllPeople();
        setPeopleOptions(
          response.data.map((p: any) => ({ id: p.id, name: `${p.firstname} ${p.lastname}` }))
        );
      } catch (e) {
        console.error('Error fetching people:', e);
      } finally {
        setLoadingPeople(false);
      }
    };
    fetchPeople();
  }, []);

  // Fetch faculties
  useEffect(() => {
    const fetchFaculties = async () => {
      setLoadingFaculties(true);
      try {
        const response = await facultyService.getAllFaculties();
        setFacultiesOptions(
          response.data.map((f: any) => ({ id: f.id, name: f.name }))
        );
      } catch (e) {
        console.error('Error fetching faculties:', e);
      } finally {
        setLoadingFaculties(false);
      }
    };
    fetchFaculties();
  }, []);

  // Fetch faculty managers when faculty changes
  useEffect(() => {
    if (!formData.facultyId) {
      setFacultyManagerOptions([]);
      return;
    }

    const fetchFacultyManagers = async () => {
      setLoadingManagers(true);
      try {
        // Ajusta esto según tu API real
        const response = await facultyService.getFacultyById(formData.facultyId);
        if (response.data && response.data.associatedPersons) {
          setFacultyManagerOptions(
            response.data.associatedPersons.map((p: any) => ({ 
              id: p.id, 
              name: `${p.firstname} ${p.lastname}` 
            }))
          );
        } else if (response.data && response.data.inchargeperson) {
          // Si no hay personas asociadas pero sí hay encargado
          const person = response.data.inchargeperson;
          setFacultyManagerOptions([
            { id: person.id, name: `${person.firstname} ${person.lastname}` }
          ]);
        } else {
          // Si no hay ni personas asociadas ni encargado
          setFacultyManagerOptions([]);
        }
      } catch (e) {
        console.error('Error fetching faculty managers:', e);
        setFacultyManagerOptions([]);
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchFacultyManagers();
  }, [formData.facultyId]);

  const handleSelectChange = (field: keyof FormData) => (
    _event: any,
    value: Option | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? value.id.toString() : '',
    }));

    // Si cambia la facultad, limpiar el gestor seleccionado
    if (field === 'facultyId') {
      setFormData((prev) => ({
        ...prev,
        managingPersonId: '',
      }));
    }
  };

  const handleDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\$/g, '').trim();
    setFormData((prev) => ({ ...prev, debtAmount: raw }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const num = Number(value.replace(/\D/g, ''));
    return new Intl.NumberFormat('es-CO').format(num);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createCredit({
      userId: user?.id ?? 0, // Añadir el userId del usuario autenticado
      applicantId: parseInt(formData.applicantId, 10),
      managingPersonId: formData.managingPersonId
        ? parseInt(formData.managingPersonId, 10)
        : null,
      facultyId: parseInt(formData.facultyId, 10),
      debtAmount: parseInt(formData.debtAmount, 10),
    }, {
      onSuccess: () => {
        setFormData(initialFormData);
        onSuccess();
      }
    });
  };

  if (isPending) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">
        Error al crear el crédito: {error?.message || 'Ocurrió un error.'}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl">
      <Card sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <Typography variant="h4" gutterBottom>
            Crear Nuevo Crédito
          </Typography>

          <Autocomplete
            options={peopleOptions}
            getOptionLabel={(option) => option.name}
            loading={loadingPeople}
            value={
              peopleOptions.find((opt) => opt.id.toString() === formData.applicantId) ||
              null
            }
            onChange={handleSelectChange('applicantId')}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Solicitante" 
                required 
              />
            )}
          />

          <Autocomplete
            options={facultiesOptions}
            getOptionLabel={(option) => option.name}
            loading={loadingFaculties}
            value={
              facultiesOptions.find(
                (opt) => opt.id.toString() === formData.facultyId
              ) || null
            }
            onChange={handleSelectChange('facultyId')}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Facultad" 
                required 
              />
            )}
          />

          <Autocomplete
            options={facultyManagerOptions}
            getOptionLabel={(option) => option.name}
            loading={loadingManagers}
            disabled={!formData.facultyId || loadingManagers}
            value={
              facultyManagerOptions.find((opt) => opt.id.toString() === formData.managingPersonId) ||
              null
            }
            onChange={handleSelectChange('managingPersonId')}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Gestor (Opcional)" 
                helperText={!formData.facultyId ? "Primero seleccione una facultad" : ""}
              />
            )}
          />

          <TextField
            fullWidth
            name="debtAmount"
            label="Monto de la Deuda"
            value={formatCurrency(formData.debtAmount)}
            onChange={handleDebtChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            required
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24} /> : 'Crear Crédito'}
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}