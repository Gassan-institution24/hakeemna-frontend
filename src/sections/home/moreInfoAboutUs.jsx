import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCountdownDate } from 'src/hooks/use-countdown';

import { useTranslate } from 'src/locales';
import { ComingSoonIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function MoreInfoAboutUs() {
  const { days, hours, minutes, seconds } = useCountdownDate(new Date('07/07/2024 21:30'));
  const { t } = useTranslate();

  return (
    <>
      <Typography variant="h3" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>
        {t('Coming Soon!')}
      </Typography>

      <Typography sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
        {t('We are currently working hard on this page!')}
      </Typography>

      <ComingSoonIllustration sx={{ my: 10, height: 240 }} />

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: 'h2' }}
      >
        <TimeBlock label={t('Days')} value={days} />

        <TimeBlock label={t('Hours')} value={hours} />

        <TimeBlock label={t('Minutes')} value={minutes} />

        <TimeBlock label={t('Seconds')} value={seconds} />
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

function TimeBlock({ label, value }) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};
