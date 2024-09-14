import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade } from 'src/components/animate';

import Knowleg from './images/knowlegmap.png';
import knowlegmapAR from './images/knowlegmapAR.png';

export default function Whydoc() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();

  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center', mb: 5 }}>
      <m.div variants={varFade().inDown}>
        <Typography
          sx={{
            position: 'relative',
            fontSize: 45,
            fontWeight: 600,
            fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
          }}
        >
          {t('about us')}
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: { xs: '90%', md: '70%' },
      }}
    >
      <div style={{ position: 'relative' }}>
        <Typography variant="h6" sx={{ textAlign: 'center', textTransform: 'none' }}>
          {t(
            'Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency at work.'
          )}
        </Typography>
      </div>
      <Typography sx={{ textAlign: 'center' }}>
        <Button
          size="large"
          onClick={() => router.push(paths.pages.About)}
          variant="outlined"
          id="About"
          sx={{ textAlign: 'center', borderRadius: 0, mt: 4 }}
        >
          {t('Read more')}
        </Button>
      </Typography>
    </Box>
  );

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        my: { xs: 5, md: 10 },
        gap: 5,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {renderDescription}
        {renderContent}
      </Stack>
      {/* <Box sx={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}> */}
      {/* <div style={{ position: 'relative', paddingBottom: '10%' }}>
            <Box
              sx={{
                textAlign: 'center',
                marginTop: 10,
                display: {
                  md: 'block',
                  xs: 'none',
                },
              }}
            > */}
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image alt="medical services" sx={{ width: { sx: '100%', md: '70%' } }} src={curLangAr ? knowlegmapAR : Knowleg} />
      </Stack>
      {/* </Box>
          </div>
        </Box> */}
    </Stack>
  );
}
