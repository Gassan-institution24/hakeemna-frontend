import { m, useScroll } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from 'src/layouts/config-layout';
import { useLocales, useTranslate } from 'src/locales';
import { bgBlur, bgGradient, textGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { varFade, MotionContainer } from 'src/components/animate';
import { useBoolean } from 'src/hooks/use-boolean';

import Tall from './images/Tall.png';
import Tall2 from './images/Tall2.png';
import Preview from './images/Preview.png';
import Preview2 from './images/Preview2.png';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha('#000', theme.palette.mode === 'light' ? 0.1 : 0.94),
    imgUrl: '/assets/background/bgHakeemna.jpg',
  }),
  width: '100%',
  height: '100vh',
  position: 'relative',
  color: 'white',
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    position: 'fixed',
  },
}));
const StyledWrapper = styled('div')(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',

}));

const StyledTextGradient = styled(m.h1)(({ theme, curLangAr }) => ({
  // ...textGradient(
  // `300deg, ${theme.palette.info.main} 0%, ${theme.palette.success.main} 25%, ${theme.palette.warning.main} 50%, ${theme.palette.success.main} 75%, ${theme.palette.info.main} 100%`
  // `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  // ),
  padding: 0,
  marginTop: 2,
  lineHeight: 1,
  fontWeight: 800,
  marginBottom: 24,
  letterSpacing: curLangAr ? 0 : 4,
  // textAlign: 'center',
  // backgroundSize: '400%',
  fontSize: `50px`,
  textTransform: 'uppercase',
  fontFamily: theme.typography.fontSecondaryFamily,
  [theme.breakpoints.up('md')]: {
    fontSize: `50px`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  top: -80,
  width: 480,
  right: -80,
  height: 480,
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  position: 'absolute',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledPolygon = styled('div')(({ opacity = 1, anchor = 'left', theme }) => ({
  ...bgBlur({
    opacity,
    color: theme.palette.background.default,
  }),
  zIndex: 9,
  bottom: 0,
  height: 80,
  width: '50%',
  position: 'absolute',
  clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
  ...(anchor === 'left' && {
    left: 0,
    ...(theme.direction === 'rtl' && {
      transform: 'scale(-1, 1)',
    }),
  }),
  ...(anchor === 'right' && {
    right: 0,
    transform: 'scaleX(-1)',
    ...(theme.direction === 'rtl' && {
      transform: 'scaleX(1)',
    }),
  }),
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const theme = useTheme();

  const heroRef = useRef(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);
  const switchToPatient = useBoolean()

  const lightMode = theme.palette.mode === 'light';

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 200) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const transition = {
    repeatType: 'loop',
    ease: 'linear',
    duration: 20 * 4,
    repeat: Infinity,
  };

  const opacity = 1 - percent / 100;

  const hide = percent > 120;

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        mx: 'auto',
        maxWidth: 480,
        opacity: opacity > 0 ? opacity : 0,
        // mt: {
        //   md: `-${HEADER.H_DESKTOP + percent * 2.5}px`,
        // },
      }}
    >
      <m.div variants={varFade().in}>
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontFamily: theme.typography.fontSecondaryFamily,
            fontWeight: 700,
            fontSize: 60,
            textShadow: '5px 5px 5px black',
            mb: 3
          }}
          id="#"
          lang='en'
        >
          {t('It is time for digital transformation')}
        </Typography>
      </m.div>

      {/* <m.div variants={varFade().in}> */}
      {/* <StyledTextGradient
        // animate={{ backgroundPosition: '200% center' }}
        curLangAr={curLangAr}
      // transition={{
      //   repeatType: 'reverse',
      //   ease: 'linear',
      //   duration: 20,
      //   repeat: Infinity,
      // }}
      >
        {t('Hakeemna Medical Platform')}
      </StyledTextGradient> */}
      {/* </m.div> */}

      <m.div variants={varFade().in}>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', textShadow: '5px 5px 5px black', }}>
          {t(
            'An integrated electronic platform for organizing work between medical service providers (such as doctors, laboratories, a specialized medical center, a radiology center, and others) and all members of society. It also provides various services such as keeping individuals’ personal medical records (PHR), and integrated management of medical institutions.'
          )}
        </Typography>
      </m.div>

      <br />

      {/* <m.div variants={varFade().in}>
        <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ mb: 5 }}>
          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="eva:external-link-fill" width={24} />}
            rel="noopener"
            href={paths.auth.register}
            sx={{ borderColor: 'text.primary' }}
          >
            {t('Get Started')}
          </Button>
        </Stack>
      </m.div> */}

      {/* <Stack spacing={3} sx={{ textAlign: 'center' }}>
        <m.div variants={varFade().in}>
          <Iconify icon="noto:hospital" width={30} sx={{ m: 0.5 }} />
          <Iconify icon="solar:health-broken" color="green" width={30} sx={{ m: 0.5 }} />
          <Iconify icon="ri:mental-health-line" color="lightblue" width={30} sx={{ m: 0.5 }} />
          <Iconify icon="pajamas:status-health" color="red" width={30} sx={{ m: 0.5 }} />
          <Iconify icon="icon-park:medicine-bottle" width={30} sx={{ m: 0.5 }} />
        </m.div>
      </Stack> */}
    </Stack>
  );
  const renderSlides = (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        height: '150%',
        position: 'absolute',
        opacity: opacity > 0 ? opacity : 0,
        transform: `skew(${-16 - percent / 24}deg, ${4 - percent / 16}deg)`,
        ...(theme.direction === 'rtl' && {
          transform: `skew(${16 + percent / 24}deg, ${4 + percent / 16}deg)`,
        }),
      }}
    >
      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{
          width: 444,
          position: 'relative',
        }}
      >
        <Box
          component={m.img}
          animate={{ y: ['0%', '100%'] }}
          transition={transition}
          alt={lightMode ? 'light_1' : 'dark_1'}
          src={Preview}
          sx={{ position: 'absolute', mt: 1 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['-100%', '0%'] }}
          transition={transition}
          alt={lightMode ? 'light_1' : 'dark_1'}
          src={Preview2}
          sx={{ position: 'absolute' }}
        />
      </Stack>

      <Stack
        component={m.div}
        variants={varFade().in}
        sx={{ width: 720, position: 'relative', ml: -5 }}
      >
        <Box
          component={m.img}
          animate={{ y: ['100%', '0%'] }}
          transition={transition}
          alt={lightMode ? 'light_2' : 'dark_2'}
          src={Tall}
          sx={{ position: 'absolute', mt: 0 }}
        />
        <Box
          component={m.img}
          animate={{ y: ['0%', '-100%'] }}
          transition={transition}
          alt={lightMode ? 'light_2' : 'dark_2'}
          src={Tall2}
          sx={{ position: 'absolute' }}
        />
      </Stack>
    </Stack>
  );

  const renderPolygons = (
    <>
      <StyledPolygon />
      <StyledPolygon anchor="right" opacity={0.48} />
      <StyledPolygon anchor="right" opacity={0.48} sx={{ height: 48, zIndex: 10 }} />
      <StyledPolygon anchor="right" sx={{ zIndex: 11, height: 24 }} />
    </>
  );

  const renderEllipses = (
    <>
      {mdUp && <StyledEllipseTop />}
      <StyledEllipseBottom />
    </>
  );

  return (
    <>
      <StyledRoot
        ref={heroRef}
      // sx={{
      //   ...(hide && {
      //     opacity: 0,
      //   }),
      // }}
      >
        <StyledWrapper>
          {/* <Container component={MotionContainer} sx={{ height: 1 }}> */}
          <Stack direction='row' sx={{ height: 1, width: '180vw', transition: 'all 2s ease', ...(switchToPatient.value ? { transform: curLangAr ? 'translate3d(80vw, 0, 0)' : 'translate3d(-80vw, 0, 0)' } : '') }} >
            <Box sx={{
              width: '80vw', overflow: 'hidden',
              backgroundImage: `url(/assets/background/bgHakeemna.jpg)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(0, 0, 0, 0.300)',
              backgroundBlendMode: 'darken',
            }} >
              {renderDescription}
            </Box>

            {mdUp && <Box sx={{ width: '20vw', overflow: 'hidden', transition: 'all 2s ease' }} onClick={switchToPatient.onToggle}>
              <Stack justifyContent='center' alignItems='center' sx={{ backgroundColor: '#ceaba8', height: '100vh' }} >
                <Typography variant='h6'>
                  Normal user
                </Typography>

              </Stack>
            </Box>}
            <Box sx={{
              width: '80vw',
              overflow: 'hidden',
              backgroundImage: `url(/assets/background/bgHakeemna.jpg)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: 'rgba(0, 0, 0, 0.300)',
              backgroundBlendMode: 'darken',
            }} >
              {renderDescription}

            </Box>
          </Stack>
          {/* </Container> */}

          {/* {renderEllipses} */}
        </StyledWrapper>
      </StyledRoot >

      {/* {mdUp && renderPolygons} */}

      < Box sx={{ height: { md: '100vh' } }
      } />
    </>
  );
}
