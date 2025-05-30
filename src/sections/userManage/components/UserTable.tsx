import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { User } from 'src/types/user';

const roles = [
  { value: 1, label: 'Superusuario' },
  { value: 2, label: 'Administrador' },
  { value: 3, label: 'Colaborador' },
];

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, isLoading, onEdit, onDelete }: UserTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
  }>({
    open: false,
    userId: null,
  });

  const handleDeleteClick = (userId: number) => {
    setDeleteDialog({
      open: true,
      userId,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.userId) {
      onDelete(deleteDialog.userId);
      setDeleteDialog({ open: false, userId: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  const getRolLabel = (roleValue: number) => 
    roles.find(role => role.value === roleValue)?.label || 'Desconocido';

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de usuarios">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    onClick={() => onEdit(user)}
                    color="primary"
                    size="small"
                    aria-label="editar usuario"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(user.id)}
                    color="error"
                    size="small"
                    aria-label="eliminar usuario"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar este usuario?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}