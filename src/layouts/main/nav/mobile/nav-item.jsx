import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { alpha, styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const NavItem = forwardRef(
  ({ title, path, icon, open, button, active, hasChild, externalLink, ...other }, ref) => {
    const renderContent = (
      <StyledNavItem ref={ref} open={open} active={active} {...other}>
        {icon && (
          <Box
            component="span"
            sx={{
              mr: 2,
              display: 'inline-flex',
              color: active ? 'primary.main' : 'text.disabled',
              transition: 'color 0.2s',
            }}
          >
            {icon}
          </Box>
        )}

        <Box
          component="span"
          sx={{
            flexGrow: 1,
            fontWeight: active ? 600 : 500,
            transition: 'font-weight 0.1s',
          }}
        >
          {title}
          {button}
        </Box>

        {hasChild && (
          <Iconify
            width={16}
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            sx={{ color: 'text.disabled', flexShrink: 0 }}
          />
        )}
      </StyledNavItem>
    );

    if (hasChild) return renderContent;

    if (externalLink)
      return (
        <Link href={path} target="_blank" rel="noopener" color="inherit" underline="none">
          {renderContent}
        </Link>
      );

    return (
      <Link component={RouterLink} href={path} color="inherit" underline="none">
        {renderContent}
      </Link>
    );
  }
);

NavItem.propTypes = {
  title: PropTypes.string,
  button: PropTypes.string,
  path: PropTypes.string,
  icon: PropTypes.element,
  open: PropTypes.bool,
  active: PropTypes.bool,
  subItem: PropTypes.bool,
  hasChild: PropTypes.bool,
  externalLink: PropTypes.bool,
};

// ----------------------------------------------------------------------

const StyledNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active, theme }) => ({
  ...theme.typography.body2,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? theme.typography.fontWeightSemiBold : theme.typography.fontWeightMedium,
  fontSize: 15,
  height: 52,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  position: 'relative',
  borderRadius: 0,
  transition: 'background-color 0.18s ease, color 0.18s ease',

  // Left accent bar for active item
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '20%',
    height: '60%',
    width: 3,
    borderRadius: '0 3px 3px 0',
    backgroundColor: theme.palette.primary.main,
    opacity: active ? 1 : 0,
    transform: active ? 'scaleY(1)' : 'scaleY(0)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  },

  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.07),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
  }),

  ...(!active && {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      color: theme.palette.primary.main,
      '&::before': {
        opacity: 0.4,
        transform: 'scaleY(1)',
      },
    },
  }),

  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: -2,
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
  },
}));
