import path from 'path';
import { Label } from 'src/components/label';
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
    title: 'Créditos',
    path: '/home/creditos',
    icon: icon('ic-book'),
  },
  {
    title: 'Creación Créditos',
    path: '/home/creacion-creditos',
    icon: icon('ic-cart'),
  },
  {
    title: 'Notas Crédito',
    path: '/home/notas-credito',
    icon: icon('ic-lock'),
  },
  {
    title: 'Creacion Notas Crédito',
    path: '/home/creacion-notas',
    icon: icon('ic-lock'),
  },
  {
    title: 'Reportes',
    path: '/home/reportes',
    icon: icon('ic-blog'),
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
