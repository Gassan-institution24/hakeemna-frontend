import { useScroll } from 'framer-motion';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ScrollProgress from 'src/components/scroll-progress';
import HomeHero from '../home-hero';
import Whowweare from '../whoarewe';
import Servicesweprovide from '../servicesweprovide'
import Whydoc from '../Why';
import Patient from '../patientpage';
import Us from '../uspage';
import HomeHugePackElements from '../home-hugepack-elements';
import HomeAdvertisement from '../home-advertisement';
import HomePricing from '../home-pricing';
import HomeDarkMode from '../home-dark-mode';
import HomeLookingFor from '../home-looking-for';
import HomeForDesigner from '../home-for-designer';

// ----------------------------------------------------------------------

const StyledPolygon = styled('div')(({ anchor = 'top', theme }) => ({
  left: 0,
  zIndex: 9,
  height: 80,
  width: '100%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  backgroundColor: theme.palette.background.default,
  display: 'block',
  lineHeight: 0,
  ...(anchor === 'top' && {
    top: -1,
    transform: 'scale(-1, -1)',
  }),
  ...(anchor === 'bottom' && {
    bottom: -1,
    backgroundColor: theme.palette.grey[900],
  }),
}));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      > 
      <Whowweare />
        {/*

        <HomeHugePackElements /> 

        <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box> 

        <HomeDarkMode /> */}
 
        <Whydoc />
        <Servicesweprovide />
      
        <Patient />
        <Us />

        {/* <HomePricing /> */}
      </Box>
    </>
  );
}
