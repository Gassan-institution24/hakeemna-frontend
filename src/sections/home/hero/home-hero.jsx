import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import { Box, Stack, Button, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useLocales, useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';

import photo from '../images/photo_5916008964670211334_y.jpg';
import photo2 from '../images/photo_5916008964670211335_y.jpg';
import photo3 from '../images/photo_5916008964670211336_y.jpg';

export default function HomeHero() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);

  const title = [
    t('Electronic innovation for a healthier future'),
    t('beneficiary'),
    t('unit of service'),
  ];
  const texts = [
    t(
      'Hakimna 360 platform is an integrated electronic system for work between medical service providers (such as laboratories, laboratories, specialized medical center, center, etc.) and all members of the community, as well as providing various services such as keeping medical records and integrated medical management.'
    ),
    t(
      'Hakimna 360 platform provides integrated services to patients in terms of storing and managing medical data and information in a flexible manner, thus facilitating the mechanism of accessing information, medical history, and other data at any time and at any time, and communicating with the medical staff efficiently.'
    ),
    t(
      'Hakimna 360 platform enables medical service providers to deal with patient records electronically and manage their institutions effectively and easily with the aim of increasing productivity and improving performance, which leads to enriching the patient experience and paving the way for focusing on the most important matters in your work to raise the degree of excellence and increase competitiveness.'
    ),
  ];

  const backgroundImages = [photo, photo2, photo3];
  const buttonInfo = [
    null,
    { label: t('Learn More'), path: '/patients' },
    { label: t('Get Started'), path: '/units' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === texts.length - 1 ? 0 : prevIndex + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <Stack
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '85vh',
        width: '100%',
        color: 'white',
        px: 3,
        mb: '150px',
        position: 'relative',
        backgroundImage: `url(${backgroundImages[currentIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Content Markers */}
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          onClick={() => setCurrentIndex(index)}
          sx={{
            position: 'absolute',
            left: 20,
            top: `calc(40% + ${index * 30}px)`,
            width: 6,
            height: 26,
            bgcolor: currentIndex === index ? '#1F2C5C' : 'white',
            borderRadius: 2,
            transition: 'all 0.5s ease-in-out',
            cursor: 'pointer',
          }}
        />
      ))}

      <m.div variants={varFade().in}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
            fontWeight: 700,
            mb: 3,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {title[currentIndex]}
        </Typography>
      </m.div>

      <m.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <Typography variant="subtitle1" component="p" sx={{ maxWidth: 800, mb: 3 }}>
          {texts[currentIndex]}
        </Typography>

        {/* Conditional Button Rendering */}
        {buttonInfo[currentIndex] && (
          <Button
            size="large"
            href={buttonInfo[currentIndex].path}
            id="About"
            sx={{
              display: 'flex',
              alignItems: 'center',
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
                padding: '10px 8px',
                fontSize: '16px',
                borderRadius: '5px',
              }}
            >
              {t('Read sasasasmore')}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1F2C5C',
                padding: '10px 8px',
                borderEndEndRadius: '5px',
                borderStartEndRadius: '5px',
              }}
            >
              <ArrowForwardIosIcon sx={{ color: 'white', fontSize: '20px' }} />
            </div>
          </Button>
        )}
      </m.div>
    </Stack>
  );
}
