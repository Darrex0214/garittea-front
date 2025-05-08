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

        {/* Número de facultades top */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Facultades Top"
            percent={3.6}
            total={errorTop ? 0 : facultadesTop?.length ?? 0}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        {/* Leave all other widgets unchanged */}
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Messages"
            percent={-5.6}
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
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

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
