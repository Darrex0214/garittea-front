import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Historial',
    path: '/historial',
    icon: icon('ic-user'),
  },
  {
    title: 'Créditos',
    path: '/creditos',
    icon: icon('ic-cart'),
  },
  {
    title: 'Notas Crédito',
    path: '/notas-credito',
    icon: icon('ic-lock'),
  },
  {
    title: 'Reportes',
    path: '/reportes',
    icon: icon('ic-blog'),
  }
];
