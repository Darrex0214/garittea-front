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
// Importa los hooks para obtener todas las opciones
import { useGetUsers } from 'src/api/services/userService'; // Asegúrate de crear este servicio y hook
import { useGetApplicants } from 'src/api/services/applicantService'; // Asegúrate de crear este servicio y hook
import { useGetManagingPersons } from 'src/api/services/managingPersonService'; // Asegúrate de crear este servicio y hook
import { useGetFaculties } from 'src/api/services/facultyService'; // Asegúrate de crear este servicio y hook

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

  // Estados para las opciones de selección
  const { data: usersData, isLoading: isUsersLoading, isError: isUsersError } = useGetUsers();
  const [usersOptions, setUsersOptions] = useState<Option[]>([]);

  const { data: applicantsData, isLoading: isApplicantsLoading, isError: isApplicantsError } = useGetApplicants();
  const [applicantsOptions, setApplicantsOptions] = useState<Option[]>([]);

  const { data: managingPersonsData, isLoading: isManagingPersonsLoading, isError: isManagingPersonsError } = useGetManagingPersons();
  const [managingPersonsOptions, setManagingPersonsOptions] = useState<Option[]>([]);

  const { data: facultiesData, isLoading: isFacultiesLoading, isError: isFacultiesError } = useGetFaculties();
  const [facultiesOptions, setFacultiesOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (usersData) {
      setUsersOptions(usersData.map(user => ({ id: user.idusers, name: user.firstname }))); // Ajusta según la estructura de tu data
    }
    if (applicantsData) {
      setApplicantsOptions(applicantsData.map(applicant => ({ id: applicant.idperson, name: applicant.name, lastName: applicant.lastname }))); // Ajusta según la estructura de tu data
    }
    if (managingPersonsData) {
      setManagingPersonsOptions(managingPersonsData.map(person => ({ id: person.idperson, name: person.name }))); // Ajusta según la estructura de tu data
    }
    if (facultiesData) {
      setFacultiesOptions(facultiesData.map(faculty => ({ id: faculty.idfaculty, name: faculty.name }))); // Ajusta según la estructura de tu data
    }
  }, [usersData, applicantsData, managingPersonsData, facultiesData]);

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
      userId: parseInt(formData.userId, 10),
      applicantId: parseInt(formData.applicantId, 10),
      managingPersonId: formData.managingPersonId ? parseInt(formData.managingPersonId, 10) : null,
      facultyId: parseInt(formData.facultyId, 10),
      debtAmount: parseFloat(formData.debtAmount),
    });
  };

  // Renderizado de los Autocomplete (sin cambios significativos aquí)
  // ...

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