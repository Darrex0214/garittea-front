import { People } from "@mui/icons-material";
import { updateCacheWithNewRows } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";
import { create } from "domain";

// src/api/endpoints.ts
export const endpoints = {
  credits: '/credits',
  creditById: (id: string) => `/credits/${id}`,
  creditNotes: '/creditNotes',
  creditByFacultyAndState: (faculty: string, state: string) =>
    `/credits/faculty?faculty=${faculty}&state=${state}`,
  updateCreditById: (id: string) => `/credits/${id}`,
  createCreditNote: '/creditNotes', 
  associatedNotes: '/bills/associated-notes',

  people: '/person/',
  updatePersonById: (id: string) => `/person/${id}`,
  deletePersonById: (id: string) => `/person/${id}`,
  createPerson: '/person/',

  
  ventasCreditoMes: '/dashboard/ventas-credito-mes',
  ventasPorMes: '/dashboard/ventas-por-mes',
  notasCreditoAnio: '/dashboard/notas-credito-anio',
  facultadesTop: '/dashboard/facultades-top',

  faculties: '/faculty/',
  getFacultyById: (id: string) => `/faculty/${id}`,
  updateFacultyById: (id: number) => `/faculty/${id}`,
  deleteFacultyById: (id: number) => `/faculty/${id}`,
  createFaculty: '/faculty/',

}
