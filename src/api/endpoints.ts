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

  faculties: '/faculty/',

}
