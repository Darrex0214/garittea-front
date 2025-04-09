// src/api/services/creditService.ts
import { api } from '../client'
import { endpoints } from '../endpoints'

export const creditService = {
  getAllCredits: () => api.get(endpoints.credits),
  getCreditById: (id: string) => api.get(endpoints.creditById(id)),
  createCredit: (data: any) => api.post(endpoints.credits, data),
}
