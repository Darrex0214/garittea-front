// src/api/endpoints.ts
export const endpoints = {
  credits: '/credits',
  creditById: (id: string) => `/credits/${id}`,
  creditNotes: '/creditNotes',
  createCreditNote: '/creditNotes', // ✅ New POST endpoint to create a credit note
  creditByFacultyAndState: (faculty: string, state: string) =>
    `/credits/faculty?faculty=${faculty}&state=${state}`,
  // Add others like users, auth, etc.
  updateCreditById: (id: string) => `/credits/${id}`, // Nuevo endpoint
}
