import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { SignInView } from 'src/sections/auth';
import { PrivateRoute } from './components/privateRoute';


// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const HistoryPage = lazy(() => import('src/pages/history'));
export const NoteCreditPage = lazy(() => import('src/pages/noteCredit'));
export const CreateNotePage = lazy(() => import('src/pages/createNote'));
export const FileUploadPage = lazy(() => import('src/pages/fileUpload'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ReportGeneratorPage = lazy(() => import('src/pages/report-generator'));
export const PeopleView = lazy(() => import('src/pages/historyPeople'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <AuthLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </AuthLayout>
      ),
      children: [
        { index: true, element: <SignInView /> },
        { path: 'sign-in', element: <SignInView /> },
      ],
    },
    {
      path: '/home',
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <HomePage /> },   
        { path: 'personas', element: <PeopleView /> },       
        { path: 'facultades', element: <HomePage /> },   
        { path: 'creditos', element: <HistoryPage /> },       
        { path: 'carga-reportes', element: <FileUploadPage />},
        { path: 'notas-credito', element: <NoteCreditPage />},
        { path: 'creacion-notas', element: <CreateNotePage />},
        { path: 'reportes', element: <BlogPage />},
        { path: 'report-generator', element: <ReportGeneratorPage />},
      ],
    },
    { path: '404', element: <Page404 /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}