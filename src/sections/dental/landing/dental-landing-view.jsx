import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Grid, Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// Public face of Hakeemna 360 Dental. The features listed are the dental modules that
// already exist in the platform — nothing here promises a screen that is not built.
const FEATURES = [
  {
    icon: 'mdi:tooth-outline',
    title: 'Interactive odontogram',
    description: 'Chart every tooth and surface — findings, restorations, bridges, adult and child charts.',
  },
  {
    icon: 'mdi:chart-bell-curve-cumulative',
    title: 'Periodontal charting',
    description: 'Six-site probing depths, recession, bleeding and mobility, exam by exam.',
  },
  {
    icon: 'mdi:radiology-box-outline',
    title: 'X-rays and DICOM',
    description: 'Attach before and after radiographs, including DICOM, right on the chart.',
  },
  {
    icon: 'mdi:clipboard-text-clock-outline',
    title: 'Treatment plans',
    description: 'Plan procedures per visit from your clinic’s own service catalogue and prices.',
  },
  {
    icon: 'fluent-mdl2:date-time-mirrored',
    title: 'Appointments and waiting room',
    description: 'Booking, reminders, today’s chair list and the waiting room in one place.',
  },
  {
    icon: 'fa6-solid:file-invoice-dollar',
    title: 'Billing and insurance claims',
    description: 'The same accounting, invoicing and insurance claims as the whole Hakeemna platform.',
  },
];

export default function DentalLandingView() {
  const theme = useTheme();
  const { t } = useTranslate();
  const { authenticated } = useAuthContext();

  // Reuse the one login flow; it brings the user straight back into the dental dashboard.
  const enterHref = authenticated
    ? paths.dental.dashboard
    : `${paths.auth.login}?returnTo=${encodeURIComponent(paths.dental.dashboard)}`;

  return (
    <>
      <Box
        sx={{
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 12 },
          background: `linear-gradient(160deg, ${alpha(theme.palette.primary.lighter, 0.9)} 0%, ${
            theme.palette.background.default
          } 70%)`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Iconify
          icon="mdi:tooth"
          width={420}
          sx={{
            position: 'absolute',
            insetInlineEnd: { xs: -160, md: -60 },
            top: { xs: 60, md: 80 },
            color: 'primary.main',
            opacity: 0.08,
          }}
        />
        <Container sx={{ position: 'relative' }}>
          <Stack spacing={3} sx={{ maxWidth: 640 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'primary.dark' }}>
              <Iconify icon="mdi:tooth-outline" width={28} />
              <Typography variant="overline" sx={{ fontSize: 14 }}>
                {t('Hakeemna 360 Dental')}
              </Typography>
            </Stack>

            <Typography variant="h2" sx={{ color: 'primary.darker' }}>
              {t('The complete platform for dental clinics')}
            </Typography>

            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              {t(
                'Charting, treatment plans, appointments, billing and insurance — built for dentists, on the same trusted Hakeemna 360 platform.'
              )}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                component={RouterLink}
                href={enterHref}
                size="large"
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="material-symbols:login" />}
              >
                {authenticated ? t('Open dental dashboard') : t('Login')}
              </Button>
              <Button
                component={RouterLink}
                href={paths.auth.registersu}
                size="large"
                variant="outlined"
                color="secondary"
                startIcon={<Iconify icon="mdi:register" />}
              >
                {t('join as unit of service')}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>
          {t('Everything your dental clinic needs')}
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
          {t('One record per patient, shared with the rest of Hakeemna 360.')}
        </Typography>

        <Grid container spacing={3}>
          {FEATURES.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>

        <Card
          sx={{
            mt: 8,
            p: { xs: 3, md: 5 },
            textAlign: 'center',
            color: 'common.white',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            {t('Looking for General Medicine?')}
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 3 }}>
            {t('Hakeemna 360 also serves hospitals, clinics and medical labs.')}
          </Typography>
          <Button
            component={RouterLink}
            href={paths.medicine.root}
            variant="contained"
            color="inherit"
            sx={{ color: 'primary.dark' }}
          >
            {t('General Medicine')}
          </Button>
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function FeatureCard({ icon, title, description }) {
  const { t } = useTranslate();

  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Box
        sx={{
          mb: 2,
          width: 56,
          height: 56,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <Iconify icon={icon} width={30} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {t(title)}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t(description)}
      </Typography>
    </Card>
  );
}

FeatureCard.propTypes = {
  description: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
};
