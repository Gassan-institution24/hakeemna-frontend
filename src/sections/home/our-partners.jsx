import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid, Paper, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetActiveUnitservices } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

export default function OurPartners() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [page] = useState(0);

  const { unitservicesData } = useGetActiveUnitservices({
    select: 'name_english name_arabic company_logo',
    page,
    rowPerPage: 4,
  });
  const router = useRouter();

  const testdata = [
    {
      name_english: 'name_english',
      name_arabic: 'name_arabic',
      company_logo:
        'https://img.pikbest.com/png-images/20241019/doctor-logo-vector-icon-illustration_10974092.png!bw700',
    },
    {
      name_english: 'name_english',
      name_arabic: 'name_arabic',
      company_logo:
        'https://img.pikbest.com/png-images/20241019/doctor-logo-vector-icon-illustration_10974092.png!bw700',
    },
    {
      name_english: 'name_english',
      name_arabic: 'name_arabic',
      company_logo:
        'https://img.pikbest.com/png-images/20241019/doctor-logo-vector-icon-illustration_10974092.png!bw700',
    },
    {
      name_english: 'name_english',
      name_arabic: 'name_arabic',
      company_logo:
        'https://img.pikbest.com/png-images/20241019/doctor-logo-vector-icon-illustration_10974092.png!bw700',
    },
  ];
  return (
    <Box
      component={MotionViewport}
      sx={{
        position: 'relative',
        backgroundColor: '#F2FBF8',
        py: { xs: 10, md: 10 },
        transform: 'skewY(-3deg)',
        mt: '150px',
        mb: '150px',
      }}
    >
      <Container sx={{ transform: 'skewY(3deg)' }}>
        <Stack spacing={3} sx={{ textAlign: 'center', mb: 5 }}>
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{
                fontSize: 45,
                fontWeight: 600,
                fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              }}
            >
              {t('Our Partners')}
            </Typography>
          </m.div>
        </Stack>

        <Grid container spacing={5} justifyContent="center">
          {testdata?.map((partner, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              {' '}
              {/* Now 4 per row on medium screens */}
              <Paper
                elevation={3}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 2,
                  textAlign: 'center',
                  backgroundColor: 'white',
                  pb: 5,
                  position: 'relative',
                }}
              >
                {/* Partner Logo */}
                <Image
                  src={partner?.company_logo}
                  alt={partner?.name_english}
                  sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                />

                {/* Silhouette Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />

                {/* Text Box */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: alpha('#000', 0.6), // Dark background for better readability
                    backgroundImage:
                      'url(https://i.pinimg.com/474x/31/d0/f8/31d0f8208afa4a9b039791221e1216b1.jpg)', // Replace with your silhouette image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mixBlendMode: 'multiply', // Ensures a natural blend with the image
                    opacity: 0.5, // Adjust transparency as needed
                    color: 'white',
                    p: 1,
                    textAlign: 'center',
                    borderRadius: '0 0 10px 10px',
                    
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {curLangAr ? partner.name_arabic : partner.name_english}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <Button
            size="large"
            id="About"
            onClick={() => router.push(paths.pages.book)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '5px',
              bgcolor: 'transparent',
              padding: 0,
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                color: 'navy',
                fontWeight: 'bold',
                padding: '10px 16px',
                fontSize: '16px',
              }}
            >
              {t('Read more')}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'navy',
                padding: '10px 12px',
              }}
            >
              <ArrowForwardIosIcon sx={{ color: 'white', fontSize: '20px' }} />
            </div>
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
