import { m } from 'framer-motion';

import { Box, Link, Stack, Container, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

// import MAP from './Group 117.png';
import map from './images/map.png';
import photo from './images/design.png';
import devices from './images/devices.png';

export default function MoreInfoAboutUs() {
  const { t } = useTranslate();

  return (
    <MotionViewport>
      {/* Hero Section */}
      <Stack
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: { xs: '40vh', md: '55vh' },
          color: 'white',
          mb: { xs: '40px', md: '200px' },
          position: 'relative',
          backgroundImage: `url(${photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          px: { xs: 2, md: 0 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '24px', md: '32px' } }}>
            {t('The comprehensive medical platform, Hakeemna 360')}
          </Typography>
        </m.div>
      </Stack>

      {/* About Hakeemna Section */}
      <Stack spacing={3} sx={{ textAlign: 'center', mb: { xs: 4, md: 2 } }}>
        <m.div variants={varFade().inDown}>
          <Typography sx={{ fontSize: { xs: 32, md: 45 }, fontWeight: 600 }}>
            {t('About hakeemna')}
          </Typography>
        </m.div>
      </Stack>

      <Box
        sx={{
          mb: { xs: '80px', md: '200px' },
          p: { xs: 4, md: 6 },
          mx: { xs: 2, md: 30 },
          backgroundColor: '#F2FBF8',
          boxShadow: 2,
          borderRadius: 2,
        }}
      >
        <Typography sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 600, letterSpacing: 1 }}>
          {t(
            'Our platform is the result of a collaborative effort between the healthcare sector and specialists in developing the performance of institutions seeking to achieve efficiency and excellence in work.'
          )}
        </Typography>
        <Typography sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 600, letterSpacing: 1 }}>
          {t(
            'After studying the needs of medical institutions and users (patients and others) in the Arab world, a working team was formed to develop this platform. This team fully believes in the importance of developing e-health services, particularly in the private sector, in the Arab world. This will raise the level of medical services and improve the efficiency of daily practices. For medical service providers, it will facilitate procedures for patients and securely store their medical information and documents in one place.'
          )}
        </Typography>
        <Typography sx={{ fontSize: { xs: 16, md: 20 }, fontWeight: 600, letterSpacing: 1 }}>
          {t(
            'The platform is comprehensive for all individuals and institutions, whether the user (medical service provider or patient) is subscribed to insurance companies or not. You can benefit from the services provided independently, without being tied to any insurance or insurance management group.'
          )}
        </Typography>
      </Box>

      {/* Hakeemna App Section */}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          bgcolor: '#3CB099',
          color: 'white',
          mx: { xs: 2, md: 30 },
          mb: { xs: '80px', md: '200px' },
          p: { xs: 4, md: 6 },
          borderRadius: 4,
        }}
      >
        <Stack sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <m.div variants={varFade().inUp}>
            {' '}
            <Typography sx={{ fontSize: { xs: 28, md: 45 }, fontWeight: 600, mb: 2 }}>
              {t('hakeemna app')}
            </Typography>
          </m.div>
          <Typography variant="h6" sx={{ fontSize: { xs: 14, md: 18 } }}>
            {t(
              'Hakimna 360 is a platform and smartphone application that allows users to easily and privately access the health information documented in their electronic medical records, from anywhere and at any time.'
            )}
          </Typography>
          <Stack direction="row" sx={{ mt: 2 }}>
            <Link sx={{ color: '#1F2C5C', fontSize: { xs: 14, md: 16 } }}>
              {t('Download Hakimna 360 app')}
            </Link>
          </Stack>
        </Stack>

        <Stack
          sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', mt: { xs: 4, md: -4 } }}
        >
          <img
            decoding="async"
            loading="lazy"
            alt="medical services"
            src={devices}
            style={{
              width: '90%',
              maxWidth: '500px',
              objectFit: 'contain',
              borderRadius: 6,
            }}
          />
        </Stack>
      </Stack>

      {/* Location Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#F2FBF8',
          transform: 'skewY(-3deg)',
          py: { xs: 8, md: 10 },
          mt: { xs: 6, md: 12 },
          mb: { xs: 6, md: 20 },
        }}
      >
        <Container sx={{ transform: 'skewY(3deg)' }} component={MotionViewport}>
          <Stack direction={{ xs: 'column', md: 'row-reverse' }} alignItems="center" spacing={4}>
            <Stack sx={{ flex: 1 }}>
              <m.div variants={varFade().inDown}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {t('Who are we')}
                </Typography>
              </m.div>

              <Typography sx={{ fontSize: { xs: 14, md: 16 }, my: 2 }}>
                {t(
                  'Hakimna 360 is one of the platforms of Ghassan Abu Nabaa Foundation for Project Development and Information Technology.'
                )}
              </Typography>

              <Typography sx={{ fontWeight: 600, fontSize: { xs: 14, md: 16 }, color: '#3CB099' }}>
                {t('Address: Amman, Wasfi Al Tal Street 153, Amman, Jordan')}
              </Typography>
            </Stack>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <img
                src={map}
                alt="Map Location"
                style={{
                  width: '80%',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </MotionViewport>
  );
}
