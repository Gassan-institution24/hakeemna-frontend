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
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Managing old paper patient files and storing them in electronic records.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Managing patient records and files electronically.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Improving the mechanism of access to your medical information and patient files and the ability to access the rest of the data and medical history.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Support better decision making in patient care.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Managing and organizing public relations electronically.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              - {t('Organizing patient relations and affairs.')}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Increasing patient and visitor satisfaction with the services provided and reducing waiting time in the clinic and other medical institutions.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Making financial budgets for patients and managing premiums.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Contributing to reducing medical errors related to medication conflicts.')}
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
          px: { xs: 2, md: 20 },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        <Stack spacing={3}>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Routine and bureaucratic administrative affairs')}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Managing the daily work of medical institutions with the aim of improving performance and raising efficiency.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            - {t('Preparing medical reports and prescriptions electronically.')}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Freedom from repetitive procedures(bureaucratic routine) and reducing the excessive use of paper documents and files in accordance with sustainability plans.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            - {t('Communicate with patients and suppliers electronically.')}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Managing appointments for patients, and the ability to book appointments in hospitals participating in our platform to reserve the operating room or any other department.'
            )}
          </Typography>
          <Typography variant="subtitle1">- {t('Marketing campaigns.')}</Typography>
          <Typography variant="subtitle1">- {t('Electronic signature and payment.')}</Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Storing the medical institution’s data and files in the cloud and protecting its independence and confidentiality.'
            )}
          </Typography>
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
          {t('Regulatory affairs')}
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
          gap={10}
        >
          <Card sx={{ p: 1 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Managing departments and activities.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('The ability to manage each department and each work team independently.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              - {t('Department of Human Ressources.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Manage the agenda independently for everyone who works in the medical institution.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'The possibility for the visiting doctor or consultant to book an appointment electronically at an independent medical institution(such as a hospital) to perform an operation, for example, and to send the patient’s information electronically.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 1 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Manage and book appointments electronically, independently for each employee(such as a doctor) and for each work team.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Organizing relationships and business with other medical institutions(such as hospitals/ medical laboratories, etc.).'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'The ability to make modifications to match and adapt to the needs of each client(such as Medical Checklist, instructions, and reports).'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Continuous employee training and development according to the needs of each organization.'
              )}
            </Typography>
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
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Financial and tax affairs')}
          </Typography>
          <Typography variant="subtitle1">
            - {t('Managing financial affairs and the fund.')}
          </Typography>
          <Typography variant="subtitle1">- {t('Managing annual tax affairs.')}</Typography>
          <Typography variant="subtitle1">- {t('Preparing annual tax return reports.')}</Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t('Managing financial deductions from the Doctors Syndicate, income tax, and others.')}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Organizing financial claims with medical institutions such as hospitals and insurance companies.'
            )}
          </Typography>
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
          {t('Other features')}
        </Typography>
        {curLangAr ? (
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            يقدم النظام العديد من المزايا التي تشمل تخفيض التكاليف لإدارة المؤسسة، وإمكانية استخدامه
            عبر الهاتف الذكي أو اللوح المحمول (Tablet) أو الكمبيوتر. يتميز النظام أيضاً بإجراء
            تعديلات (Customization) كبيرة للبيانات في المؤسسة، مما يجعله أكثر مرونة وفقًا
            لاحتياجاتها. يدعم أيضاً عدة طرق تواصل (رسائل نصية، إشعارات، البريد - إيميل)، إضافةً إلى
            إدارة جدولة وتنظيم المواعيد. يساعد النظام في إدارة البيانات بشكل متكامل مما يعزز
            المؤسسات من مواكبة تطورات السوق التكنولوجية الحديثة.
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            The system offers numerous advantages, including reduced costs for managing the
            organization and the ability to use it via smartphone, tablet, or computer. The system
            also allows for extensive customization of the organizations data, making it more
            flexible to suit its needs. It also supports multiple communication methods (text
            messages, notifications, email), in addition to managing and organizing appointments.
            The system helps manage data in an integrated manner, enabling organizations to keep
            pace with developments in the modern technological market.
          </Typography>
        )}
      </Box>
      {/* Subscriptions */}
      <Container
        component={MotionViewport}
        sx={{ textAlign: 'center', mb: { xs: 4, md: 15 }, mt: { xs: 8, md: 15 } }}
      >
        <m.div variants={varFade().inUp}>
          <Typography variant="h3" sx={{ my: 3 }}>
            {t('Join us and Get the right offer for your unit of service')}
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
