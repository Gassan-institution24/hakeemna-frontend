import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

import Knowleg from './images/knowlegmap.png';
import knowlegmapAR from './images/knowlegmapAR.png';

export default function Whydoc() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center', mb: 5 }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="h2">{t('About us')}</Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'relative', paddingBottom: '10%' }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {' '}
          {t(
            'The Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency in work and production that is compatible with the goals of sustainability and environmental preservation.'
          )}
        </Typography>

        <Box
          sx={{
            textAlign: 'center',
            marginTop: 10,
            display: {
              md: 'block',
              xs: 'none',
            },
          }}
        >
          <Image
            id="About"
            sx={{
              width: '55%',
              height: '55%',
            }}
            src={curLangAr ? knowlegmapAR : Knowleg}
          />
        </Box>
      </div>
      <Typography sx={{ textAlign: 'center' }}>
        <Button
          size="large"
          href={paths.pages.About}
          variant="contained"
          sx={{ textAlign: 'center', backgroundColor: 'success.main', mb: 4 }}
        >
          {t('Read more')}
        </Button>
      </Typography>
    </Box>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 0, md: 8 },
        maxWidth: '100%',
      }}
    >
      {renderDescription}
      {renderContent}
    </Container>
  );
}
