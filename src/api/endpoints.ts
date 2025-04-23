// src/api/endpoints.ts
export const endpoints = {
  credits: '/credits',
  creditById: (id: string) => `/credits/${id}`,
  creditNotes: '/creditNotes',
  // Add others like users, auth, etc.
}
