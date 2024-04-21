import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCountdownDate } from 'src/hooks/use-countdown';

import { useTranslate } from 'src/locales';

import Logo from 'src/components/logo';
import Image from 'src/components/image';
// ----------------------------------------------------------------------

export default function MoreInfoAboutUs() {
  const { days, hours, minutes, seconds } = useCountdownDate(new Date('07/07/2024 21:30'));
  const { t } = useTranslate();

  return (
    <>
      <Typography variant="h3" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>
        {t('About us')}
      </Typography>

      <Typography sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
        {t(
          'The Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency in work and production that is compatible with the goals of sustainability and environmental preservation. After studying the needs of medical institutions and users (patients and others) in the Arab world, a working team was formed to develop this platform. This team has full belief in the importance of developing electronic health services, especially the private sector in our Arab world, by raising the level of medical services and improving the efficiency of daily practices. For medical service providers, facilitating procedures for patients and keeping their medical information and documents securely and in one place. The platform is characterized by being comprehensive for all individuals and institutions, whether the user (medical service provider or patient) subscribes to the services of insurance companies or not, as you can benefit from the services provided to you independently and without association with any insurance or insurance management groups.'
        )}
      </Typography>

      {/* <ComingSoonIllustration sx={{  }} /> */}
      <Image src={Logo} sx={{ my: 10, height: 240 }} />

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
