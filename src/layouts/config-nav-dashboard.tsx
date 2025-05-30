import { SvgColor } from 'src/components/svg-color';
import { logout } from 'src/api/authService';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/home',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Gestion de Usuarios',
    path: '/home/gestion-usuarios',
    icon: icon('ic-user'),
  },
  {
    title: 'Personas',
    path: '/home/personas',
    icon: icon('ic-user'),
  },
  {
    title: 'Facultades',
    path: '/home/facultades',
    icon: icon('ic-faculties'),
  },
  {
    title: 'Ventas a Crédito',
    path: '/home/creditos',
    icon: icon('ic-money'),
  },
  {
    title: 'Notas Crédito',
    path: '/home/notas-credito',
    icon: icon('ic-note'),
  },
  {
    title: 'Creación de Notas',
    path: '/home/creacion-notas',
    icon: icon('ic-create-note'),
  },
  {
    title: 'Carga de CXC',
    path: '/home/carga-reportes',
    icon: icon('ic-upload'),
  },
  {
    title: 'Reportes',
    path: '/home/reportes',
    icon: icon('ic-report'),
  },
  {
    title: 'Cerrar Sesión',
    path: '/sign-in',
    icon: icon('ic-log-out'),
    onClick: async () => {
      await logout();
    }
  }
];
