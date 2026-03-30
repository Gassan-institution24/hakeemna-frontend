import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet-async';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  Card,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';

import { useGetCountries } from 'src/api';
import axiosInstance, { endpoints } from 'src/utils/axios';
import PhoneWithCountry from 'src/components/hook-form/phoneNumber';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

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
  const [openDialog, setOpenDialog] = useState(false);
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  const [form, setForm] = useState({
    name: '',
    email: '',
    number: '',
    Body: '',
    country: '',
  });
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);
  const { enqueueSnackbar } = useSnackbar();
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
    { icon: 'solar:eye-bold', text: t('digitalTrust.why.visibility') },
    { icon: 'solar:heart-bold', text: t('digitalTrust.why.impact') },
    { icon: 'solar:settings-bold', text: t('digitalTrust.why.management') },
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
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{t('Request Consultation')}</DialogTitle>

        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label={t('Name/Clinic Name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label={t('email')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <PhoneWithCountry
              countries={countriesData}
              value={{ number: form.number, country: form.country }}
              label={`${t('Phone Number')} (${t('optional')})`}
              onChange={(val) =>
                setForm({
                  ...form,
                  number: val.number,
                  country: val.country,
                })
              }
            />

            <TextField
              label={t('Message')}
              value={form.Body}
              onChange={(e) => setForm({ ...form, Body: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                // validation
                if (!form.name.trim() || !form.email.trim()) {
                  enqueueSnackbar(t('Name and Email are required'), {
                    variant: 'warning',
                  });
                  return;
                }

                await axiosInstance.post(endpoints.userContact.all, form);

                enqueueSnackbar(
                  t('Your request has been sent successfully. We will contact you soon.'),
                  { variant: 'success' }
                );
                handleClose();

                // reset form
                setForm({
                  name: '',
                  email: '',
                  number: '',
                  Body: '',
                  country: '',
                });
              } catch (e) {
                enqueueSnackbar(t('Something went wrong'), {
                  variant: 'error',
                });
                console.log(e);
              }
            }}
          >
            {t('send')}
          </Button>
        </DialogActions>
      </Dialog>

      <Helmet>
        <title>Digital Marketing</title>
      </Helmet>

      <LazyMotion features={domAnimation}>
        {/* HERO */}
        <Box
          sx={{
            pt: { xs: 22, md: 22 },
            pb: { xs: 12, md: 14 },
            background: 'linear-gradient(rgba(60, 176, 153, 0.7), rgba(112, 216, 192, 0.24))',
            position: 'relative',
            overflow: 'hidden',
            borderBottomLeftRadius: '60px',
            borderBottomRightRadius: '60px',
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={5} textAlign="center" alignItems="center">
              <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.2, maxWidth: 900 }}>
                {t('digitalTrust.hero.title')}
              </Typography>

              <Typography sx={{ fontSize: 18, color: 'text.secondary', maxWidth: 720 }}>
                {t('digitalTrust.hero.description')}
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleOpen}
                sx={{
                  px: 6,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: '0 8px 20px rgba(60,176,153,0.4)',
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
                        boxShadow: '0 10px 30px rgba(60,176,153,0.15)',
                        border: '1px solid rgba(60,176,153,0.15)',
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
                  boxShadow: '0 25px 60px rgba(60,176,153,0.25)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* WHY TRUST US */}
        <Box
          sx={{
            background: 'linear-gradient(rgba(60,176,153,0.08), rgba(112,216,192,0.08))',
            py: { xs: 10, md: 10 },
          }}
        >
          <Container>
            <Stack spacing={6}>
              <Typography variant="h3" fontWeight={800} textAlign="center">
                {t('digitalTrust.why.title')}
              </Typography>

              <Grid container spacing={4}>
                {why.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card
                      sx={{
                        p: 5,
                        borderRadius: 4,
                        border: '1px solid rgba(60,176,153,0.15)',
                        boxShadow: '0 10px 25px rgba(60,176,153,0.1)',
                      }}
                    >
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

            {additional.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ minWidth: 26, mt: '3px' }}>
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={24}
                      sx={{ color: 'primary.main' }}
                    />
                  </Box>

                  <Typography color="text.secondary">{item}</Typography>
                </Stack>
              </Grid>
            ))}
          </Stack>
        </Container>

        {/* CTA */}
        <Box sx={{ py: { xs: 12, md: 16 } }}>
          <Container maxWidth="md">
            <Card
              sx={{
                p: { xs: 5, md: 8 },
                borderRadius: 5,
                textAlign: 'center',
                background: 'linear-gradient(rgba(60, 176, 153, 0.9), rgba(112, 216, 192, 0.6))',
                color: 'white',
                boxShadow: '0 30px 80px rgba(60,176,153,0.3)',
              }}
            >
              <Stack spacing={4} alignItems="center">
                <Typography variant="h3" fontWeight={800}>
                  {t('hakeemna360')}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:graph-up-bold" width={20} />
                    <Typography variant="body2">{t('Stronger Online Presence')}</Typography>
                  </Stack>

                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:users-group-rounded-bold" width={20} />
                    <Typography variant="body2">{t('Reach More Patients')}</Typography>
                  </Stack>

                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:target-bold" width={20} />
                    <Typography variant="body2">{t('Better Visibility on Google')}</Typography>
                  </Stack>
                </Stack>

                <Button
                  size="large"
                  variant="contained"
                  onClick={handleOpen}
                  sx={{
                    background: '#ffffff',
                    color: 'primary.main',
                    px: 5,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 700,
                    '&:hover': {
                      background: '#f0fdfc',
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
