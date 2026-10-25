import PropTypes from 'prop-types';

import { alpha } from '@mui/material/styles';
import { Box, Card, Grid, Stack, Container, Typography, CardActionArea } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// Two doors into the same platform. The Dental card shows the dental brand colour as
// a hint of where it leads; this page itself keeps the existing theme.
const DENTAL_COLOR = '#0E9F96';

export default function ExperienceChooser() {
  const { t } = useTranslate();

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
        {t('Choose your practice')}
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={5}>
          <ChoiceCard
            href={paths.medicine.root}
            icon="icon-park-outline:medicine-chest"
            title={t('General Medicine')}
            description={t('Hospitals, clinics and medical labs')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <ChoiceCard
            href={paths.dental.root}
            icon="mdi:tooth-outline"
            title={t('Dental')}
            description={t('Dental clinics and dentists')}
            color={DENTAL_COLOR}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

function ChoiceCard({ href, icon, title, description, color }) {
  return (
    <Card sx={{ height: 1, ...(color && { borderTop: `4px solid ${color}` }) }}>
      <CardActionArea component={RouterLink} href={href} sx={{ p: 3, height: 1 }}>
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              flexShrink: 0,
              display: 'flex',
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
              color: color || 'primary.main',
              bgcolor: (theme) => alpha(color || theme.palette.primary.main, 0.12),
            }}
          >
            <Iconify icon={icon} width={36} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ color: color || 'text.primary' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

ChoiceCard.propTypes = {
  color: PropTypes.string,
  description: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
};
