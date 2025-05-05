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

interface FormData {
  userId: string;
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
}

// Estado inicial para el formulario
const initialFormData: FormData = {
  userId: '',
  applicantId: '',
  managingPersonId: '',
  facultyId: '',
  debtAmount: '',
};

export function CreateCreditView({ onSuccess }: CreateCreditViewProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const {
    mutate: createCredit,
    isPending,
    isSuccess,
    isError,
    data: createdCredit,
    error,
  } = useCreateCredit();

  const [peopleOptions, setPeopleOptions] = useState<Option[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [facultiesOptions, setFacultiesOptions] = useState<Option[]>([]);
  const [loadingFaculties, setLoadingFaculties] = useState(false);

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

  const handleSelectChange = (field: keyof FormData) => (
    _event: any,
    value: Option | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? value.id.toString() : '',
    }));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createCredit({
      userId: parseInt(formData.userId, 10),
      applicantId: parseInt(formData.applicantId, 10),
      managingPersonId: formData.managingPersonId
        ? parseInt(formData.managingPersonId, 10)
        : null,
      facultyId: parseInt(formData.facultyId, 10),
      debtAmount: parseInt(formData.debtAmount, 10),
    });
  };

  // Reset form y notificar éxito
  useEffect(() => {
    if (isSuccess && createdCredit) {
      setFormData(initialFormData);
      onSuccess();
    }
  }, [isSuccess, createdCredit, onSuccess]);

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

          <TextField
            fullWidth
            name="userId"
            label="ID de Usuario"
            type="number"
            value={formData.userId}
            onChange={handleInputChange}
          />

          <Autocomplete
            options={peopleOptions}
            getOptionLabel={(option) => option.name}
            loading={loadingPeople}
            value={
              peopleOptions.find((opt) => opt.id.toString() === formData.applicantId) ||
              null
            }
            onChange={handleSelectChange('applicantId')}
            renderInput={(params) => <TextField {...params} label="Solicitante" />}
          />

          <Autocomplete
            options={peopleOptions}
            getOptionLabel={(option) => option.name}
            loading={loadingPeople}
            value={
              peopleOptions.find((opt) => opt.id.toString() === formData.managingPersonId) ||
              null
            }
            onChange={handleSelectChange('managingPersonId')}
            renderInput={(params) => <TextField {...params} label="Gestor" />}
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
            renderInput={(params) => <TextField {...params} label="Facultad" />}
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
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            sx={{ alignSelf: 'flex-end', mt: 2 }}
          >
            Crear Orden
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
