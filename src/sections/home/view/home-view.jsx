import Box from '@mui/material/Box';

import Whydoc from '../aboutUs';
import OurMission from '../ourMission';
import HomeHero from '../hero/home-hero';
import OurPartners from '../our-partners';
// ----------------------------------------------------------------------

export default function HomeView() {
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
        <OurPartners />
      </Box>
    </>
  );
}
