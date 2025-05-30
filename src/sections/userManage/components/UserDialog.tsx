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
import { User, AlertState, UpdateUserData, CreateUserData } from 'src/types/user';

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

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

  const createUser = useCreateUser({
  onSuccess: () => {
    setAlert({
      open: true,
      message: 'Usuario creado exitosamente',
      severity: 'success'
    });
    onSuccess();
    onClose();
  },
  onError: (error: any) => {
    const errorMessage = error?.response?.data?.error || error?.message || 'Error al crear usuario';
    setAlert({
      open: true,
      message: errorMessage,
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
    onClose();
  },
  onError: (error: any) => {
    const errorMessage = error?.response?.data?.error || error?.message || 'Error al actualizar usuario';
    setAlert({
      open: true,
      message: errorMessage,
      severity: 'error'
    });
  },
});

  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormInputs>();

  useEffect(() => {
    if (user) {
      const [firstname = '', ...lastnameParts] = user.nombre.split(' ');
      const lastname = lastnameParts.join(' ');
      
      setValue('email', user.email);
      setValue('firstname', firstname);
      setValue('lastname', lastname);
      setValue('role', getRoleNumber(user.rol));
    } else {
      reset({
        email: '',
        firstname: '',
        lastname: '',
        role: 3, // Valor por defecto: Colaborador
        password: ''
      });
    }
  }, [user, setValue, reset]);

  const getRoleNumber = (rolString: string): number => {
    switch(rolString) {
      case 'Superusuario': return 1;
      case 'Administrador': return 2;
      case 'Colaborador': return 3;
      default: return 3;
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  };

const onSubmit = async (data: FormInputs) => {
  try {
    if (user) {
      // Actualizar usuario
      const updateData: UpdateUserData = {
        email: data.email.trim(),
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        role: Number(data.role)
      };

      if (data.password?.trim()) {
        updateData.password = data.password.trim();
      }

      await updateUser.mutateAsync({ 
        id: user.id.toString(), 
        data: updateData 
      });
    } else {
      // Crear nuevo usuario
      if (!data.password) {
        throw new Error('La contraseña es requerida para nuevos usuarios');
      }

      const createData: CreateUserData = {
        email: data.email.trim(),
        password: data.password.trim(),
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        role: Number(data.role)
      };

      await createUser.mutateAsync(createData);
    }
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'Error al procesar la solicitud';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      // Para errores de API que pueden venir en formato diferente
      const errorObj = error as any;
      errorMessage = errorObj.message || errorObj.error || JSON.stringify(error);
    }

    setAlert({
      open: true,
      message: errorMessage,
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
            
            <TextField
              fullWidth
              type="password"
              label={user ? "Contraseña (opcional)" : "Contraseña"}
              margin="normal"
              {...register('password', { 
                required: !user && 'Contraseña es requerida'
              })}
              error={!!errors.password}
              helperText={user ? 'Dejar en blanco para mantener la contraseña actual' : errors.password?.message}
            />
            
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
            defaultValue={3} // Valor por defecto: Colaborador
            {...register('role', { required: 'Rol es requerido' })}
            error={!!errors.role}
            helperText={
              errors.role?.message || 
              (user ? `Rol actual: ${user.rol}` : 'Rol por defecto: Colaborador')
            }
          >
            {roles.map((role) => (
              <MenuItem 
                key={role.value} 
                value={role.value}
                selected={user ? getRoleNumber(user.rol) === role.value : role.value === 3}
              >
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