import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';

export const facultyService = {
  getAllFaculties: () => api.get(endpoints.faculties), 
  getFacultyById: (id: string) => api.get(endpoints.getFacultyById(id)),
  createFaculty: (data: any) => api.post(endpoints.createFaculty, data),
  updateFaculty: (id: number, data: any) => api.put(endpoints.updateFacultyById(id), data),
  deleteFacultyById: (id: number) => api.delete(endpoints.deleteFacultyById(id)),
};