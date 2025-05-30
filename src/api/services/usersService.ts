import { User, CreateUserData, UpdateUserData } from 'src/types/user';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';


// Servicio base
export const userService = {
  getAllUsers: () => api.get<User[]>(endpoints.users),

  getUserById: (id: string) => api.get<User>(endpoints.getUserById(id)),

  searchUsers: (firstname: string) => 
    api.get<User[]>(endpoints.searchUsers, { params: { firstname } }),

  createUser: async (data: CreateUserData) => {
    const response = await api.post<User>(endpoints.createUser, data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    const response = await api.put<User>(endpoints.updateUserById(id), data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(endpoints.deleteUserById(id));
    return response.data;
  },
};

// Hooks de React Query
export const useGetUsers = () =>
  useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAllUsers();
      return response.data;
    },
  });

export const useGetUserById = (id: string) =>
  useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await userService.getUserById(id);
      return response.data;
    },
    enabled: !!id,
  });

export const useSearchUsers = (firstname: string) =>
  useQuery<User[]>({
    queryKey: ['users', 'search', firstname],
    queryFn: async () => {
      const response = await userService.searchUsers(firstname);
      return response.data;
    },
    enabled: !!firstname,
  });

export const useCreateUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) =>
  useMutation({
    mutationFn: userService.createUser,
    ...options,
  });

export const useUpdateUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    ...options,
  });

export const useDeleteUser = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) =>
  useMutation({
    mutationFn: userService.deleteUser,
    ...options,
  });