import Box from '@mui/material/Box';

import { useGetActiveUnitservices } from 'src/api';

import Whydoc from '../aboutUs';
import OurMission from '../ourMission';
import HomeHero from '../hero/home-hero';
import OurPartners from '../our-partners';
// ----------------------------------------------------------------------

export default function HomeView() {
  const { unitservicesData } = useGetActiveUnitservices({ select: 'name_english name_arabic company_logo' })
  return (
    <>

      <HomeHero id="home" />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
        }}
      >
        <Whydoc />
      </Box>
      <OurMission />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
        }}
      >
        <OurPartners data={unitservicesData} />
      </Box>
    </>
  );
}
