// src/api/client.ts
import axios from 'axios'


console.log('Base URL:', import.meta.env.VITE_BACK_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;