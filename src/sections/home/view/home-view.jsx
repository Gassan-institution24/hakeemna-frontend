import { useScroll } from 'framer-motion';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import ScrollProgress from 'src/components/scroll-progress';
import HomeHero from '../home-hero';
import Whowweare from '../whoarewe';
import Servicesweprovide from '../servicesweprovide';
import Whydoc from '../Why';
import Patient from '../patientpage';
import Us from '../uspage';
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
          // bgcolor: 'success.light',
        }}
      >
        <Whowweare />
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Whydoc />
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          // bgcolor: 'rgba(102, 255, 102, 0.861)',
        }}
      >
        <Servicesweprovide />
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Patient />
        <Us />
      </Box>
    </>
  );
}
