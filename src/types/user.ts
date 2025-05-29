import { AlertColor } from '@mui/material';

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  firstname: string;
  lastname: string;
  role: number;
}

export interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface CreateUserData {
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  role: number;
}