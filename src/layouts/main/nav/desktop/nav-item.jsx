import { m } from 'framer-motion';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled, keyframes } from '@mui/material/styles';
import CardActionArea from '@mui/material/CardActionArea';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';

import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const NavItem = forwardRef(
  ({ title, path, open, active, hasChild, externalLink, subItem, ...other }, ref) => {
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const renderContent = (
      <StyledNavItem
        disableRipple
        disableTouchRipple
        ref={ref}
        open={open}
        active={active}
        subItem={subItem}
        sx={{ fontSize: curLangAr ? 15 : 13.5, letterSpacing: 0.15 }}
        {...other}
      >
        {title}
        {hasChild && (
          <Iconify
            width={15}
            icon="eva:arrow-ios-downward-fill"
            sx={{
              ml: 0.5,
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        )}
      </StyledNavItem>
    );

    if (hasChild) return renderContent;

    if (externalLink) {
      return (
        <Link href={path} target="_blank" rel="noopener" color="inherit" underline="none">
          {renderContent}
        </Link>
      );
    }

    return (
      <Link component={RouterLink} href={path} color="inherit" underline="none">
        {renderContent}
      </Link>
    );
  }
);

NavItem.propTypes = {
  title: PropTypes.string,
  path: PropTypes.string,
  open: PropTypes.bool,
  active: PropTypes.bool,
  subItem: PropTypes.bool,
  hasChild: PropTypes.bool,
  externalLink: PropTypes.bool,
};

// Healthcare pulse ring — fires once on hover, single outward ripple
const pulseRing = keyframes`
  0%   { transform: translate(-50%, -50%) scale(0.15); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(2.6);  opacity: 0;   }
`;

// ----------------------------------------------------------------------

const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'subItem',
})(({ open, active, subItem, theme }) => ({
  // ── Root nav item ──────────────────────────────────────────────
  ...(!subItem && {
    ...theme.typography.body2,
    padding: '0 14px',
    height: '100%',
    position: 'relative',
    fontWeight: active ? 700 : theme.typography.fontWeightMedium,
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    letterSpacing: 0.1,
    borderRadius: 0,
    overflow: 'visible',
    transition: 'color 0.22s ease, font-weight 0.15s ease',

    // Pulse ring — teal circle that expands outward and fades (ECG / vital-sign pulse)
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 28,
      height: 28,
      borderRadius: '50%',
      border: `1.5px solid ${theme.palette.primary.main}`,
      opacity: 0,
      transform: 'translate(-50%, -50%) scale(0)',
      pointerEvents: 'none',
    },

    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      '&::before': {
        animation: `${pulseRing} 0.52s ease-out forwards`,
      },
    },

    ...(open && !active && {
      color: theme.palette.primary.main,
    }),

    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 3,
      borderRadius: 4,
      backgroundColor: 'transparent',
    },
  }),

  // ── Sub-menu item ──────────────────────────────────────────────
  ...(subItem && {
    ...theme.typography.body2,
    padding: '6px 0',
    fontSize: 13.5,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    position: 'relative',
    transition: 'color 0.18s ease, padding-left 0.18s ease',

    '&::before': {
      content: '""',
      position: 'absolute',
      left: -14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 5,
      height: 5,
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
      opacity: active ? 1 : 0,
      transition: 'opacity 0.2s',
    },

    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
      paddingLeft: '4px',
      '&::before': { opacity: 0.5 },
    },

    ...(active && {
      color: theme.palette.text.primary,
      fontWeight: 600,
    }),

    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
      borderRadius: 4,
      backgroundColor: 'transparent',
    },
  }),
}));

// ----------------------------------------------------------------------

export function NavItemDashboard({ path, sx, ...other }) {
  return (
    <Link component={RouterLink} href={path} sx={{ width: 1, height: 1 }} {...other}>
      <CardActionArea
        sx={{
          height: 1,
          minHeight: 320,
          borderRadius: 1.5,
          color: 'text.disabled',
          bgcolor: 'background.neutral',
          px: { md: 3, lg: 10 },
          ...sx,
        }}
      >
        <m.div
          whileTap="tap"
          whileHover="hover"
          variants={{
            hover: { scale: 1.02 },
            tap: { scale: 0.98 },
          }}
        >
          <Box
            component="img"
            alt="illustration_dashboard"
            src="/assets/illustrations/illustration_dashboard.png"
          />
        </m.div>
      </CardActionArea>
    </Link>
  );
}

NavItemDashboard.propTypes = {
  path: PropTypes.string,
  sx: PropTypes.object,
};
