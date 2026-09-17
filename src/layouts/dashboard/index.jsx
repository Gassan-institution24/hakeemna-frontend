import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { usePathname } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { setAppTimeZone } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import { NavHiddenContext } from './nav-hidden-context';

// ----------------------------------------------------------------------

// Routes that hide the nav entirely and reach it through the header menu button.
const HIDDEN_NAV_ROUTES = [
  /\/(mypatients|patients)\/(?!new$)[^/]+$/,
  // The encounter page: the doctor is treating a patient and wants the whole
  // width for it. Its own Back button returns to today's appointments.
  /\/us\/processingpage\/[^/]+$/,
];

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const settings = useSettingsContext();

  // Staff read clinic times wherever they are sitting, so every formatted time
  // in the app resolves against the clinic's country. Outside the dashboard —
  // the patient portal — times fall back to the viewer's own browser zone.
  const { user } = useAuthContext();
  const clinicTimeZone =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.country?.time_zone || null;

  useEffect(() => {
    setAppTimeZone(clinicTimeZone);
  }, [clinicTimeZone]);

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const pathname = usePathname();

  const navHidden = HIDDEN_NAV_ROUTES.some((route) => route.test(pathname));

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = (
    <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} temporary={navHidden} />
  );

  let content;

  if (navHidden) {
    // The nav renders as an overlay drawer only, so it takes no layout width.
    content = (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box sx={{ minHeight: 1, display: 'flex', flexDirection: 'column' }}>
          {renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  } else if (isHorizontal) {
    content = (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  } else if (isMini) {
    content = (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  } else {
    content = (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return <NavHiddenContext.Provider value={navHidden}>{content}</NavHiddenContext.Provider>;
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
