import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Grid, Paper, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetActiveUnitservices } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

export default function OurPartners() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { unitservicesData } = useGetActiveUnitservices({
    select: 'name_english name_arabic company_logo',
    rowPerPage: 4,
  });
  const router = useRouter();

  return (
    <Box
      component={MotionViewport}
      sx={{
        position: 'relative',
        backgroundColor: '#e4f6f2',
        py: { xs: 6, md: 6 },
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
              {t('our partners')}
            </Typography>
          </m.div>
        </Stack>

        <Grid container spacing={5} justifyContent="center">
          {unitservicesData.map((partner, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 3, // More rounded corners
                  textAlign: 'center',
                  backgroundColor: 'white',
                  position: 'relative',
                }}
              >
                {/* Partner Image */}
                <Image
                  src={partner.company_logo}
                  alt={partner.name_english}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                  }}
                />

                {/* Green Overlay at the Bottom */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '80px',
                    backgroundColor: '#2EA98D', // Green color
                    clipPath: 'ellipse(100% 50% at center bottom)', // Curved bottom shape
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: 'white', fontSize: 18, pt: 5 }}
                  >
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
              '&:hover': {
                bgcolor: 'inherit',
              },
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                color: '#1F2C5C',
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
                backgroundColor: '#1F2C5C',
                padding: '10px 12px',
              }}
            >
              {curLangAr ? (
                <Iconify icon="icon-park-outline:left" width={24} sx={{ color: 'white' }} />
              ) : (
                <Iconify icon="eva:arrow-ios-forward-fill" width={24} sx={{ color: 'white' }} />
              )}
            </div>
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
