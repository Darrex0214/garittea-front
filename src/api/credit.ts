// src/api/credit.ts
import api from './client'
import { endpoints } from './endpoints'

export const createCredit = async (creditData: {
  userId: number
  applicantId: number
  managingPersonId: number
  facultyId: number
  debtAmount: number
}) => {
  const response = await api.post(endpoints.credits, creditData)
  return response.data
}


