import Box from '@mui/material/Box';
import { Stack } from '@mui/system';

import { useResponsive } from 'src/hooks/use-responsive';

import PatientsHero from '../hero/patients-hero';
import PatientsServices from '../patientservices';
// ----------------------------------------------------------------------

export default function HomeView() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Stack
        sx={{
          overflowX: 'hidden',
          minHeight: '90vh',
          backgroundColor: { md: '#d5f7e6' },
          pt: 5,
        }}
      >
        <PatientsHero currentPage="users" />
        {mdUp && (
          <img
            src="/assets/images/home/hero/stethoscope.png"
            style={{ position: 'absolute', top: 60, right: '20%', rotate: '240deg', zIndex: 2 }}
            width={200}
            alt="stethoscope"
          />
        )}
      </Stack>
      <Box
        sx={{
          p: 2,
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
