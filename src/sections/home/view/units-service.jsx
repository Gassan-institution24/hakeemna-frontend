import Box from '@mui/material/Box';
import { Stack } from '@mui/system';

// import { useResponsive } from 'src/hooks/use-responsive';

import USServices from '../usservices';
import UnitServiceHero from '../hero/unit-service-hero';
// ----------------------------------------------------------------------

export default function HomeView() {
  // const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Stack
        sx={{
          overflowX: 'hidden',
          height: '90vh',
        }}
      >
        <UnitServiceHero currentPage="doctors" />
        {/* {mdUp && (
          <img decoding="async" loading='lazy'
            src="/assets/images/home/hero/stethoscope.webp"
            style={{ position: 'absolute', top: 60, right: '20%', rotate: '240deg', zIndex: 2 }}
            width={200}
            alt="stethoscope"
          />
        )} */}
      </Stack>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
        }}
      >
        <USServices />
      </Box>
      {/* <OurMission /> */}
    </>
  );
}
