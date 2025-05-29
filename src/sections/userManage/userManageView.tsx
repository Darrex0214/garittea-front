import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Datos de ejemplo - Luego se reemplazarán con datos reales de la API
const MOCK_USERS = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    rol: 'Administrador',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'María López',
    email: 'maria@ejemplo.com',
    rol: 'Usuario',
    estado: 'Activo',
  },
];

export default function UserManageView() {
  const [users] = useState(MOCK_USERS);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Gestión de Usuarios
      </Typography>

      <Card>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabla de usuarios">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.rol}</TableCell>
                  <TableCell>{user.estado}</TableCell>
                  <TableCell>
                    {/* Aquí irán los botones de acciones */}
                    Editar | Eliminar
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}