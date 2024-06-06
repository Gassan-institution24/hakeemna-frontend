import * as React from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { PATH_FOR_US_SERVICES, PATH_FOR_PATIENT_SERVICES } from 'src/config-global';

import { varFade, MotionViewport } from 'src/components/animate';

import US from './images/us.png';
import Patient from './images/patients.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ServicesWeprovide() {
  const { t } = useTranslate();

  const renderDescription = (
    <Stack
      spacing={3}
      sx={{ textAlign: 'center', position: 'relative', top: '-50px' }}
      // id="services"
    >
      <m.div variants={varFade().inDown}>
        <Typography id="services" variant="h2">
          {t('We Provide you:')}
        </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ flexGrow: 1, position: 'relative', left: { xs: '10%', md: ' 12% ' }, mt: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={6}>
          <Item
            sx={{
              height: '300px',
              width: '300px',
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(119, 119, 119, 0), rgba(171, 255, 205, 0.394)), url(${Patient})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              p: 5,
              '&:hover': {
                backgroundImage: `linear-gradient(rgba(64, 64, 64, 0.486), rgba(64, 64, 64, 0.486)), url(${Patient})`,
              },
            }}
          >
            <Button
              target="_blank"
              rel="noopener"
              href={PATH_FOR_PATIENT_SERVICES}
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                position: 'relative',
                top: '123px',
                width: '100px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              {t('Read More')}
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item
            sx={{
              height: '300px',
              width: '300px',
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(119, 119, 119, 0), rgba(171, 255, 205, 0.394)), url(${US})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              p: 4,
              '&:hover': {
                backgroundImage: `linear-gradient(rgba(64, 64, 64, 0.486), rgba(64, 64, 64, 0.486)), url(${US})`,
              },
            }}
          >
            <Button
              target="_blank"
              rel="noopener"
              href={PATH_FOR_US_SERVICES}
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                position: 'relative',
                top: '130px',
                width: '100px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              {t('Read More')}
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 4, md: 10 },
        mt: 8,
        mb: { xs: 1, md: 0 },
      }}
    >
      {renderDescription}
      {renderContent}
    </Container>
  );
}
