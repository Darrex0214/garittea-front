// src/api/services/dashboardService.ts

import api from '../client';
import { endpoints } from '../endpoints';

interface TotalResponse {
    debtamount: number;
}

interface TotalNotasResponse {
    total: number;
  }

export interface NotasPorAnio {
    year: number;
    total: number;
  }
  

export interface FacultadTop {
  faculty: number;
  _count: { idOrder: number };
  name: string;
}

export const dashboardService = {

  getVentasCreditoMes: (): Promise<number> =>
    api
      .get<TotalResponse>(endpoints.ventasCreditoMes)
      .then((res) => res.data.debtamount),

  getVentasPorMes: (): Promise<number[]> =>
    api
        .get<{ series: number[] }>(endpoints.ventasPorMes)
        .then((res) => res.data.series),

  getNotasCreditoAnio: (): Promise<number> =>
    api
        .get<TotalNotasResponse>(endpoints.notasCreditoAnio)
        .then((res) => res.data.total),

  getNotasPorAnio: (): Promise<NotasPorAnio[]> =>
    api
        .get<{ series: NotasPorAnio[] }>(endpoints.notasPorAnio)
        .then((res) => res.data.series),
  getFacultadesTop: (): Promise<FacultadTop[]> =>
    api
      .get<{ facultades: FacultadTop[] }>(endpoints.facultadesTop)
      .then((res) => res.data.facultades),
};
