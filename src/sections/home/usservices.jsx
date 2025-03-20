import * as React from 'react';
import { m } from 'framer-motion';

import { Box, Card, Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

import img1 from './Group 115.png';
import img2 from './Rectangle 474.png';
import img3 from './istockphoto-1429880967-640x640 1.png';

export default function USServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: '#e4f6f2',
          mb: 25,
          py: 10,
          px: { xs: 2, md: 40 },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
            sx={{ width: { xs: '100%', md: '50%' } }}
          >
            <Image
              sx={{ width: '100%', p: '4px', display: { xs: 'none', md: 'block' } }}
              src={img1}
            />
            <Image
              sx={{ width: '100%', p: '4px', display: { xs: 'none', md: 'block' } }}
              src={img2}
            />
          </Box>
          <Image
            sx={{
              width: { xs: '100%', md: '74%' },
              p: '4px',
              display: { xs: 'none', md: 'block' },
            }}
            src={img3}
          />
        </Stack>
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          {t(
            'These are medical bodies that face great challenges in the ability to provide better services and excellence in a sector that requires and is highly competitive, so this soft drink is required to move towards digital digital transformation in some cases because of what it requires to change and adapt to new technology.'
          )}
          {t(
            'Digital intelligence requires that it cover all aspects of work in different institutions, and the obstacles that prevent the success of this important transition are varied.Therefore, with the help of God Almighty, the Hakeemna platform was designed to take into account those obstacles (financial, tax, training, workability and compatibility with) (systems Different applications and market) to overcome those limitations in the diet of the diet community in one digital platform to provide modern and intelligent care to patients everywhere.'
          )}
        </Typography>
      </Box>

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
      <Box
        sx={{
          backgroundColor: '#3CB099',
          py: 6,
          px: 3,
          borderRadius: 2,
          mx: { xs: 2, md: 30 },
          mb: 25,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={3} sx={{ color: 'white' }}>
          {t('Patient Affairs')}
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={10}
        >
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }}>
              {t('Managing old paper patient files and storing them in electronic records.')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              {t('Managing patient records and files electronically.')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              {t(
                'Improving the mechanism of access to your medical information and patient files and the ability to access the rest of the data and medical history.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }}>
              {t('Support better decision making in patient care.')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              {t('Managing and organizing public relations electronically.')}
            </Typography>
            <Typography sx={{ p: 2 }}>{t('Organizing patient relations and affairs.')}</Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }}>
              {t(
                'Increasing patient and visitor satisfaction with the services provided and reducing waiting time in the clinic and other medical institutions.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }}>
              {t('Making financial budgets for patients and managing premiums.')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              {t('Contributing to reducing medical errors related to medication conflicts.')}
            </Typography>
          </Card>
        </Box>
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight={700}
          sx={{ color: '1F2C5C', position: 'relative', top: 30 }}
        >
          {t('some services under development')}
        </Typography>
      </Box>

      {/* Services Section */}
      <Box
        sx={{
          backgroundColor: '#e4f6f2',
          mb: 25,
          py: 4,
          px: { xs: 2, md: 22 },
          alignItems: 'center',
          justifyContent: 'center',
        }}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        <Stack spacing={3}>
          <Typography variant="h3">{t('Managing medical records')}</Typography>
          <Typography variant="h5">- {t('Managing medical records and appointments')}</Typography>
          <Typography variant="h5">
            - {t('Insurance and financial transactions processing')}
          </Typography>
          <Typography variant="h5">- {t('Prescription and medical reports issuance')}</Typography>
          <Typography variant="h5">- {t('Patient admission and discharge procedures')}</Typography>
          <Typography variant="h5">- {t('Integration with electronic health records')}</Typography>
        </Stack>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'row' }}>
          <Image
            src="https://cdn.pixabay.com/photo/2016/11/19/11/11/hands-1838658_1280.jpg"
            sx={{ borderRadius: '5px', width: '70%', position: 'relative' }}
          />
          <Image
            src="https://cdn.pixabay.com/photo/2016/11/19/11/11/hands-1838658_1280.jpg"
            sx={{
              borderRadius: '5px',
              width: '70%',
              position: 'relative',
              top: '20px',
              right: '100px',
            }}
          />
        </Box>
      </Box>

      {/* Services3 Section */}
      <Box
        sx={{
          backgroundColor: '#3CB099',
          py: 6,
          px: 3,
          borderRadius: 2,
          mx: { xs: 2, md: 30 },
          mb: 25,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={700} mb={3} sx={{ color: 'white' }}>
          {t('Patient Affairs')}
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          gap={10}
        >
          <Card sx={{ p: 1 }}>
            <Typography sx={{ p: 2 }}>
              - {t('Managing medical records and appointments')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              - {t('Insurance and financial transactions processing')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              - {t('Prescription and medical reports issuance')}
            </Typography>
          </Card>
          <Card sx={{ p: 1 }}>
            <Typography sx={{ p: 2 }}>
              - {t('Patient admission and discharge procedures')}
            </Typography>
            <Typography sx={{ p: 2 }}>
              - {t('Integration with electronic health records')}
            </Typography>
            <Typography sx={{ p: 2 }}>- {t('Mobile health services and telemedicine')}</Typography>
          </Card>
        </Box>
      </Box>
      {/*  */}
      <Box
        sx={{
          backgroundColor: '#e4f6f2',
          mb: 25,
          py: 4,
          px: { xs: 2, md: 22 },
          alignItems: 'center',
          justifyContent: 'center',
        }}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        <Stack spacing={3}>
          <Typography variant="h3">{t('Managing medical records')}</Typography>
          <Typography variant="h5">- {t('Managing medical records and appointments')}</Typography>
          <Typography variant="h5">
            - {t('Insurance and financial transactions processing')}
          </Typography>
          <Typography variant="h5">- {t('Prescription and medical reports issuance')}</Typography>
          <Typography variant="h5">- {t('Patient admission and discharge procedures')}</Typography>
          <Typography variant="h5">- {t('Integration with electronic health records')}</Typography>
        </Stack>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Image
            src="https://cdn.pixabay.com/photo/2016/11/19/11/11/hands-1838658_1280.jpg"
            sx={{ borderRadius: '5px', width: '70%', position: 'relative' }}
          />
        </Box>
      </Box>

      {/* more services */}
      <Box
        component={MotionViewport}
        variants={varFade().inUp}
        sx={{
          position: 'relative',
          backgroundColor: '#4aa290',
          borderRadius: 3,
          mx: { xs: 2, md: 30 },
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
          عبر الهاتف الذكي أو اللوح المحمول (Tablet) أو الكمبيوتر. يتميز النظام أيضاً بإجراء تعديلات
          (Customization) كبيرة للبيانات في المؤسسة، مما يجعله أكثر مرونة وفقًا لاحتياجاتها. يدعم
          أيضاً عدة طرق تواصل (رسائل نصية، إشعارات، البريد - إيميل)، إضافةً إلى إدارة جدولة وتنظيم
          المواعيد. يساعد النظام في إدارة البيانات بشكل متكامل مما يعزز المؤسسات من مواكبة تطورات
          السوق التكنولوجية الحديثة.
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
              <Iconify icon="icon-park-outline:left" width={24} sx={{ color: 'white' }} />
            ) : (
              <Iconify icon="eva:arrow-ios-forward-fill" width={24} sx={{ color: 'white' }} />
            )}
          </div>
        </Button>
      </Container>
    </>
  );
}
