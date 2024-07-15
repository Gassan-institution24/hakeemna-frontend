import * as React from 'react';
import { m } from 'framer-motion';

import { Box } from '@mui/system';
import { Stack, Container, Typography } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

import { patientsServices } from './servicesObjects';

export default function PatientsServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <>
      <Container
        component={MotionViewport}
        sx={{ textAlign: 'center', mb: { xs: 4, md: 8 }, mt: { xs: 8, md: 15 } }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 35, md: 50 },
            }}
          >
            {t('WHAT WE DO')}
          </Typography>
        </m.div>
      </Container>

      <Box
        mb={{ xs: 4, md: 15 }}
        mt={{ xs: 8, md: 15 }}
        // gap={{ xs: 3, lg: 0 }}
        columnGap={2}
        rowGap={{ xs: 4, md: 7 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {patientsServices.map((one) => (
          <Stack alignItems="center" justifyContent="flex-start">
            <Stack maxWidth={600}>
              <Typography variant="h6" textAlign="center" mb={2}>
                {curLangAr ? one.ar_title : one.title}
              </Typography>
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
