import * as React from 'react';
import { m } from 'framer-motion';

import { Box, Card, Stack, Container, Typography } from '@mui/material';

import {  useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

import img1 from './images/pt1.png';
import img2 from './images/pt2.png';


export default function PatientsServices() {
  const { t } = useTranslate();

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
        // display="flex" flexDirection="row"
      >
        <Stack display="flex" flexDirection="row">
          {/* <Box
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            > */}
            <Image
              sx={{ width: '100%', p: '4px', display: { xs: 'none', md: 'block' } }}
              src={img1}
            />
            <Image
              sx={{ width: '100%', p: '4px', display: { xs: 'none', md: 'block' } }}
              src={img2}
            />
           
          {/* </Box> */}
        </Stack>
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          {t(
            'The electronic system for personal health records - including this platform - contributes to reducing medical errors and costly repetitive procedures, which leads to increasing the quality of care for patients and enhances effective communication with doctors and medical service providers around the world, especially in the Arab world.'
          )}
          {t(
            'This system works to store and organize medical data and shares that information - according to the desire and need of the user - in every place and time between different health care institutions (private and governmental) in any country in the world, which leads to making more accurate health care decisions, to achieve To this end, the user can store all his medical information in the government health system and his information in the private health system in one place, which is the Hakeemna platform.'
          )}
          {t(
            'Joining the Hakeemna family allows you to benefit from all the services available on this distinguished platform, as Hakeemna. O Line provides various services, including an electronic health records system, communication with doctors and medical service providers, electronic prescriptions, medical reports, and other services.'
          )}
          {t(
            'This platform is characterized by flexibility and comprehensiveness compared to other closed platforms that are used only for individuals who have private medical insurance or government medical coverage, so Hakeemna was designed to include everyone, whether they have medical coverage (private or government) or do not have insurance, in the platform. one.'
          )}
          {t(
            'If the user (patient) has more than one health coverage (for example, private insurance and government insurance) or has part of the medical data stored in a specific database or platform (such as a government platform) and has other medical information that is not stored in that platform In the first and second cases, the user can collect and store all information, data and documents in one place, which is the Hakeemna platform. Thus, this platform becomes the main center for all information that he can use in all his medical affairs.'
          )}
          {t(
            'Hakeemna platform. Online and Family: It provides a service for storing and managing all personal health affairs for all family members electronically in order to help you manage all procedures in one platform.'
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
              - {t('Register for free in the electronic medical records system.')}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Recording and storing data in an organized electronic form, reducing repetitive(bureaucratic) paper procedures and work, and enhancing the confidentiality of information.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Promoting a more comprehensive and personalized approach to medical affairs management, as old medical history is stored and recent data is recorded automatically.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Faster and more accurate access to medical information and files, supporting better decision- making in patient healthcare.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Communicate with doctors and all medical institutions electronically in the same country or in another country.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Telemedicine and consultation services(visual communication with the doctor) and subscription to the medical journal.'
              )}
            </Typography>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Organizing and scheduling medical appointments conveniently, and booking appointments electronically.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
              {t(
                'Enhancing patient experience, reducing waiting time and reducing medical errors.'
              )}
            </Typography>
            <Typography sx={{ p: 2 }} variant="subtitle1">
              -{' '}
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
            - {t('The ability to add family members to your personal account(sons and daughters).')}
          </Typography>
          <Typography variant="subtitle1">
            - {t('Linking the father and mother’s accounts if the parents are elderly.')}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Communicate with doctors to consult them about family members’ affairs and book medical appointments.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            - {t('Storing old and recent medical files and images in one place electronically.')}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Managing their medical files such as medical history, prescriptions, medical leave, etc.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
            {t(
              'Document all clinical information to facilitate future reference to make sound medical decisions.'
            )}
          </Typography>
          <Typography variant="subtitle1">
            -{' '}
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
