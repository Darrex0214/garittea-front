import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Define tipos para el usuario y el contexto
interface User {
  id: number;
  username?: string;
  email?: string;
  role?: string;
  // Otros campos que necesites
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Crear el contexto con un valor inicial
const defaultContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => { throw new Error('No implementado'); },
  logout: () => {},
  error: null
};

// Crear y exportar el contexto
export const AuthContext = createContext<AuthContextType>(defaultContext);

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Configurar token en axios
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          
          // Obtener datos del usuario (ajusta esta URL a tu API)
          const response = await axios.get('/api/auth/me');
          setUser(response.data);
        } catch (err) {
          console.error('Error verificando autenticación:', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common.Authorization;
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Función de inicio de sesión
  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {

      // Ajusta esta URL a tu endpoint real de login
        const response = await axios.post('/api/auth/login', credentials);
        const { token, userData } = response.data;
        setUser(userData);
      
        localStorage.setItem('token', token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
  };

   return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error
      }
    },
    children
  );
}