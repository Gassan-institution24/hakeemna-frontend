import PropTypes from 'prop-types';
import { m, useScroll } from 'framer-motion';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Stack, Container } from '@mui/system';

import Image from 'src/components/image';
import ScrollProgress from 'src/components/scroll-progress';
import { varFade, MotionViewport } from 'src/components/animate';

// import Whydoc from '../Why';
import Pupage from '../pupage';
import HomeHero from '../home-hero';
import Whowweare from '../whoarewe';
import Arrow from '../images/arrow.png';

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
        {/* <Whydoc /> */}
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(rgba(173, 216, 230, 0.115), #fdfdc644)',
          boxShadow: '0px -5px 10px rgba(173, 216, 230, 0.1)',
        }}
        id="services"
      >
        {/* <ServicesWeprovide /> */}
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
        <Container component={MotionViewport} sx={{ justifyContent: 'center' }}>
          <Stack spacing={3}>
            <m.div variants={varFade().inDown}>
              <Typography sx={{ textAlign: 'center', mb: 8 }} variant="h2">
                <span>
                  Start Now
                  <Image
                    sx={{
                      height: '110px',
                      width: '100px',
                      transform: 'rotate(-45deg)',
                      position: 'relative',
                      top: 20,
                      left: -15,
                      display:{md:'inline-flex',xs:'none'}
                    }}
                    src={Arrow}
                  />
                </span>
              </Typography>
            </m.div>
          </Stack> 
        </Container>

        <Pupage />
      </Box>
    </>
  );
}
HomeView.propTypes = {
  divRef: PropTypes.object,
  divRef2: PropTypes.object,
};
