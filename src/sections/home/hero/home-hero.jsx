import { m } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';

import { Box, Stack, Button, Typography } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varFade } from 'src/components/animate';

import photo from '../images/photo_5916008964670211334_y.jpg';
import photo2 from '../images/photo_5916008964670211335_y.jpg';
import photo3 from '../images/photo_5916008964670211336_y.jpg';

// Lazy load images

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
      'Hakimna is An integrated electronic system for organizing work between medical service providers (such as doctors, laboratories, a specialized medical center, a radiology center, and others) and all members of society. It also provides various services such as keeping personal medical records for individuals and integrated management of medical institutions.'
    ),
    t(
      'Hakimna provides patients with flexible storage and management of medical data and information, facilitating access to information, medical history, and data collaboration at any time and at any time, and communicating efficiently with medical heroes.'
    ),
    t(
      'Hakeemna 360 platform enables healthcare providers to manage patient records electronically and manage their organizations efficiently and easily, paving the way for focusing on the most important things in your business, enhancing excellence and competitiveness. The platform meets the needs of medical institutions, clinics, laboratories, specialized medical centers, radiology centers, and others.'
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
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{title[currentIndex]}</title>
        <meta name="description" content={texts[currentIndex]} />
        <meta
          name="keywords"
          content="healthcare, electronic health records, medical platform, digital health"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title[currentIndex]} />
        <meta property="og:description" content={texts[currentIndex]} />
        <meta property="og:image" content={backgroundImages[currentIndex]} />
        <meta property="og:url" content="https://hakeemna.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalOrganization',
            name: 'Hakimna',
            url: 'https://hakeemna.com',
            description: texts[currentIndex],
            image: backgroundImages[currentIndex],
          })}
        </script>
      </Helmet>

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
            variant="h1"
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
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'transparent',
                padding: 0,
                overflow: 'hidden',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'inherit' },
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
                {t('Read more')}
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
                {curLangAr ? (
                  <Iconify icon="icon-park-outline:left" width={24} sx={{ color: 'white' }} />
                ) : (
                  <Iconify icon="eva:arrow-ios-forward-fill" width={24} sx={{ color: 'white' }} />
                )}
              </div>
            </Button>
          )}
        </m.div>
      </Stack>
    </>
  );
}
