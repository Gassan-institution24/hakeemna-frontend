
import PropTypes from 'prop-types';
import { useScroll } from 'framer-motion';

import Box from '@mui/material/Box';

import ScrollProgress from 'src/components/scroll-progress';

import Us from '../uspage';
import Whydoc from '../Why';
import HomeHero from '../home-hero';
import Whowweare from '../whoarewe';
import Patient from '../patientpage';
import Servicesweprovide from '../servicesweprovide';
// ----------------------------------------------------------------------

export default function HomeView({ divRef, divRef2 }) {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero ref={divRef2} />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(rgba(173, 216, 230, 0.115), #ffffdc44)',
          boxShadow: '0px -5px 10px rgba(173, 216, 230, 0.115)',
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
          background: 'linear-gradient(rgba(173, 216, 230, 0.115), #fdfdc644)',
          boxShadow: '0px -5px 10px rgba(173, 216, 230, 0.1)',
        }}
      >
        <Servicesweprovide />
      </Box>
      <Box
        ref={divRef}
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
          p: 5,
        }}
      >
        <Patient />
        <Us />
      </Box>
    </>
  );
}
HomeView.propTypes = {
  divRef: PropTypes.element,
  divRef2: PropTypes.element,
};
