import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useForm } from 'react-hook-form';
import { useCreateUser, useUpdateUser } from 'src/api/services/usersService';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { AlertColor } from '@mui/material';
import { User, AlertState, CreateUserData } from 'src/types/user';

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormInputs extends CreateUserData {}

interface FormInputs {
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  role: number;
}

const roles = [
  { value: 1, label: 'Superusuario' },
  { value: 2, label: 'Administrador' },
  { value: 3, label: 'Colaborador' },
];

export default function UserDialog({ open, user, onClose, onSuccess }: UserDialogProps) {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm<FormInputs>({
    defaultValues: {
      role: 3
    }
  });

  const createUser = useCreateUser({
    onSuccess: () => {
      setAlert({
        open: true,
        message: 'Usuario creado exitosamente',
        severity: 'success'
      });
      onSuccess();
    },
    onError: (error: Error) => {
      setAlert({
        open: true,
        message: error.message || 'Error al crear el usuario',
        severity: 'error'
      });
    },
  });

  const updateUser = useUpdateUser({
    onSuccess: () => {
      setAlert({
        open: true,
        message: 'Usuario actualizado exitosamente',
        severity: 'success'
      });
      onSuccess();
    },
    onError: (error: Error) => {
      setAlert({
        open: true,
        message: error.message || 'Error al actualizar el usuario',
        severity: 'error'
      });
    },
  });

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      });
    } else {
      reset({
        email: '',
        firstname: '',
        lastname: '',
        role: 3
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (user) {
        await updateUser.mutateAsync({ 
          id: user.id.toString(), 
          data: {
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            role: Number(data.role)
          }
        });
      } else {
        await createUser.mutateAsync({
          ...data,
          password: data.password as string,
          role: Number(data.role)
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({
        open: true,
        message: error instanceof Error ? error.message : 'Error al procesar la solicitud',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
          
          <DialogContent>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register('email', { 
                required: 'Email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            {!user && (
              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                margin="normal"
                {...register('password', { 
                  required: 'Contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
            
            <TextField
              fullWidth
              label="Nombre"
              margin="normal"
              {...register('firstname', { required: 'Nombre es requerido' })}
              error={!!errors.firstname}
              helperText={errors.firstname?.message}
            />
            
            <TextField
              fullWidth
              label="Apellido"
              margin="normal"
              {...register('lastname', { required: 'Apellido es requerido' })}
              error={!!errors.lastname}
              helperText={errors.lastname?.message}
            />
            
            <TextField
              select
              fullWidth
              label="Rol"
              margin="normal"
              {...register('role', { required: 'Rol es requerido' })}
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting || createUser.isPending || updateUser.isPending}
            >
              {user ? 'Actualizar' : 'Crear'}
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
}