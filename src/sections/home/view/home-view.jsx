import Whydoc from '../aboutUs';
import OurMission from '../ourMission';
import OurPartners from '../our-partners';
import HomeHero from '../hero/home-hero-test';
// import OurPartners from '../our-partners';
// ----------------------------------------------------------------------

export default function HomeView() {
  return (
    <>
      <HomeHero id="home" />
      <OurMission />
      <Whydoc />
      {/* <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.paper',
        }}
      > */}
      {/* </Box> */}
      <OurPartners />
    </>
  );
}
