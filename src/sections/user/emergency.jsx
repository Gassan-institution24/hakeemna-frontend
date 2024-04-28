import React from 'react';

import { Box, Button, Container, Typography } from '@mui/material';

import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';

import Emergencypic from '../../components/logo/doc.png';

export default function Emergency() {
  // const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <Container
      sx={{
        py: { xs: 0, md: 2 },
        maxWidth: '100%',
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            mb: { md: 4, xl: 10, xs: 6 },
            mt: { md: 0, xs: 2 },
            fontSize: { md: 20, xs: 14 },
          }}
        >
          {curLangAr
            ? 'يمكننا من خلال طبيبنا تقديم الاستشارة الكترونيا من خلال التواصل معك لتغطية استشارتك في مجال الطب العام والأطفال.'
            : 'Through our doctor, we can provide advice electronically by contacting you to cover you consultation in the field of general medicine and children.'}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ position: 'relative', top: '-20px' }}>
        {curLangAr ? 'احجز موعد طارئ' : 'The types of emergency we provide'}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          height: '60%',
          width: '60%',
          display: 'grid',
          borderRadius: 2,
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <Box
          sx={{
            width: '110%',
            borderRight: '10px #4E6892 solid',
            borderRadius: '2% 50%  50% 2%',
            bgcolor: '#FBFEFB',
            zIndex: 1,
            display: { md: 'flex', xs: 'none' },
          }}
        >
          <Image
            src={Emergencypic}
            sx={{
              width: '70%',
              height: '70%',
              mt: '16%',
              ml: '15%',
              display: { md: 'flex', xs: 'none' },
            }}
          />

          <Box
            style={{
              border: '3px solid #4E6892',
              borderRadius: '100%',
              width: '7%',
              height: '13%',
              backgroundColor: 'white',
              position: 'absolute',
              left: curLangAr ? '51%' : '42%',
              top: '5%',
              textAlign: 'center',
            }}
          >
            <Iconify width="65%" sx={{ mt: '15%', color: '#4E6892' }} icon="carbon:person" />
          </Box>
          <Box
            sx={{
              border: '3px solid #4E6892',
              borderRadius: '100%',
              width: '7%',
              height: '13%',
              backgroundColor: 'white',
              position: 'absolute',
              left: curLangAr ? '51%' : '51%',
              top: '40%',
              textAlign: 'center',
            }}
          >
            <Iconify width="65%" sx={{ mt: '15%', color: '#4E6892' }} icon="guidance:card" />
          </Box>
          <Box
            style={{
              border: '3px solid #4E6892',
              borderRadius: '100%',
              width: '7%',
              height: '13%',
              backgroundColor: 'white',
              position: 'absolute',
              left: curLangAr ? '50.5%' : '42%',
              top: '80%',
              textAlign: 'center',
            }}
          >
            <Iconify
              width="65%"
              sx={{ mt: '15%', color: '#4E6892' }}
              icon="fluent:location-28-regular"
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: { md: '#128CA9', xs: 'none' },
            width: { xl: '143%', lg: '143%', md: '170%', xs: '143%' },
            position: 'relative',
            left: '-43%',
            borderRight: '#128CA9',
            borderRadius: '0% 2%  2% 0%',
          }}
        >
          <Button
            sx={{
              border: '3px solid #4E6892',
              bgcolor: 'white',
              color: '#4E6892',
              position: 'absolute',
              width: { xl: '40%', lg: '60%', md: '55%', xs: '200%' },
              top: { xl: '8%', lg: '7%', md: '6%', xs: '0%' },
              left: { xl: '30%', lg: '30%', md: '27%', xs: '28%' },
              '&:hover': {
                border: '3px solid green',
                bgcolor: 'rgba(255, 255, 255, 0.829)',
                color: 'green',
              },
            }}
          >
            <Iconify
              width="8%"
              sx={{
                color: '#4E6892',
                display: { md: 'none', xs: 'flex' },
                position: 'relative',
                left: '-3%',
              }}
              icon="carbon:person"
            />
            {curLangAr ? 'استشارة مدفوعة من المستخدم' : 'Private consultation covered by patient'}
          </Button>
          <Button
            sx={{
              border: '3px solid #4E6892',
              bgcolor: 'white',
              color: '#4E6892',
              position: 'absolute',
              width: { xl: '40%', lg: '52%', md: '55%', xs: '200%' },
              top: { xl: '43%', lg: '43%', md: '41%', xs: '20%' },
              left: { xl: '43%', lg: '43%', md: '37.5%', xs: '28%' },
              '&:hover': {
                border: '3px solid green',
                bgcolor: 'rgba(255, 255, 255, 0.829)',
                color: 'green',
              },
            }}
          >
            <Iconify
              width="8%"
              sx={{
                color: '#4E6892',
                display: { md: 'none', xs: 'flex' },
                position: 'relative',
                left: '-8%',
              }}
              icon="guidance:card"
            />{' '}
            {curLangAr ? 'استشارة مدفوعة من شركة تأمين' : 'Consultation covered by insurance'}
          </Button>
          <Button
            sx={{
              border: '3px solid #4E6892',
              bgcolor: 'white',
              color: '#4E6892',
              position: 'absolute',
              width: { xl: '40%', lg: '60%', md: '55%', xs: '200%' },
              top: { xl: '84%', lg: '83%', md: '81%', xs: '40%' },
              left: { xl: '30%', lg: '30%', md: '27%', xs: '28%' },
              '&:hover': {
                border: '3px solid green',
                bgcolor: 'rgba(255, 255, 255, 0.829)',
                color: 'green',
              },
            }}
          >
            <Iconify
              width="8%"
              sx={{
                color: '#4E6892',
                display: { md: 'none', xs: 'flex' },
                position: 'relative',
                left: '-15%',
              }}
              icon="fluent:location-28-regular"
            />{' '}
            {curLangAr ? 'عيادات بالقرب مني' : 'Medical emergency near me'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
