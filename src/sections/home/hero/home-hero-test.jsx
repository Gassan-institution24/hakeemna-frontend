import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import { Stack, Button, Typography } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';

import TestV from './test.mp4';

// ----------------------------------------------------------------------

export default function HomeHero() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);

  const texts = [
    'A Comprehensive Electronic Health System for Seamless Coordination Between Medical Service Providers (Doctors, Laboratories, Medical Centers, Radiology Clinics) and Society. Offering Digital Solutions for Personal Medical Record Management and Integrated Healthcare Institution Administration.',
    'It provides integrated services to patients in terms of storing data and medical information and managing them in a flexible manner, thus facilitating the mechanism of accessing information, medical history and other data at any time and in communicating with the medical staff in an efficient manner.',
    'It enables medical service providers to deal with patient records electronically and manage their institutions effectively and easily with the aim of raising productivity and improving performance, which leads to enriching the patient experience and paves the way for focusing on the most important matters in your work to raise the degree of excellence and increase competitiveness.',
  ];
  const title = ['Today', 'as beneficiaries', 'as unit of service'];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === texts.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [texts.length]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex2((prevIndex) => (prevIndex === title.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [title.length]);

  return (
    <Stack
      sx={{
        my: { xs: 5, md: 4 },
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        position: 'relative',
        minHeight: '75vh',
        bgcolor: '#F8F9FB',
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={TestV} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div />
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          height: 1,
          maxWidth: 600,
          zIndex: 1,
          position: 'relative',
          px: 3,
          ml: 5,
          mt: 5,
        }}
      >
        <m.div variants={varFade().in}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 35, md: 40 },
              display: 'inline-block', // Changed from inline to inline-block
              mb: 5,
            }}
            id="#"
          >
            {t('Start Your Digital Transformation Journey')}
            <br />

            <m.span
              key={currentIndex2}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{
                duration: 1.5, // Smoother transition by increasing duration
                ease: [0.43, 0.13, 0.23, 0.96], // Custom ease function for smooth easing
              }}
              style={{
                color: '#00A76F',
                fontWeight: 700,
                fontSize: 'inherit',
              }}
            >
              {t(title[currentIndex2])}
            </m.span>
          </Typography>
        </m.div>

        <m.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{
            duration: 1.5, // Smoother transition by increasing duration
            ease: [0.43, 0.13, 0.23, 0.96], // Custom ease function for smooth easing
          }}
        >
          <Typography
            variant="subtitle1"
            component="p"
            sx={{
              textAlign: 'center',
              textTransform: 'none',
              mb: 5,
            }}
          >
            {t(texts[currentIndex])}
          </Typography>
        </m.div>

        <Button color="primary" variant="contained">
          Start For free
        </Button>
      </Stack>
    </Stack>
  );
}
