import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';


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
        height: '35vh',
        width: '100%',
        color: 'white',
        px: 3,
        mt: '130px',
        mb: '150px',
        position: 'relative',
        backgroundImage: `linear-gradient(to right, rgba(112, 216, 192, 0.7), rgba(60, 176, 153, 0.7))`,
        borderBottomLeftRadius: '60px',
        borderBottomRightRadius: '60px',
      }}
    >
      <m.div variants={varFade().inDown}>
        <Typography color="white" variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '24px', md: '32px' } }}>
          {t('Service providers (medical institutions)')}
        </Typography>
      </m.div>
    </Stack>
  );
}
