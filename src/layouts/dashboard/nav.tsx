import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles'; 
import { useNavigate, useLocation } from 'react-router-dom';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { varAlpha } from 'src/theme/styles';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { NavUpgrade } from '../components/nav-upgrade';

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    onClick?: () => void;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.12
        )})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} sx={sx} />
    </Box>
  );
}

export function NavMobile({
  sx,
  data,
  open,
  onClose,
  slots,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = useLocation().pathname;

  // cierra el drawer automáticamente cuando cambia la ruta
  useEffect(() => {
    if (open) onClose();
  }, [open, onClose, pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} sx={sx} />
    </Drawer>
  );
}

export function NavContent({ data, slots, sx }: NavContentProps) {
  const navigate = useNavigate();
  const pathname = usePathname();

  return (
    <>
      <Logo />

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              const handleClick = () => {
                if (item.onClick) item.onClick();
                navigate(item.path);
              };

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={item.onClick ? 'button' : RouterLink as any}
                    href={item.onClick ? undefined : item.path}
                    onClick={handleClick}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>
                    <Box component="span" flexGrow={1}>
                      {item.title}
                    </Box>
                    {item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      <NavUpgrade />
    </>
  );
}