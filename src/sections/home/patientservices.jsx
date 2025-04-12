import * as React from 'react';
import { m } from 'framer-motion';

import { Box, Card, Stack, Container, Typography } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

import img1 from './images/pt1.png';
import img2 from './images/pt2.png';

export default function PatientsServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <>
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: '#e4f6f2',
          py: 10,
          px: { xs: 2, md: 10 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="flex-start"
          spacing={4}
        >
          {/* Images Section */}
          <Stack spacing={2} sx={{ width: { xs: '100%', md: '20%' } }}>
            <Image src={img1} sx={{ borderRadius: 2 }} />
            <Image src={img2} sx={{ borderRadius: 2 }} />
          </Stack>

          {/* Text Section */}
          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            {curLangAr ? (
              <Typography fontSize={18} lineHeight={3}>
                يساهم النظام الإلكتروني للسجلات الصحية الشخصية، ومنها منصة حكيمنا 360، في تقليل
                الأخطاء الطبية والإجراءات المكررة المكلفة، مما يعزز جودة الرعاية الصحية ويحسن
                التواصل مع الأطباء وغيرهم من مزودي الخدمات الطبية.
                <br />
                تستطيع من خلال المنصة تخزين البيانات الطبية وتنظيمها، ويسمح بمشاركة المعلومات حسب
                حاجة المستخدم بين مؤسسات الرعاية الصحية المختلفة، مما يسهل اتخاذ قرارات صحية أكثر
                دقة، بحيث يتم تخزين كل معلوماتك الطبية في مكان واحد، سواء كانت تلك المعلومات في
                النظام الصحي الحكومي أو الخاص.
                <br />
                تتيح منصة حكيمنا 360 الاستفادة من خدمات متنوعة مثل السجلات الصحية الإلكترونية،
                الوصفات الطبية الإلكترونية، والتقارير المخبرية والشعاعية، حيث تخدم الجميع سواء كان
                لديهم تأمين طبي أم لا.
                <br />
                إذا كان لديك أكثر من تغطية صحية (على سبيل المثال تأمين خاص و تأمين حكومي) أو توجد في
                قواعد بيانات مختلفة، يمكنك جمعها جميعاً في منصة حكيمنا 360، مما يجعلها المركز
                الرئيسي لكل معلوماتك الصحية.
                <br />
                تقدم المنصة خدمات إدارة السجلات الصحية الشخصية لجميع أفراد العائلة بشكل إلكتروني،
                مما يسهل إدارة الإجراءات في مكان واحد.
              </Typography>
            ) : (
              <Typography fontSize={18} lineHeight={2.4}>
                Electronic personal health records, including the Hakeemna 360 platform, help reduce
                medical errors and costly duplicate procedures, enhancing the quality of healthcare
                and improving communication with physicians and other healthcare providers.
                <br />
                The platform allows you to store and organize medical data, and allows information
                to be shared as needed between different healthcare institutions, This facilitates
                more accurate healthcare decisions, as all your medical information is stored in one
                place, whether in the public or private healthcare system.
                <br />
                The Hakeemna 360 platform offers a variety of services, such as electronic health
                records, electronic prescriptions, and laboratory and radiology reports, serving
                everyone, whether they have medical insurance or not.
                <br />
                If you have more than one health coverage (for example, private and government
                insurance) or if your coverage is located in different databases, you can
                consolidate them all into the Hakeemna 360 platform, making it the central hub for
                all your health information
                <br />
                The platform provides personal health record management services for all family
                members electronically, making it easier to manage procedures in one place.
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>

      <Container
        component={MotionViewport}
        sx={{ textAlign: 'center', mb: { xs: 4, md: 8 }, mt: { xs: 8, md: 15 } }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            sx={{
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
          {t('Advantages of creating an account in Hakeemna 360')}
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={10}
        >
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {t('Register for free in the electronic medical records system.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Recording and storing data in an organized electronic form, reducing repetitive(bureaucratic) paper procedures and work, and enhancing the confidentiality of information.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Promoting a more comprehensive and personalized approach to medical affairs management, as old medical history is stored and recent data is recorded automatically.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Faster and more accurate access to medical information and files, supporting better decision making in patient healthcare.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Communicate with doctors and all medical institutions electronically in the same country or in another country.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Telemedicine and consultation services(visual communication with the doctor) and subscription to the medical journal.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Organizing and scheduling medical appointments conveniently, and booking appointments electronically.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Enhancing patient experience, reducing waiting time and reducing medical errors.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              {' '}
              {t(
                'Monitoring the level of satisfaction with the services provided by medical institutions.'
              )}
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

      {/* Services3 Section */}
      <Box
        sx={{
          backgroundColor: '#e4f6f2',
          py: 6,
          px: 20,
          transform: 'skewY(-3deg)',
          borderRadius: 2,
          mb: 25,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={3} sx={{ transform: 'skewY(3deg)' }}>
          <Typography variant="h3">{t('Organizing the affairs of family members')}</Typography>
          <Typography variant="subtitle1">
            {t('The ability to add family members to your personal account(sons and daughters).')}
          </Typography>
          <Typography variant="subtitle1">
            {t('Linking the father and mother’s accounts if the parents are elderly.')}
          </Typography>
          <Typography variant="subtitle1">
            {' '}
            {t(
              'Communicate with doctors to consult them about family members’ affairs and book medical appointments.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            {t('Storing old and recent medical files and images in one place electronically.')}
          </Typography>
          <Typography variant="subtitle1">
            {' '}
            {t(
              'Managing their medical files such as medical history, prescriptions, medical leave, etc.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            {' '}
            {t(
              'Document all clinical information to facilitate future reference to make sound medical decisions.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            {' '}
            {t(
              'Ensuring more accurate health results and reducing medical errors by providing the medical history of all family members.'
            )}
          </Typography>
        </Stack>
      </Box>

      {/*  */}
      {/* <Box
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
      </Box> */}

      {/* more services */}
      <Box
        component={MotionViewport}
        variants={varFade().inUp}
        sx={{
          position: 'relative',
          backgroundColor: '#4aa290',
          borderRadius: 3,
          mx: { xs: 2, md: 40 },
          px: 8,
          py: 6,
          textAlign: 'start',
          // color: 'white',
          boxShadow: 3,
          mb: 20,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -25,
            left: '15%',
            width: 18,
            height: 45,
            backgroundColor: 'white',
            borderTopRightRadius: '6px',
            borderTopLeftRadius: '6px',
            border: 'green 1px solid',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -25,
            right: '15%',
            width: 18,
            height: 45,
            backgroundColor: 'white',
            borderTopRightRadius: '6px',
            borderTopLeftRadius: '6px',
            border: 'green 1px solid',
          }}
        />
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          {t('Other features')}
        </Typography>
        <ul style={{ fontWeight: 'bold' }}>
          <li>
            {t(
              'Use free applications and platforms, whether you are insured by an insurance company or not.'
            )}
          </li>
          <li>{t('Join a comprehensive and distinguished medical community.')}</li>
          <li>{t('View medical developments.')}</li>
        </ul>
      </Box>
    </>
  );
}
