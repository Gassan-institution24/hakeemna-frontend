import { m } from 'framer-motion';

import { Box, Link, Stack, Container, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

// import MAP from './Group 117.png';
import photo from './images/design.png';

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
            {t('Electronic innovation for a healthier future')}
          </Typography>
        </m.div>
      </Stack>

      {/* About Hakeemna Section */}
      <Stack spacing={3} sx={{ textAlign: 'center', mb: { xs: 4, md: 2 } }}>
        <m.div variants={varFade().inDown}>
          <Typography sx={{ fontSize: { xs: 32, md: 45 }, fontWeight: 600 }}>
            {t('about hakeemna')}
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
          Hakeemna platform is the result of joint cooperation between the health sector and
          specialists in developing the performance of institutions seeking to achieve efficiency in
          work. After studying the needs of medical institutions and users (patients and others) in
          the Arab world, a working team was formed to develop this platform. This team has full
          belief in the importance of developing electronic health services, especially the private
          sector in our Arab world, by raising the level of medical services and improving the
          efficiency of daily practices. For medical service providers, facilitating procedures for
          patients and keeping their medical information and documents securely and in one place.
          The platform is characterized by being comprehensive for all individuals and institutions,
          whether the user (medical service provider or patient) subscribes to the services of
          insurance companies or not, as you can benefit from the services provided to you
          independently and without association with any insurance or insurance management groups.
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
            {t('Hakeemna platform is the result of joint cooperation between the health sector...')}
          </Typography>
          <Stack direction="row" sx={{ mt: 2 }}>
            <Link sx={{ color: '#1F2C5C', fontSize: { xs: 14, md: 16 } }}>
              {t('Download Hakimna 360 app')}
            </Link>
          </Stack>
        </Stack>

        <Stack
          sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', mt: { xs: 4, md: 0 } }}
        >
          <img
            decoding="async"
            loading="lazy"
            alt="medical services"
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Devices-swe.png"
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
                  {t('who are we')}
                </Typography>
              </m.div>

              <Typography sx={{ fontSize: { xs: 14, md: 16 }, my: 2 }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat doloremque...
              </Typography>

              <Typography sx={{ fontWeight: 600, fontSize: { xs: 14, md: 16 }, color: '#3CB099' }}>
                {t('العنوان: عمان، شارع وصفي التل 153، عمان، الأردن')}
              </Typography>
            </Stack>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <img
                src="/"
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
