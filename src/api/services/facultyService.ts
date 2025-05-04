import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';

export const facultyService = {
  getAllFaculties: () => api.get(endpoints.faculties), // Devuelve la promesa directamente
};