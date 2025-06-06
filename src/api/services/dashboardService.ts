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

export interface CarteraAnual {
  year: number;
  total: number;
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
  getCarteraPagadaAnio: (): Promise<number> =>
    api
      .get<{ total: number }>(endpoints.carteraPagadaAnio)
      .then((res) => res.data.total),

  getCarteraPagadaUltimosAnios: (): Promise<CarteraAnual[]> =>
    api
      .get<{ series: CarteraAnual[] }>(endpoints.carteraPagadaAnios)
      .then((res) => res.data.series),

  getCarteraMorosaAnio: (): Promise<number> =>
    api
      .get<{ total: number }>(endpoints.carteraMorosaAnio)
      .then((res) => res.data.total),

  getCarteraMorosaUltimosAnios: (): Promise<{ year: number; total: number }[]> =>
    api
      .get<{ data: { year: number; total: number }[] }>(endpoints.carteraMorosaAnios)
      .then((res) => res.data.data),
};
