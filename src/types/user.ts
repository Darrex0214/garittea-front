import { AlertColor } from '@mui/material';

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

export interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface UpdateUserData {
  email: string;
  firstname: string;
  lastname: string;
  role: number;
  password?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: number;
}