import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';

import PatientsHero from './patients-hero';
import UnitServiceHero from './unit-service-hero';

// ----------------------------------------------------------------------

export default function HomeHero() {
  const xlUp = useResponsive('up', 'xl');
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (currentPage === 'home') setCurrentPage('users');
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  const renderDescription = (
    <>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          height: 1,
          maxWidth: 600,
          zIndex: 2,
          px: 3,
        }}
      >
        <m.div variants={varFade().in}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 35, md: 50 },
              // textShadow: '5px 5px 5px black',
              mb: 3,
            }}
            id="#"
          >
            {t('Electronic innovation for a healthier future')}
          </Typography>
        </m.div>

        <m.div variants={varFade().in}>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              textTransform: 'none',
            }}
          >
            <Typography
              component="h1"
              sx={{
                display: 'inline',
                fontSize: 'inherit', // Keeps the size consistent
                fontWeight: 'bold', // Optional: adds emphasis like an h1
              }}
            >
              {t('Hakeemna')} &nbsp;
            </Typography>
            {t(
              'is An integrated electronic system for organizing work between medical service providers (such as doctors, laboratories, a specialized medical center, a radiology center, and others) and all members of society. It also provides various services such as keeping personal medical records for individuals and integrated management of medical institutions.'
            )}
          </Typography>
        </m.div>

        <br />
      </Stack>
      {!mdUp && (
        <Stack direction="row" width={1}>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 0, width: '50%', py: 1.5 }}
            onClick={() => setCurrentPage('users')}
          >
            {t('beneficiary')}
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ borderRadius: 0, flex: 1, py: 1.5 }}
            onClick={() => setCurrentPage('doctors')}
          >
            {t('unit of serivce')}
          </Button>
        </Stack>
      )}
    </>
  );

  return (
    <Stack
      sx={{
        overflowX: 'hidden',
        height: '100vh',
      }}
    >
      {currentPage === 'home' && (
        <Stack justifyContent="center" alignItems="center" width={1} height={1}>
          {renderDescription}
        </Stack>
      )}
      <PatientsHero currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <UnitServiceHero currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {mdUp && (
        <>
          <div
            onClick={() =>
              currentPage === 'users' ? setCurrentPage('home') : setCurrentPage('users')
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setCurrentPage('users');
              }
            }}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              padding: 3,
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            <Iconify
              sx={{
                position: 'absolute',
                bottom: xlUp ? 300 : 200,
                right: curLangAr ? -40 : 300,
                rotate: '-45deg',
                animation: 'moveUpRight 1s infinite alternate',
                '@keyframes moveUpRight': {
                  '0%': {
                    transform: 'translate(0, 0)',
                  },
                  '100%': {
                    transform: 'translate(0px, 5px)',
                  },
                },
              }}
              icon="solar:double-alt-arrow-up-line-duotone"
              width={40}
            />
            <img src="/assets/images/home/hero/users.png" width={xlUp ? 300 : 200} alt="users" />
            <div style={{ position: 'absolute', top: -200, right: curLangAr ? 50 : 70 }}>
              <Typography
                variant={xlUp ? 'h4' : 'h5'}
                sx={{
                  fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
                }}
              >
                {t('beneficiary')}
              </Typography>
              <img
                src="/assets/images/home/hero/arrow.png"
                style={{ rotate: '10deg' }}
                width={xlUp ? 100 : 70}
                alt="arrow"
              />
            </div>
          </div>

          <div
            onClick={() =>
              currentPage === 'doctors' ? setCurrentPage('home') : setCurrentPage('doctors')
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setCurrentPage('doctors');
              }
            }}
            style={{
              position: 'absolute',
              cursor: 'pointer',
              left: 10,
              bottom: 10,
              padding: 3,
              zIndex: 2,
            }}
          >
            <img
              src="/assets/images/home/hero/doctors.png"
              width={xlUp ? 380 : 250}
              alt="doctors"
              style={{ transform: 'rotate(-1deg)' }}
            />
            <Iconify
              sx={{
                position: 'absolute',
                bottom: xlUp ? 260 : 200,
                left: curLangAr ? 0 : 350,
                rotate: '45deg',
                animation: 'moveUpRight 1s infinite alternate',
                '@keyframes moveUpRight': {
                  '0%': {
                    transform: 'translate(0, 0)',
                  },
                  '100%': {
                    transform: 'translate(0px, 5px)',
                  },
                },
              }}
              icon="solar:double-alt-arrow-up-line-duotone"
              width={40}
            />
            <div style={{ position: 'absolute', top: -100, right: 80 }}>
              <Typography
                variant={xlUp ? 'h4' : 'h5'}
                sx={{
                  position: 'absolute',
                  top: -80,
                  right: curLangAr ? 90 : -60,
                  fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
                }}
              >
                {t('unit of service')}
              </Typography>
              <img
                src="/assets/images/home/hero/arrow2.png"
                style={{ rotate: '-50deg' }}
                width={xlUp ? 200 : 150}
                alt="arrow"
              />
            </div>
          </div>
          <img
            src="/assets/images/home/hero/stethoscope.png"
            style={{ position: 'absolute', top: 60, right: '20%', rotate: '240deg', zIndex: 2 }}
            width={200}
            alt="stethoscope"
          />
        </>
      )}
    </Stack>
  );
}
