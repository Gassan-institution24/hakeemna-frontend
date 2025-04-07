import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';

import HOME from './images/aboutUs.jpg';

export default function Whydoc() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{
        position: 'relative',
        bgcolor: '#3CB099',
        color: 'white',
        mx: { xs: 2, sm: 5, md: 10, lg: 20 },
        mb: { xs: 5, sm: 10, md: '150px' },
        borderRadius: 4,
        p: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Stack sx={{ flex: 1, justifyContent: 'start', alignItems: 'start', p: 6 }}>
        <Stack spacing={3} sx={{ textAlign: 'start', mb: 5 }}>
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{
                position: 'relative',
                fontSize: 45,
                fontWeight: 600,
              }}
              color="white"
            >
              {t('about us')}
            </Typography>
          </m.div>
        </Stack>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Typography 
              color="white"
              variant="h6"
              sx={{ textAlign: 'start', textTransform: 'none' }}
            >
              {t(
                'Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency at work.'
              )}
            </Typography>
          </div>
          <Stack direction="row" sx={{ alignSelf:{ xs: 'center', md:  'end'}, mt: 4 }}>
            <Button
              size="large"
              onClick={() => router.push(paths.pages.About)}
              id="About"
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                bgcolor: 'transparent',
                padding: 0,
                overflow: 'hidden',
                boxShadow: 'none',
              
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  color: '#1F2C5C',
                  fontWeight: 'bold',
                  padding: '10px 16px',
                  fontSize: '16px',
                }}
              >
                {t('Read more')}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1F2C5C',
                  padding: '10px 12px',
                }}
              >
                {curLangAr ? (
                  <Iconify icon="icon-park-outline:left" width={24} sx={{ color: 'white' }} />
                ) : (
                  <Iconify icon="eva:arrow-ios-forward-fill" width={24} sx={{ color: 'white' }} />
                )}
              </div>
            </Button>
          </Stack>
        </Box>
      </Stack>
      {/* <Stack sx={{ flex: 1, justifyContent: 'start', alignItems: 'start', p: 6 }}> */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 0, md: 4 },
        }}
      >
        <img
          decoding="async"
          loading="lazy"
          alt="medical services"
          src={HOME}
          style={{
            width: '100%',
            maxWidth: 600,
            height: 'auto',
            objectFit: 'cover',
            borderRadius: 12,
          }}
        />
      </Box>
      {/* </Stack> */}
    </Stack>
  );
}
