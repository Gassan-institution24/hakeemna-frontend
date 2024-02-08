import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import { useTranslate, useLocales } from 'src/locales';

import Image from 'src/components/image/image';
import Iconify from 'src/components/iconify';
import QR from './imges/QR.jpg';

export default function Share() {
  const [link, setLink] = useState(
    'لقد أعجبني تطبيق Doctorna.Online وأريد مشاركته معك https://doctorna-frontend.vercel.app/'
  );
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        enqueueSnackbar(`${curLangAr ? 'تم النسخ بنجاح' : 'Link copied successfully'}`, { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاولة لاحفا' : 'Something went wrong, please try again later'}`, { variant: 'error' });
      });
  };

  return (
    <Container
      sx={{
        position: 'relative',
        py: { xs: 0, md: 2 },
        maxWidth: '100%',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <div style={{ position: 'relative', paddingBottom: '56%', width: '100%' }}>
          <Image
            src={QR}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '80%',
              borderRadius: '10px',
              border: '1px solid #bba9bb4d',
            }}
          />
        </div>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {curLangAr ? 'قم بمشاركة الرابط' : 'Or copy this link'}
          
        </Typography>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            disabled
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '10px',
              boxSizing: 'border-box',
              borderRadius: 10,
              backgroundColor: '#eaeaea40',
              border: '2px solid #bba9bb4d',
              paddingRight: '40px',
              transition: 'background-color 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: '#d9d9d9',
              },
            }}
          />
          <Iconify
            icon="clarity:copy-line"
            onClick={copyToClipboard}
            sx={{
              position: 'absolute',
              top: '20px',
              right: '10px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                color: 'green',
                transform: 'scale(1.2)',
              },
            }}
          />
        </div>
      </Box>
    </Container>
  );
}
