import * as React from 'react';
import { m } from 'framer-motion';

import { Box } from '@mui/system';
import { Container, Divider, Stack, Typography } from '@mui/material';


import Iconify from 'src/components/iconify';
import { useLocales, useTranslate } from 'src/locales';
import { MotionViewport, varFade } from 'src/components/animate';
import { USServices } from './servicesObjects';

export default function PatientsServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <>
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 8, md: 10 } }}>
        <m.div variants={varFade().inUp}>
          <Typography sx={{
            fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
            fontWeight: 700,
            fontSize: { xs: 35, md: 50 },
          }}>{t('WHAT WE DO')}</Typography>
        </m.div>
      </Container>
      <Box
        m={5}
        gap={{ xs: 2, lg: 4 }}
        display="grid"
        // alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        sx={{
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%', // Adjust this based on your layout
            transform: 'translateX(-50%)',
            width: '2px',
            height: '100%',
            backgroundColor: 'grey',
            zIndex: -1,
          }
        }}
      >
        {USServices.map((one) => (
          <Stack alignItems='center' justifyContent='flex-start'>
            <Stack width={600}>
              <Typography variant='h6' textAlign='center'>{curLangAr ? one.ar_title : one.title}</Typography>
              {one.items.map((item) => (
                <li>{curLangAr ? item.ar : item.en}</li>
              ))}
            </Stack>
          </Stack>
        ))}
      </Box>
    </>
  );
}
