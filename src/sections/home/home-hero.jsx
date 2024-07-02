import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';
import { Divider, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function HomeHero() {
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState('home')
  // const switchToPatient = useBoolean();

  const renderDescription = (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        height: 1,
        maxWidth: 480,
        zIndex: 100,
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
            // textShadow: '5px 5px 5px black',
            mb: 3,
          }}
          id="#"
          lang="en"
        >
          {t('It is time for digital transformation')}
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            //  textShadow: '5px 5px 5px black'
          }}
        >
          {t(
            'An integrated electronic platform for organizing work between medical service providers (such as doctors, laboratories, a specialized medical center, a radiology center, and others) and all members of society. It also provides various services such as keeping individuals’ personal medical records (PHR), and integrated management of medical institutions.'
          )}
        </Typography>
      </m.div>

      <br />
    </Stack>
  );

  return (
    <Stack sx={{
      overflowX: 'hidden',
      height: '100vh'
    }}>
      {currentPage === 'home' && <Stack justifyContent='center' alignItems='center' width={1} height={1}>
        {renderDescription}
      </Stack>}
      <Stack
        justifyContent='center'
        alignItems='center'
        width={1}
        height={1}
        sx={{
          position: 'absolute',
          bottom: 0,
          ...(curLangAr ? { left: 0 } : { right: 0 }),
          borderRadius: currentPage === 'users' ? 0 : '50% 0 0 0',
          width: currentPage === 'users' ? '100%' : 0,
          height: currentPage === 'users' ? '100%' : 0,
          transition: 'all 0.5s ease-in-out',
          zIndex: 1,
          backgroundColor: '#d5f7e6',
          overflow: 'hidden',
        }}>
        {renderDescription}
      </Stack>
      <Stack
        justifyContent='center'
        alignItems='center'
        width={1}
        height={1}
        sx={{
          position: 'absolute',
          bottom: 0,
          ...(curLangAr ? { right: 0 } : { left: 0 }),
          borderRadius: currentPage === 'doctors' ? 0 : '0 50% 0 0',
          width: currentPage === 'doctors' ? '100%' : 0,
          height: currentPage === 'doctors' ? '100%' : 0,
          transition: 'all 0.5s ease-in-out',
          zIndex: 1,
          backgroundColor: '#95d5f9',
          overflow: 'hidden'
        }}>
        {renderDescription}
      </Stack>
      <div
        onClick={() => currentPage === 'users' ? setCurrentPage('home') : setCurrentPage('users')}
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
          zIndex: 2
        }}
      >
        <Iconify sx={{
          position: 'absolute', bottom: 300, right: curLangAr ? -40 : 300,
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
          icon='solar:double-alt-arrow-up-line-duotone' width={40} />
        <img src='/assets/images/home/hero/users.png' width={300} alt='user' />
        <div style={{ position: 'absolute', top: -200, right: curLangAr ? 50 : 70 }}>
          <Typography variant='h4' sx={{ fontFamily: curLangAr ? "Beiruti, sans-serif" : "Playwrite US Modern, cursive" }}>{t('beneficiary')}</Typography>
          <img src='/assets/images/home/hero/arrow.png' style={{ rotate: '10deg' }} width={100} alt='doctors' />
        </div>
      </div>

      <div
        onClick={() => currentPage === 'doctors' ? setCurrentPage('home') : setCurrentPage('doctors')}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            setCurrentPage('doctors');
          }
        }}
        style={{
          position: 'absolute',
          cursor: 'pointer', left: 10,
          bottom: 10,
          padding: 3,
          zIndex: 2
        }}
      >
        <img src='/assets/images/home/hero/doctors.png' width={350} alt='doctors' />
        <Iconify sx={{
          position: 'absolute', bottom: 260, left: curLangAr ? 0 : 350,
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
          icon='solar:double-alt-arrow-up-line-duotone' width={40} />
        <div style={{ position: 'absolute', top: -100, right: 80 }}>
          <Typography variant='h4' sx={{ position: 'absolute', top: -80, right: curLangAr ? 90 : -60, fontFamily: curLangAr ? "Beiruti, sans-serif" : "Playwrite US Modern, cursive" }}>{t('unit of service')}</Typography>
          <img src='/assets/images/home/hero/arrow2.png' style={{ rotate: '-50deg' }} width={200} alt='doctors' />
        </div>
      </div>
      <Divider />
    </Stack>
  );
}
