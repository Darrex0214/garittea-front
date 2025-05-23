import type { BoxProps } from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { useId, forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/home', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {

    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src="/assets/logo/garittea.png"
        width="100%"
        height="100%"
        sx={{ objectFit: 'contain' }}
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src="/assets/logo/garittea.png"
        width="100%"
        height="100%"
        sx={{ objectFit: 'contain' }}
      />
    );

    const baseSize = {
      width: width ?? 200,
      height: height ?? 200,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
