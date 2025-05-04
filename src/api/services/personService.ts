import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../client';
import { endpoints } from '../endpoints';


export const personService = {
    getAllPeople: () => api.get(endpoints.people), // Devuelve la promesa directamente
    updatePersonById: (id: string, data: any) => api.put(endpoints.updatePersonById(id), data),
    deletePersonById: (id: string) => api.delete(endpoints.deletePersonById(id)),
    createPerson: (data: any) => api.post(endpoints.createPerson, data),

}
