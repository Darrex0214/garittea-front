import { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Snackbar, Autocomplete
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { personService } from '../../../api/services/personService';
import { facultyService } from '../../../api/services/facultyService';
import { useCreditOperations } from '../hooks/useCreditOperations';

// Interfaces para los tipos de datos
interface Person {
  id: number; // Note que también cambió de number a string
  firstname: string;
  lastname: string;
  cellphone: string;
  email: string;
  faculty: Array<{
    id: number;
    name: string;
    phone: string;
  }>;
}

interface Faculty {
  id: number;
  name: string;
}

interface CreditDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormInputs {
  applicantId: number;
  facultyId: number;
  debtAmount: number;
  managingPersonId: number;
  observaciones?: string;
  bill?: null; // Explícitamente definimos que bill es null al crear
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const CreditDialog = ({ open, onClose, onSuccess }: CreditDialogProps) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleError = (message: string) => {
    setAlert({
      open: true,
      message,
      severity: 'error'
    });
  };

  const { createMutation } = useCreditOperations(handleError);

  // Queries tipadas para cargar las listas
  const { data: people } = useQuery<Person[]>({
    queryKey: ['people'],
    queryFn: async () => {
      const response = await personService.getAllPeople();
      return response.data;
    }
  });

  const { data: faculties } = useQuery<Faculty[]>({
    queryKey: ['faculties'],
    queryFn: async () => {
      const response = await facultyService.getAllFaculties();
      return response.data;
    }
  });

  const { 
    control,
    register, 
    handleSubmit,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<FormInputs>();

  useEffect(() => {
    if (open) {
      reset({
        applicantId: undefined,
        facultyId: undefined,
        debtAmount: 0,
        managingPersonId: undefined,
        observaciones: '', // Inicializamos vacío
        bill: null, // Aseguramos que bill sea null
      });
    }
  }, [open, reset]);

  const handleCloseAlert = () => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      await createMutation.mutateAsync(data);
      setAlert({
        open: true,
        message: 'Venta a crédito creada exitosamente',
        severity: 'success'
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            Nueva Venta a Crédito
          </DialogTitle>
          
          <DialogContent>
            <Controller
              name="applicantId"
              control={control}
              rules={{ required: 'Solicitante es requerido' }}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete<Person>
                  {...field}
                  value={people?.find(person => person.id === value) || null}
                  fullWidth
                  options={people || []}
                  getOptionLabel={(option: Person) => `${option.firstname} ${option.lastname}`}
                  onChange={(_, newValue: Person | null) => onChange(newValue?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Solicitante"
                      margin="normal"
                      error={!!errors.applicantId}
                      helperText={errors.applicantId?.message}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="facultyId"
              control={control}
              rules={{ required: 'Facultad es requerida' }}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete<Faculty>
                  {...field}
                  value={faculties?.find(faculty => faculty.id === value) || null}
                  fullWidth
                  options={faculties || []}
                  getOptionLabel={(option: Faculty) => option.name}
                  onChange={(_, newValue: Faculty | null) => onChange(newValue?.id)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Facultad"
                      margin="normal"
                      error={!!errors.facultyId}
                      helperText={errors.facultyId?.message}
                    />
                  )}
                />
              )}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Monto de la deuda"
              margin="normal"
              {...register('debtAmount', { 
                required: 'Monto es requerido',
                valueAsNumber: true, // Convertir a número
                min: {
                  value: 1,
                  message: 'El monto debe ser mayor a 0'
                }
              })}
              error={!!errors.debtAmount}
              helperText={errors.debtAmount?.message}
            />

            <Controller
              name="managingPersonId"
              control={control}
              rules={{ required: 'Gestor es requerido' }}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete<Person>
                  {...field}
                  value={people?.find(person => person.id === value) || null}
                  fullWidth
                  options={people || []}
                  getOptionLabel={(option: Person) => 
                    option ? `${option.firstname} ${option.lastname}` : ''
                  }
                  onChange={(_, newValue: Person | null) => onChange(newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gestor"
                      margin="normal"
                    />
                  )}
                />
              )}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Observaciones (Opcional)"
              margin="normal"
              {...register('observaciones')}
              placeholder="Ingrese cualquier observación relevante"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting || createMutation.isPending}
            >
              Crear
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};