import * as React from 'react';
import { m } from 'framer-motion';

import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Grid, Paper, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

import doctor from './images/doctor.png';

export default function Pupage() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1d222900' : 'rgba(255, 255, 255, 0)',
    ...theme.typography.body2,
    padding: theme.spacing(5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  const { t } = useTranslate();
  return (
    <Container component={MotionViewport} sx={{ display: { md: 'flex', xs: 'block' }, gap: 10 }}>
      <Grid sx={{ width: { md: '50%' }, position: 'relative' }}>
        <Grid item xs={12} md={6}>
          <Item
            sx={{
              textAlign: 'left',
              p: 1,
              fontSize: 18,
            }}
          >
            <h1 style={{ color: 'green' }}>{t('I am a health care provider')}</h1>
            <Typography sx={{ mb: 3, width: '70%' }}>
              {t(
                'This platform is designed so that all medical institutions can communicate directly and quickly with the aim of creating an integrated medical complex that enjoys good performance, high productivity and providing the best services to patients.'
              )}
            </Typography>

            <Button
              href={paths.auth.registersu}
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                width: '130px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              Signup
            </Button>
          </Item>
        </Grid>
      </Grid>
      <Grid sx={{ width: { md: '50%' }, position: 'relative' }}>
        <Grid item xs={12} md={6}>
          <Item
            sx={{
              textAlign: 'left',
              p: 1,
              fontSize: 18,
              zIndex: 999,
              position: 'relative',
            }}
          >
            <h1 style={{ color: 'green' }}> {t('I am a patient')} </h1>
            <Typography sx={{ mb: 2, width: '70%' }}>
              {t(
                'Hurry to register your data and your family members on the platform, which allows you to use all the platform’s services.'
              )}
            </Typography>
            <Button
              href={paths.auth.register}
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                width: '130px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              Signup
            </Button>
          </Item>

          <m.div variants={varFade().inUp}>
            <Image
              sx={{
                position: 'relative',
                top: {
                  md: '-30vh',
                  lg: '-24vh',
                  xl: '-19vh',
                },
                zIndex: 1,
                left: '-4vh',
                visibility: { md: 'visible', xs: 'hidden' },
              }}
              src={doctor}
            />
          </m.div>
        </Grid>{' '}
      </Grid>
    </Container>
  );
}
