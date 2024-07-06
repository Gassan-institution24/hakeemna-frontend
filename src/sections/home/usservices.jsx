import * as React from 'react';
import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Box, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import { USsServices } from './servicesObjects';

export default function USServices() {
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
      <Stack sx={{ alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ mx: { md: 10, xs: 2 }, textAlign: 'center' }}>
          {t(
            'These are medical bodies that face great challenges in the ability to provide better services and excellence in a sector that requires and is highly competitive, so this soft drink is required to move towards digital digital transformation in some cases because of what it requires to change and adapt to new technology.\nDigital intelligence requires that it cover all aspects of work in different institutions, and the obstacles that prevent the success of this important transition are varied.Therefore, with the help of God Almighty, the Hakimna platform was designed to take into account those obstacles (financial, tax, training, workability and compatibility with) (systems Different applications and market) to overcome those limitations in the diet of the diet community in one digital platform to provide modern and intelligent care to patients everywhere.'
          )}
        </Typography>
      </Stack>

      <Box
        m={{ xs: 3, md: 8 }}
        mb={10}
        columnGap={2}
        rowGap={{ xs: 4, md: 7 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {USsServices.map((one) => (
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

      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 10, md: 15 } }}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h2" sx={{ my: 3 }}>
            {t('Join us and Get the right offer for your unit of service')}
          </Typography>
        </m.div>
        <Button
          size="large"
          variant="outlined"
          endIcon={
            curLangAr ? (
              <Iconify icon="icon-park-outline:left" width={24} />
            ) : (
              <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
            )
          }
          sx={{ mx: 'auto', backgroundColor: 'success.main', color: 'white' }}
          href={paths.pages.UsPricing}
        >
          {t('Subscriptions')}
        </Button>
      </Container>
    </>
  );
}
