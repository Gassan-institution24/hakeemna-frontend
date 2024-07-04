import Box from '@mui/material/Box';
import { Stack } from '@mui/system';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import PatientsHero from '../hero/patients-hero';
import PatientsServices from '../patientservices';
// ----------------------------------------------------------------------

export default function HomeView() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Stack
        sx={{
          overflowX: 'hidden',
          height: '91vh',
        }}
      >
        <PatientsHero currentPage="users" />
        {mdUp && (
          <img
            src="/assets/images/home/hero/stethoscope.png"
            style={{ position: 'absolute', top: 90, right: '20%', rotate: '240deg', zIndex: 2 }}
            width={200}
            alt="stethoscope"
          />
        )}
      </Stack>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
        }}
      >
        <PatientsServices />
      </Box>
      {/* <OurMission /> */}
    </>
  );
}
