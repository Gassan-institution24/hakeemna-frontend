import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import { useTheme } from '@mui/material/styles';
import ListSubheader from '@mui/material/ListSubheader';

import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';

import { useTranslate } from 'src/locales';

import { HEADER } from '../../../config-layout';
import { NavItem, NavItemDashboard } from './nav-item';

// ----------------------------------------------------------------------

export default function NavList({ data }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (openMenu) handleCloseMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    if (data.children) setOpenMenu(true);
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    closeTimerRef.current = setTimeout(() => setOpenMenu(false), 80);
  }, []);

  const handleKeepOpen = useCallback(() => {
    clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <>
      <NavItem
        open={openMenu}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
        title={t(data.title)}
        path={data.path}
        onClick={() => {
          setOpenMenu(false);
          document
            .getElementById(data.sectionId)
            ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }}
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        active={active}
      />

      {!!data.children && openMenu && (
        <Portal>
          <Fade in={openMenu} timeout={180}>
            <Paper
              onMouseEnter={handleKeepOpen}
              onMouseLeave={handleCloseMenu}
              sx={{
                left: 0,
                right: 0,
                m: 'auto',
                display: 'flex',
                borderRadius: '16px',
                position: 'fixed',
                zIndex: theme.zIndex.modal,
                p: theme.spacing(4, 1.5, 2, 3),
                top: HEADER.H_DESKTOP_OFFSET,
                maxWidth: theme.breakpoints.values.lg,
                // Premium dropdown styling
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow:
                  '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 50px -12px rgba(0,0,0,0.13)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                bgcolor: 'rgba(255,255,255,0.97)',
              }}
            >
              {data.children.map((list, idx) => (
                <NavSubList key={idx} subheader={list.subheader} data={list.items} />
              ))}
            </Paper>
          </Fade>
        </Portal>
      )}
    </>
  );
}

NavList.propTypes = {
  data: PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string,
    sectionId: PropTypes.string,
    children: PropTypes.array,
  }),
};

// ----------------------------------------------------------------------

function NavSubList({ data, subheader, sx, ...other }) {
  const pathname = usePathname();

  const dashboard = subheader === 'Dashboard';

  return (
    <Stack
      spacing={1.5}
      flexGrow={1}
      alignItems="flex-start"
      sx={{
        pb: 2,
        ...(dashboard && {
          pb: 0,
          maxWidth: { md: 1 / 3, lg: 540 },
        }),
        ...sx,
      }}
      {...other}
    >
      <ListSubheader
        disableSticky
        sx={{
          p: 0,
          typography: 'overline',
          fontSize: 10.5,
          letterSpacing: 1.2,
          color: 'text.disabled',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {subheader}
      </ListSubheader>

      {data.map((item, idx) =>
        dashboard ? (
          <NavItemDashboard key={idx} path={item.path} />
        ) : (
          <NavItem
            key={idx}
            title={item.title}
            path={item.path}
            active={pathname === item.path || pathname === `${item.path}/`}
            subItem
          />
        )
      )}
    </Stack>
  );
}

NavSubList.propTypes = {
  data: PropTypes.array,
  subheader: PropTypes.string,
  sx: PropTypes.object,
};
