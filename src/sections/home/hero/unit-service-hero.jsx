import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';

import photo from '../images/design.png';

// ----------------------------------------------------------------------

export default function UnitServiceHero() {
  const { t } = useTranslate();

  return (
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
          {t('Service providers (medical institutions)')}
        </Typography>
      </m.div>
    </Stack>
  );
}
