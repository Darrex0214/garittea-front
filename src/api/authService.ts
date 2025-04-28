import api from './client';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const login = (credentials: SignInCredentials) =>
  api.post('/auth/login', credentials);

export const logout = () =>
  api.post('/auth/logout');