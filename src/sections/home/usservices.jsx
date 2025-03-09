import * as React from 'react';
import { color, m } from 'framer-motion';

import { Box, Stack, Button, Container, Typography, Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

export default function USServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <>
      {/* Header Section */}
      <Container
        component={MotionViewport}
        sx={{ textAlign: 'center', mb: { xs: 4, md: 8 }, mt: { xs: 8, md: 15 } }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
              fontWeight: 700,
              fontSize: { xs: 25, md: 40 },
            }}
          >
            {t('What we offer')}
          </Typography>
        </m.div>
      </Container>

      {/* Services Section */}
      <Box sx={{ backgroundColor: '#3CB099', py: 6, px: 3, borderRadius: 2, mx: 20 }}>
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={3} sx={{color:"white"}}>
          {t('Patient Affairs')}
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={5}
        >
          <Card sx={{p:6, }} >
            <Typography>- {t('Managing medical records and appointments')}</Typography>
            <Typography>- {t('Insurance and financial transactions processing')}</Typography>
            <Typography>- {t('Prescription and medical reports issuance')}</Typography>
          </Card>
          <Card sx={{p:6, }} >
            <Typography>- {t('Patient admission and discharge procedures')}</Typography>
            <Typography>- {t('Integration with electronic health records')}</Typography>
            <Typography>- {t('Mobile health services and telemedicine')}</Typography>
          </Card>
          <Card sx={{p:6, }} >
            <Typography>- {t('Patient admission and discharge procedures')}</Typography>
            <Typography>- {t('Integration with electronic health records')}</Typography>
            <Typography>- {t('Mobile health services and telemedicine')}</Typography>
          </Card>
        </Box>
        <Typography variant="h6" textAlign="center" fontWeight={700} mt={3} sx={{color:"1F2C5C"}}>
          {t('Patient Affairs')}
        </Typography>

      </Box>

      {/* Administrative Affairs Section */}
      <Box sx={{ mt: 5, py: 6, px: 3, mx: 3 }}>
     

        {/* more services */}
        <Box
          component={MotionViewport}
          variants={varFade().inUp}
          sx={{
            position: 'relative',
            backgroundColor: '#4aa290',
            borderRadius: 3,
            maxWidth: 800,
            mx: 'auto',
            px: 4,
            py: 3,
            textAlign: 'center',
            color: 'white',
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              left: '15%',
              width: 12,
              height: 30,
              backgroundColor: 'white',
              borderRadius: '6px',
              border: 'green 1px solid',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              right: '15%',
              width: 12,
              height: 30,
              backgroundColor: 'white',
              borderRadius: '6px',
              border: 'green 1px solid',
            }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            مميزات أخرى
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            يقدم النظام العديد من المزايا التي تشمل تخفيض التكاليف لإدارة المؤسسة، وإمكانية استخدامه
            عبر الهاتف الذكي أو اللوح المحمول (Tablet) أو الكمبيوتر. يتميز النظام أيضاً بإجراء
            تعديلات (Customization) كبيرة للبيانات في المؤسسة، مما يجعله أكثر مرونة وفقًا
            لاحتياجاتها. يدعم أيضاً عدة طرق تواصل (رسائل نصية، إشعارات، البريد - إيميل)، إضافةً إلى
            إدارة جدولة وتنظيم المواعيد. يساعد النظام في إدارة البيانات بشكل متكامل مما يعزز
            المؤسسات من مواكبة تطورات السوق التكنولوجية الحديثة.
          </Typography>
        </Box>


        {/* Subscriptions */}
        <Container
          component={MotionViewport}
          sx={{ textAlign: 'center', mb: { xs: 4, md: 15 }, mt: { xs: 8, md: 15 } }}
        >
          <m.div variants={varFade().inUp}>
            <Typography variant="h3" sx={{ my: 3 }}>
              {t('Join now to get the best subscriptions for you')}
            </Typography>
          </m.div>
        
          <Button
            size="large"
            id="About"
            href={paths.pages.UsPricing}
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
                color: '#1F2C5C',
                fontWeight: 'bold',
                padding: '10px 16px',
                fontSize: '16px',
              }}
            >
              {t('Subscriptions')}
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
                <Iconify icon="icon-park-outline:left" width={24}  sx={{color:'white'}}/>
              ) : (
                <Iconify icon="eva:arrow-ios-forward-fill" width={24} sx={{color:'white'}} />
              )}
            </div>
          </Button>
        </Container>
      </Box>
    </>
  );
}
