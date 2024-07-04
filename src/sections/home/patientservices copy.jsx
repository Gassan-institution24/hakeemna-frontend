import * as React from 'react';
import { m } from 'framer-motion';

import { Box } from '@mui/system';
import { Container, Divider, Typography } from '@mui/material';


import Iconify from 'src/components/iconify';
import { useLocales, useTranslate } from 'src/locales';
import { MotionViewport, varFade } from 'src/components/animate';

export default function PatientsServices() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <>
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 8, md: 10 } }}>
        <m.div variants={varFade().inUp}>
          <Typography sx={{
            fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
            fontWeight: 700,
            fontSize: { xs: 35, md: 50 },
          }}>{t('WHAT WE DO')}</Typography>
        </m.div>
      </Container>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: '1fr',
            xs: '1fr',
            md: '1fr 1fr ',
            lg: '1fr 1fr ',
            xl: '1fr 1fr 1fr',
          },
          m: 6,
        }}
      >
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify
              icon="material-symbols-light:patient-list-outline"
              width={35}
              sx={{ color: 'white', m: 1.5 }}
            />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            Features for the user of medical services
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Register for free in the
              electronic medical records system.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Recording and storing data
              in an organized electronic form, reducing repetitive (bureaucratic) paper procedures
              and work, and enhancing the confidentiality of information.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Promoting a more
              comprehensive and personalized approach to medical affairs management, as old medical
              history is stored and recent data is recorded automatically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Faster and more accurate
              access to medical information and files, supporting better decision-making in patient
              healthcare.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Communicate with doctors
              and all medical institutions electronically in the same country or in another country.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Telemedicine and
              consultation services (visual communication with the doctor) and subscription to the
              medical journal.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Organizing and scheduling
              medical appointments conveniently, and booking appointments electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Enhancing patient
              experience, reducing waiting time and reducing medical errors.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Monitoring the level of
              satisfaction with the services provided by medical institutions.
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify
              icon="guidance:changin-room-family"
              width={35}
              sx={{ color: 'white', m: 1.5 }}
            />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            Organizing the affairs of family members
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              The ability to add family members to your personal account (sons and daughters).
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Linking the father and mother’s accounts if the parents are elderly.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Communicate with doctors to consult them about family members’ affairs and book
              medical appointments.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Storing old and recent medical files and images in one place electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing their medical files such as medical history, prescriptions, medical leave,
              etc.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Document all clinical information to facilitate future reference to make sound medical
              decisions.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Ensuring more accurate health results and reducing medical errors by providing the
              medical history of all family members.
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify icon="mdi:passport" width={35} sx={{ color: 'white', m: 1.5 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            Medical Tourism
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Providing various services to patients traveling to another country for medical
              treatment.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Follow up and evaluate the experience of the patient and his companions in health care
              provided in another country.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />A more effective flow of
              information and better communication between health care service providers, between
              the country in which the patient resides and the country in which he received health
              care.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Follow up and manage all medical affairs through one application on the phone or on
              the browser, even though you do not reside in the same country in which the medical
              services were provided to you.
            </li>
          </ul>
        </Box>

        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify icon="ph:list-star-light" width={35} sx={{ color: 'white', m: 1.5 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            Other features
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Use free applications and platforms, whether you are insured by an insurance company
              or not.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Join a comprehensive and distinguished medical community.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              View medical developments.
            </li>
          </ul>
        </Box>
      </Box>
    </>
  );
}
