import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';

// Interfaces
interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: number;
}

// Servicio base
export const userService = {
  getAllUsers: () => api.get(endpoints.users),

  getUserById: (id: string) => api.get(endpoints.getUserById(id)),

  searchUsers: (firstname: string) => 
    api.get(endpoints.searchUsers, { params: { firstname } }),

  createUser: async (data: CreateUserData) => {
    const response = await api.post(endpoints.createUser, data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<CreateUserData>) => {
    const response = await api.put(endpoints.updateUserById(id), data);
    return response.data;
  },

  deleteUser: (id: string) => api.delete(endpoints.deleteUserById(id)),
};

// Hooks de React Query
export const useGetUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      return response.data;
    },
  });

export const useGetUserById = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await userService.getUserById(id);
      return response.data;
    },
    enabled: !!id,
  });

export const useSearchUsers = (firstname: string) =>
  useQuery({
    queryKey: ['users', 'search', firstname],
    queryFn: async () => {
      const response = await userService.searchUsers(firstname);
      return response.data;
    },
    enabled: !!firstname,
  });

export const useCreateUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) =>
  useMutation({
    mutationFn: userService.createUser,
    ...options,
  });

export const useUpdateUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserData> }) =>
      userService.updateUser(id, data),
    ...options,
  });

export const useDeleteUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) =>
  useMutation({
    mutationFn: userService.deleteUser,
    ...options,
  });