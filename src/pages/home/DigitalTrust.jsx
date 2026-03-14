import { Helmet } from 'react-helmet-async';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { Box, Container, Typography, Button, Grid, Stack, Card } from '@mui/material';

import Iconify from 'src/components/iconify';
import { useTranslate } from 'src/locales';

import digital from '../../sections/home/images/digital.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function DigitalTrust() {
  const { t } = useTranslate();

  const services = [
    {
      icon: 'solar:clipboard-text-bold',
      title: t('digitalTrust.services.planning.title'),
      text: t('digitalTrust.services.planning.text'),
    },
    {
      icon: 'solar:pen-new-square-bold',
      title: t('digitalTrust.services.execution.title'),
      text: t('digitalTrust.services.execution.text'),
    },
    {
      icon: 'solar:chart-square-bold',
      title: t('digitalTrust.services.analysis.title'),
      text: t('digitalTrust.services.analysis.text'),
    },
  ];

  const why = [
    {
      icon: 'solar:eye-bold',
      text: t('digitalTrust.why.visibility'),
    },
    {
      icon: 'solar:heart-bold',
      text: t('digitalTrust.why.impact'),
    },
    {
      icon: 'solar:settings-bold',
      text: t('digitalTrust.why.management'),
    },
  ];

  const additional = [
    t('digitalTrust.additional.clinicBot'),
    t('digitalTrust.additional.appointments'),
    t('digitalTrust.additional.aiDiagnosis'),
    t('digitalTrust.additional.telemedicine'),
    t('digitalTrust.additional.blog'),
  ];

  return (
    <>
      <Helmet>
        <title>Digital Trust</title>
      </Helmet>

      <LazyMotion features={domAnimation}>
        {/* HERO */}

        <Box
          sx={{
            pt: { xs: 22, md: 22 },
            pb: { xs: 12, md: 14 },
            background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #ecfeff 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={5} textAlign="center" alignItems="center">
              <m.div initial="hidden" animate="show" variants={fadeUp}>
                <Box
                  sx={{
                    px: 3,
                    py: 0.7,
                    borderRadius: 20,
                    background: 'rgba(79,70,229,0.1)',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Trusted Digital Healthcare Solutions
                </Box>
              </m.div>
              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.2,
                  maxWidth: 900,
                }}
              >
                {t('digitalTrust.hero.title')}
              </Typography>

              {/* Description */}
              <Typography
                sx={{
                  fontSize: 18,
                  color: 'text.secondary',
                  maxWidth: 720,
                }}
              >
                {t('digitalTrust.hero.description')}
              </Typography>

              {/* CTA */}
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {t('digitalTrust.hero.consultation')}
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* SERVICES */}

        <Container sx={{ py: { xs: 10, md: 10 } }}>
          <Stack spacing={6}>
            <Typography variant="h3" fontWeight={800} textAlign="center">
              {t('digitalTrust.services.title')}
            </Typography>

            <Typography textAlign="center" color="text.secondary">
              {t('digitalTrust.services.description')}
            </Typography>

            <Grid container spacing={4}>
              {services.map((service) => (
                <Grid item xs={12} md={4} key={service.title}>
                  <m.div whileHover={{ y: -10 }}>
                    <Card
                      sx={{
                        p: 5,
                        borderRadius: 4,
                        height: '100%',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Iconify
                        icon={service.icon}
                        width={40}
                        sx={{ mb: 2, color: 'primary.main' }}
                      />

                      <Typography fontWeight={700} fontSize={20} mb={1}>
                        {service.title}
                      </Typography>

                      <Typography color="text.secondary">{service.text}</Typography>
                    </Card>
                  </m.div>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>

        {/* HAKIMNA */}

        <Container sx={{ py: { xs: 12, md: 10 } }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <m.div initial="hidden" whileInView="show" variants={fadeUp}>
                <Typography variant="h3" fontWeight={800} mb={3}>
                  {t('digitalTrust.integration.title')}
                </Typography>

                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('digitalTrust.integration.description')}
                </Typography>
              </m.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <m.img
                src={digital}
                style={{
                  width: '100%',
                  borderRadius: 18,
                  boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* WHY TRUST US */}

        <Box sx={{ background: '#f8fafc', py: { xs: 10, md: 10 } }}>
          <Container>
            <Stack spacing={6}>
              <Typography variant="h3" fontWeight={800} textAlign="center">
                {t('digitalTrust.why.title')}
              </Typography>

              <Grid container spacing={4}>
                {why.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ p: 5, borderRadius: 4 }}>
                      <Stack spacing={2}>
                        <Iconify icon={item.icon} width={36} sx={{ color: 'primary.main' }} />

                        <Typography>{item.text}</Typography>
                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>

        {/* ADDITIONAL SERVICES */}

        <Container sx={{ py: { xs: 12, md: 10 } }}>
          <Stack spacing={3}>
            <Typography variant="h3" fontWeight={800}>
              {t('digitalTrust.additional.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              {t('digitalTrust.additional.website')}
            </Typography>

            {/* <Grid container spacing={3}> */}
            {additional.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      minWidth: 26,
                      display: 'flex',
                      alignItems: 'flex-start',
                      mt: '3px',
                    }}
                  >
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={24}
                      sx={{
                        color: 'success.main',
                        flexShrink: 0,
                      }}
                    />
                  </Box>

                  <Typography color="text.secondary">{item}</Typography>
                </Stack>
              </Grid>
            ))}
            {/* </Grid> */}
          </Stack>
        </Container>

        {/* CTA */}

        <Box
          sx={{
            py: { xs: 12, md: 16 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="md">
            <Card
              sx={{
                p: { xs: 5, md: 8 },
                borderRadius: 5,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: 'white',
                position: 'relative',
                boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
              }}
            >
              <Stack spacing={4} alignItems="center">
                <Typography variant="h3" fontWeight={800}>
                  {t('hakeemna360')}
                </Typography>

                {/* Features */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={4}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:graph-up-bold" width={20} />
                    <Typography variant="body2">Stronger Online Presence</Typography>
                  </Stack>

                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:users-group-rounded-bold" width={20} />
                    <Typography variant="body2">Reach More Patients</Typography>
                  </Stack>

                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:target-bold" width={20} />
                    <Typography variant="body2">Better Visibility on Google</Typography>
                  </Stack>
                </Stack>

                {/* CTA */}
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    background: 'white',
                    color: '#111',
                    px: 5,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': {
                      background: '#f3f4f6',
                    },
                  }}
                >
                  {t('digitalTrust.hero.consultation')}
                </Button>
              </Stack>
            </Card>
          </Container>
        </Box>
      </LazyMotion>
    </>
  );
}
