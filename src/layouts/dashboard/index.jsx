import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { usePathname } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import { NavHiddenContext } from './nav-hidden-context';

// ----------------------------------------------------------------------

// Routes that hide the nav entirely and reach it through the header menu button.
const HIDDEN_NAV_ROUTES = [/\/(mypatients|patients)\/(?!new$)[^/]+$/];

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const settings = useSettingsContext();

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
