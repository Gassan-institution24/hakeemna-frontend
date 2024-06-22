import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import {Hidden,Typography} from '@mui/material/';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import Video from './Video.mp4';
import Video2 from './Video2.mp4';
import Language from '../common/language-home-page';

// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, title }) {
  const { t } = useTranslate();
  const mdUp = useResponsive('up', 'md');
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const renderContent = (
    <Stack sx={{ width: { sm: '100vw', md: '100%', lg: '35%' } }}>
      <Stack
        sx={{
          width: '100%',
          mx: 'auto',
          maxWidth: 480,
          pl: { xs: 2, md: 1 },
          pr: { xs: 2, md: 4 },
          pt: { xs: 15, md: 5 },
          pb: { xs: 5, md: 0 },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={0.5}
      spacing={5}
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: '#FFFFFF',
      }}
    >
      <Hidden smUp>
        <span>
          <Language />
        </span>
      </Hidden>
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {t(title) || 'Hi, Welcome back'}
      </Typography>
      {title === undefined ? (
        <video style={{ width: '70%', height: '60%' }} loop autoPlay muted>
          <source src={curLangAr ? Video2 : Video2} type="video/mp4" />
          <track
            kind="captions"
            srcLang="en"
            src="path/to/your/captions.vtt"
            label="English"
            default
          />
        </video>
      ) : (
        <video style={{ width: '70%', height: '60%' }} loop autoPlay muted>
          <source src={curLangAr ? Video : Video} type="video/mp4" />
          <track
            kind="captions"
            srcLang="en"
            src="path/to/your/captions.vtt"
            label="English"
            default
          />
        </video>
      )}
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction={mdUp ? 'row' : 'column'}
      sx={{
        minHeight: '100%',
      }}
    >
      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
