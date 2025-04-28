// src/sections/createCredit/CreateCreditView.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Autocomplete,
  FormControl,
  FormLabel,
  AutocompleteRenderInputParams,
} from '@mui/material';
import { useCreateCredit } from 'src/api/services/creditService';

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
  lastName?: string; // O cualquier otra propiedad que quieras mostrar
}

export function CreateCreditView() {
  const [formData, setFormData] = useState<FormData>({
    userId: '',
    applicantId: '',
    managingPersonId: '',
    facultyId: '',
    debtAmount: '',
  });
  const { mutate: createCredit, isPending, isSuccess, isError, data: createdCredit, error } = useCreateCredit();

  // Estados para las opciones de selección (simulados por ahora)
  const [usersOptions, setUsersOptions] = useState<Option[]>([{ id: 1, name: 'Usuario 1' }, { id: 2, name: 'Usuario 2' }]);
  const [applicantsOptions, setApplicantsOptions] = useState<Option[]>([{ id: 1, name: 'Solicitante 1', lastName: 'Apellido 1' }, { id: 2, name: 'Solicitante 2', lastName: 'Apellido 2' }]);
  const [managingPersonsOptions, setManagingPersonsOptions] = useState<Option[]>([{ id: 1, name: 'Gestor 1' }, { id: 2, name: 'Gestor 2' }]);
  const [facultiesOptions, setFacultiesOptions] = useState<Option[]>([{ id: 1, name: 'Facultad 1' }, { id: 2, name: 'Facultad 2' }]);

  const handleUserChange = (event: React.ChangeEvent<{}>, value: Option | null) => {
    setFormData({ ...formData, userId: value ? value.id.toString() : '' });
  };

  const handleApplicantChange = (event: React.ChangeEvent<{}>, value: Option | null) => {
    setFormData({ ...formData, applicantId: value ? value.id.toString() : '' });
  };

  const handleManagingPersonChange = (event: React.ChangeEvent<{}>, value: Option | null) => {
    setFormData({ ...formData, managingPersonId: value ? value.id.toString() : '' });
  };

  const handleFacultyChange = (event: React.ChangeEvent<{}>, value: Option | null) => {
    setFormData({ ...formData, facultyId: value ? value.id.toString() : '' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createCredit({
      userId: parseInt(formData.userId, 10), // Especifica radix 10
      applicantId: parseInt(formData.applicantId, 10), // Especifica radix 10
      managingPersonId: formData.managingPersonId ? parseInt(formData.managingPersonId, 10) : null, // Especifica radix 10
      facultyId: parseInt(formData.facultyId, 10), // Especifica radix 10
      debtAmount: parseFloat(formData.debtAmount),
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
        Error al crear el crédito: {error?.message || 'Ocurrió un error al crear el crédito.'}
      </Typography>
    );
  }

  if (isSuccess && createdCredit) {
    return (
      <Typography color="success">
        Crédito creado exitosamente con ID: {createdCredit.id}
      </Typography>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Crear Nuevo Crédito
      </Typography>
      <FormControl fullWidth margin="normal">
        <Autocomplete
          id="userId"
          options={usersOptions}
          getOptionLabel={(option) => option.name}
          value={usersOptions.find((option) => option.id.toString() === formData.userId) || null}
          onChange={handleUserChange}
          renderInput={(params) => <TextField {...params} label="Usuario" />}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Autocomplete
          id="applicantId"
          options={applicantsOptions}
          getOptionLabel={(option) => `${option.name} ${option.lastName || ''}`}
          value={applicantsOptions.find((option) => option.id.toString() === formData.applicantId) || null}
          onChange={handleApplicantChange}
          renderInput={(params) => <TextField {...params} label="Solicitante" />}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Autocomplete
          id="managingPersonId"
          options={managingPersonsOptions}
          getOptionLabel={(option) => option.name}
          value={managingPersonsOptions.find((option) => option.id.toString() === formData.managingPersonId) || null}
          onChange={handleManagingPersonChange}
          renderInput={(params) => <TextField {...params} label="Gestor" />}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Autocomplete
          id="facultyId"
          options={facultiesOptions}
          getOptionLabel={(option) => option.name}
          value={facultiesOptions.find((option) => option.id.toString() === formData.facultyId) || null}
          onChange={handleFacultyChange}
          renderInput={(params) => <TextField {...params} label="Facultad" />}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel id="debtAmount-label">Monto de la Deuda</FormLabel>
        <TextField
          aria-labelledby="debtAmount-label"
          id="debtAmount"
          name="debtAmount"
          type="number"
          value={formData.debtAmount}
          onChange={handleInputChange}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary" disabled={isPending}>
        Crear Crédito
      </Button>
    </Box>
  );
}