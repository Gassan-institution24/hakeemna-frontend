import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { NAV } from '../config-layout';

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  let arrow
  if (settings.themeLayout === 'vertical') {
    if (curLangAr) {
      arrow = 'eva:arrow-ios-forward-fill'
    } else {
      arrow = 'eva:arrow-ios-back-fill'
    }
  } else if (curLangAr) {
    arrow = 'eva:arrow-ios-back-fill'
  } else {
    arrow = 'eva:arrow-ios-forward-fill'
  }

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
        settings.onUpdate('themeLayout', settings.themeLayout === 'vertical' ? 'mini' : 'vertical')
      }
      sx={{
        p: 0.2,
        top: 32,
        position: 'fixed',
        left: NAV.W_VERTICAL - 20,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={22}
        icon={arrow}
      />
    </IconButton>
  );
}

NavToggleButton.propTypes = {
  sx: PropTypes.object,
};
