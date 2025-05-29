import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import { useGetUsers, useDeleteUser } from 'src/api/services/usersService';
import { User, AlertState } from 'src/types/user';
import UserTable from './components/UserTable';
import UserDialog from './components/UserDialog';


export default function UserManageView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<AlertState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const { data: users, isLoading, refetch } = useGetUsers();

  const deleteUser = useDeleteUser({
    onSuccess: () => {
      setAlert({
        open: true,
        message: 'Usuario eliminado exitosamente',
        severity: 'success'
      });
      refetch();
    },
    onError: () => {
      setAlert({
        open: true,
        message: 'Error al eliminar el usuario',
        severity: 'error'
      });
    },
  });

  const handleCreate = () => {
    setEditUser(null);
    setOpenDialog(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      await deleteUser.mutateAsync(id.toString());
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    refetch();
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Usuarios
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleCreate}
        sx={{ mb: 3 }}
      >
        Nuevo Usuario
      </Button>

      <Card>
        <UserTable 
          users={users || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <UserDialog
        open={openDialog}
        user={editUser}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />

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
    </Container>
  );
}