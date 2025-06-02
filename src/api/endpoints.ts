// src/api/endpoints.ts
export const endpoints = {
    // Endpoints base
  credits: '/credits',
  
  // Endpoints con parámetros
  creditById: (id: string) => `/credits/${id}`,
  updateCreditById: (id: string) => `/credits/${id}`,
  deleteCreditById: (id: string) => `/credits/${id}`,
  checkCreditBill: (id: string) => `/credits/${id}/check-bill`,
  
  // Endpoints de búsqueda
  creditsByDates: '/credits/dates',
  creditsByFaculty: '/credits/faculty',
  creditsByManagingPerson: '/credits/managingPerson',
  creditsByApplicant: '/credits/applicant',

  // Endpoints para notas crédito
  creditNotes: '/creditNotes',                   
  createCreditNote: '/creditNotes',   

  // Endpoints de Personas
  people: '/person/',
  updatePersonById: (id: number) => `/person/${id}`,
  deletePersonById: (id: number) => `/person/${id}`,
  createPerson: '/person/',

  // Endpoints de Dashboard
  ventasCreditoMes: '/dashboard/ventas-credito-mes',
  ventasPorMes: '/dashboard/ventas-por-mes',
  notasCreditoAnio: '/dashboard/notas-credito-anio',
  facultadesTop: '/dashboard/facultades-top',
  notasPorAnio: '/dashboard/notas-por-anio',
  carteraPagadaAnio: '/dashboard/cartera-pagada-anio',
  carteraPagadaAnios: '/dashboard/cartera-pagada-anios',
  carteraMorosaAnio: 'dashboard/cartera-morosa-anio',
  carteraMorosaAnios: 'dashboard/cartera-morosa-anios',

  // Endpoints de facultades
  faculties: '/faculty/',
  getFacultyById: (id: string) => `/faculty/${id}`,
  updateFacultyById: (id: number) => `/faculty/${id}`,
  deleteFacultyById: (id: number) => `/faculty/${id}`,
  createFaculty: '/faculty/',

  // Endpoints de usuarios
  users: '/users',
  createUser: '/users',
  getUserById: (id: string) => `/users/${id}`,
  updateUserById: (id: string) => `/users/${id}`,
  deleteUserById: (id: string) => `/users/${id}`,
  searchUsers: '/users/search',

  // Endpoints de Bills
  bills: '/bills',
  dispatchBill: '/bills/dispatch',                    
  updateBillStatus: (id: number) => `/bills/${id}/update-status`, 
  associatedNotes: '/bills/associated-notes', 

} as const;
