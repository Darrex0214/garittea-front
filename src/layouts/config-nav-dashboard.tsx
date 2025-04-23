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
    path: '/products',
    icon: icon('ic-cart')
  },
  {
    title: 'Reportes',
    path: '/blog',
    icon: icon('ic-blog'),
  }
];
