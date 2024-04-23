import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
import { Button, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import One from './images/1.jpg';
import Two from './images/2.jpg';
import Four from './images/4.jpg';
import Three from './images/3.jpg';
import Person from './images/person.png';
// ----------------------------------------------------------------------

export default function MoreInfoAboutUs() {
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#EFEFEF',
        p: 5,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          bgcolor: '#00C4CC',
          p: { md: 3, xs: 1 },
          width: { md: '20%', xs: '90%' },
          position: 'relative',
          top: { md: 45, xs: 20 },
          borderRadius: 0.7,
        }}
      >
        {t('About hakeemna')}
      </Typography>

      <Box
        sx={{
          bgcolor: '#fff',
          display: 'grid',
          gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            ml: 7,
            display: { md: 'block', xs: 'none' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              top: 100,
            }}
          >
            <Image sx={{ m: 2, width: 300, height: 200, borderBottomRightRadius: 5 }} src={One} />

            <Image sx={{ m: 2, width: 300, height: 200, borderBottomLeftRadius: 5 }} src={Two} />

            <Image sx={{ m: 2, width: 300, height: 200, borderTopRightRadius: 5 }} src={Four} />

            <Image sx={{ m: 2, width: 300, height: 200, borderTopLeftRadius: 5 }} src={Three} />
          </Box>
          <Typography sx={{ position: 'relative', top: 100, left: 20 }}>
            {t('The most important parts of our story')}
          </Typography>
        </Box>

        {/* /////////////////////////////////// */}
        <Box sx={{ p: { md: 0, xs: 3 } }}>
          <Typography
            sx={{
              width: { md: '85%', xs: '100%' },
              mt: 10,
            }}
          >
            {t(
              'After studying the needs of medical institutions and users (patients and others) in the Arab world, a working team was formed to develop this platform. This team has full belief in the importance of developing electronic health services, especially the private sector in our Arab world, by raising the level of medical services and improving the efficiency of daily practices. For medical service providers, facilitating procedures for patients and keeping their medical information and documents securely and in one place.'
            )}
          </Typography>
          <Typography sx={{ mt: 2, width: { md: '85%', xs: '100%' } }}>
            {t(
              'The platform is characterized by being comprehensive for all individuals and institutions, whether the user (medical service provider or patient) subscribes to the services of insurance companies or not, as you can benefit from the services provided to you independently and without association with any insurance or insurance management groups.'
            )}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Box
              sx={{
                position: 'relative',
                top: 200,
                left: 10,
                display: { md: 'block', xs: 'none' },
              }}
            >
              <Iconify
                icon="el:idea"
                width={35}
                sx={{
                  '&:hover': {
                    color: '#FBC02D',
                  },
                }}
              />
              <Button
                sx={{
                  position: 'relative',
                  top: 10,
                  left: 20,
                  bgcolor: '#FFDC5D',
                  width: 250,
                  p: 3,
                  borderTopLeftRadius: 20,
                }}
                onClick={() => alert('coming soon')}
              >
                {t('meet Our Teem')}
              </Button>
            </Box>

            <Image
              src={Person}
              sx={{
                width: '150px',
                height: '450px',
                position: 'relative',
                top: 115,
                left: 340,
                display: { md: 'block', xs: 'none' },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
