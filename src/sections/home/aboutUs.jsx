import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';

import HOME from './images/home.jpg';

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
      <Stack
        sx={{
          flex: 1,
          justifyContent: 'start',
          alignItems: 'start',
          p: 6,
        }}
      >
        <Stack spacing={3} sx={{ textAlign: 'start', mb: 5 }}>
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
            <Typography variant="h6" sx={{ textAlign: 'start', textTransform: 'none' }}>
              {t(
                'Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency at work.'
              )}
            </Typography>
          </div>
          <Stack direction="row" sx={{ alignSelf: 'end', mt: 4 }}>
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
                <ArrowForwardIosIcon sx={{ color: 'white', fontSize: '20px' }} />
              </div>
            </Button>
          </Stack>
        </Box>
      </Stack>
      <Stack
        sx={{
          flex: 1,
          justifyContent: 'start',
          alignItems: 'start',
          p: 6,
        }}
      >
        <img
          decoding="async"
          loading="lazy"
          alt="medical services"
          src={HOME}
          style={{
            width: '90%',
            maxWidth: '600px',
            objectFit: 'contain',
            borderRadius: 6,
          }}
        />
      </Stack>
    </Stack>
  );
}
