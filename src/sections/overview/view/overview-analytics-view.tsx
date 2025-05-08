// src/sections/overview/overview-analytics-view.tsx

import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { useQuery } from '@tanstack/react-query';
import { dashboardService, FacultadTop } from 'src/api/services/dashboardService';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';


export function OverviewAnalyticsView() {
  // Fetch dashboard numbers
  const { data: ventasMes, isLoading: loadingVentasMes, isError: errorVentasMes } =
  useQuery<number, Error>({
    queryKey: ['ventasCreditoMes'],
    queryFn: dashboardService.getVentasCreditoMes,
  });
  
  const { data: ventasPorMes, isLoading: loadingVentasPorMes } = useQuery<number[], Error>({
    queryKey: ['ventasPorMes'],
    queryFn: dashboardService.getVentasPorMes,
  });

  const { data: notasAnio, isLoading: loadingNotas, isError: errorNotas } =
  useQuery<number, Error>({
    queryKey: ['notasCreditoAnio'],
    queryFn: dashboardService.getNotasCreditoAnio,
  });

  const { data: notasPorAnio, isLoading: loadingNotasPorAnio, isError: errorNotasPorAnio,
  } = useQuery({
    queryKey: ['notasPorAnio'],
    queryFn: dashboardService.getNotasPorAnio,
  });

const { data: facultadesTop, isLoading: loadingTop, isError: errorTop } =
  useQuery<FacultadTop[], Error>({
    queryKey: ['facultadesTop'],
    queryFn: dashboardService.getFacultadesTop,
  });

  const { data: carteraPagada, isLoading: loadingCarteraPagada, isError: errorCarteraPagada } =
  useQuery<number, Error>({
    queryKey: ['carteraPagadaAnio'],
    queryFn: dashboardService.getCarteraPagadaAnio,
  });

  const { data: carteraAnual, isLoading, isError } = useQuery({
    queryKey: ['carteraPagadaUltimosAnios'],
    queryFn: dashboardService.getCarteraPagadaUltimosAnios,
  });

  const { data: carteraMorosa, isLoading: loadingCarteraMorosa, isError: errorCarteraMorosa } =
  useQuery<number, Error>({
    queryKey: ['carteraMorosaAnio'],
    queryFn: dashboardService.getCarteraMorosaAnio,
  });

  const { data: carteraMorosaAnios, isLoading: loadingCarteraMorosaAnios } = useQuery({
    queryKey: ['carteraMorosaAnios'],
    queryFn: dashboardService.getCarteraMorosaUltimosAnios,
  });

  const currentMonth = new Date().getMonth();
  const current = ventasPorMes?.[currentMonth] ?? 0;
  const previous = ventasPorMes?.[currentMonth - 1] ?? 0;
  
  const percentChange =
    previous > 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0;
  
  const currentYearIndex = notasPorAnio?.length ? notasPorAnio.length - 1 : 0;
  const currentNotas = notasPorAnio?.[currentYearIndex]?.total ?? 0;
  const previousNotas = notasPorAnio?.[currentYearIndex - 1]?.total ?? 0;
  
  const percentNotas =
    previousNotas > 0
      ? ((currentNotas - previousNotas) / previousNotas) * 100
      : currentNotas > 0
      ? 100
      : 0;
  const currentIndex = carteraAnual?.length ? carteraAnual.length - 1 : 0;
  const currentCartera = carteraAnual?.[currentIndex]?.total ?? 0;
  const previousCartera = carteraAnual?.[currentIndex - 1]?.total ?? 0;
  
  const percentCartera =
    previous > 0 ? ((currentCartera - previousCartera) / previousCartera) * 100 : current > 0 ? 100 : 0;
    
  const currentIndexMorosa = carteraMorosaAnios?.length ? carteraMorosaAnios.length - 1 : 0;
  const currentMorosa = carteraMorosaAnios?.[currentIndexMorosa]?.total ?? 0;
  const previousMorosa = carteraMorosaAnios?.[currentIndexMorosa - 1]?.total ?? 0;
  
  const percentCarteraMorosa =
    previousMorosa > 0 ? ((currentMorosa - previousMorosa) / previousMorosa) * 100 : currentMorosa > 0 ? 100 : 0;
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {/* Total ventas a crédito mes actual */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Ventas a crédito (mes)"
            percent={percentChange}
            total={errorVentasMes ? 0 : ventasMes ?? 0}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              // keep the same dummy sparkline until you have real series
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              series: ventasPorMes ?? [],
            }}
          />
        </Grid>

        {/* Total notas crédito año */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Notas crédito (año)"
            percent={percentNotas }
            total={errorNotas ? 0 : notasAnio ?? 0}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: notasPorAnio?.map((item) => item.year.toString()) ?? [],
              series: notasPorAnio?.map((item) => item.total) ?? [],
            }}
          />
        </Grid>

        {/* Cartera pagada (año) */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Cartera pagada (año)"
            percent={percentCartera} // puedes calcular un porcentaje real más adelante
            total={errorCarteraPagada ? 0 : carteraPagada ?? 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: carteraAnual?.map((item) => item.year.toString()) ?? [],
              series: carteraAnual?.map((item) => item.total) ?? [],
            }}
          />
        </Grid>

        {/* Leave all other widgets unchanged */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Cartera morosa (año)"
            percent={percentCarteraMorosa} // Puedes calcular un porcentaje si comparas con otro año
            total={errorCarteraMorosa ? 0 : carteraMorosa ?? 0}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: carteraMorosaAnios?.map((item) => item.year.toString()) ?? [],
              series: carteraMorosaAnios?.map((item) => item.total) ?? [],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
        <AnalyticsCurrentVisits
          title="Facultades con más ventas a crédito"
          chart={{
            series: facultadesTop?.map((f) => ({
              label: f.name,
              value: f._count.idOrder,
            })) ?? [],
            colors: ['#2065D1', '#22C55E', '#FF5630', '#FFC107', '#8E24AA'],
          }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Ventas a crédito por mes"
            subheader="Comparativo mensual del año actual"
            chart={{
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              series: [
                {
                  name: 'Ventas',
                  data: ventasPorMes ?? [],
                },
              ],
            }}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
