import { m, useScroll } from 'framer-motion';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Stack, Container } from '@mui/system';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import ScrollProgress from 'src/components/scroll-progress';
import { varFade, MotionViewport } from 'src/components/animate';

import Pupage from '../pupage';
import Whydoc from '../aboutUs';
import HomeHero from '../home-hero';
import OurMission from '../ourMission';
import Arrow from '../images/arrow.png';
import ArrowAr from '../images/arrowAr.png';
import ServicesWeprovide from '../servicesweprovide';
// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero id="home" />
      {/* <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(rgba(173, 216, 230, 0.115), #ffffdc44)',
          boxShadow: '0px -5px 10px rgba(173, 216, 230, 0.115)',
          }}
          > */}
          <Box
            sx={{
              overflow: 'hidden',
              position: 'relative',
              bgcolor: 'background.default',
            }}
          >
        <OurMission />
      {/* </Box> */}
        <Whydoc />
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
        <ServicesWeprovide />
      </Box>
      <Box
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
                  {t('Start Now')}
                  {curLangAr ? (
                    <Image
                      sx={{
                        height: '200px',
                        width: '200px',
                        transform: 'rotate(45deg)',
                        position: 'relative',
                        top: 60,
                        left: -60,
                        display: { md: 'inline-flex', xs: 'none' },
                      }}
                      src={ArrowAr}
                    />
                  ) : (
                    <Image
                      sx={{
                        height: '110px',
                        width: '100px',
                        transform: 'rotate(-45deg)',
                        position: 'relative',
                        top: 20,
                        left: -15,
                        display: { md: 'inline-flex', xs: 'none' },
                      }}
                      src={Arrow}
                    />
                  )}
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
