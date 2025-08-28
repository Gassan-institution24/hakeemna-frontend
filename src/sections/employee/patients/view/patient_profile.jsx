import io from 'socket.io-client';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  Stack,
  Button,
  Container,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';
import { useGetOneUSPatient } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import PageSelector from 'src/components/pageSelector';

import PatientFile from '../patient-profile/patient-file';
import EditPatient from '../patient-profile/patient-edit';
import PatientHistory from '../patient-profile/patient-hy';
import PatientAbout from '../patient-profile/patient-about';
import PatientUpload from '../patient-profile/patient-upload';
import PatientCheckList from '../patient-profile/patient-checklist';
import AppointmentsHistory from '../patient-profile/appoint-history';
import PatientSickLeaves from '../patient-profile/patient-sick-leave';
import PatientInstructions from '../patient-profile/patient-instructions';
import PatientPrescriptions from '../patient-profile/patient-prescriptions';
import PatientCommunication from '../patient-profile/patient-communication';
import PatientMedicalReports from '../patient-profile/patient-medical-reports';

// ----------------------------------------------------------------------

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const { usPatientData } = useGetOneUSPatient(id, {
    populate: [
      {
        path: 'patient',
        populate: 'drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet',
      },
      { path: 'drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet' },
    ],
  });

  const patientData = usPatientData.patient
    ? { ...usPatientData.patient, ...usPatientData }
    : usPatientData;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [currentTab, setCurrentTab] = useState('communication');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const TABS = [
    { value: 'communication', label: t('communication') },
    { value: 'file', label: t('file') },
    { value: 'history', label: t('history') },
    { value: 'sick_leave', label: t('sick leave') },
    { value: 'medical_reports', label: t('medical reports') },
    { value: 'prescriptions', label: t('prescriptions') },
    { value: 'appointments', label: t('appointments') },
    { value: 'instructions', label: t('instructions') },
    { value: 'requests', label: t('requests') },
    { value: 'transfer', label: t('transfer') },
    { value: 'checklist', label: t('checklist') },
    { value: 'medical_analyses', label: t('medical analyses') },
  ].filter(Boolean);

  function calculateAge(birthDate) {
    if (birthDate) {
      const today = new Date();
      const dob = new Date(birthDate);
      const age = today.getFullYear() - dob.getFullYear();
      if (age === 0) {
        return `${today.getMonth() - dob.getMonth()} months`;
      }
      return `${age} years`;
    }
    return '';
  }

  const handleCall = async () => {
    try {
      const uniqueRoom = `hakeemna-${Date.now()}`;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/daily/create-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: uniqueRoom }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create room');
      }

      const data = await response.json();
      const roomUrl = data.url;

      await fetch(`${process.env.REACT_APP_API_URL}/api/video-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_service: usPatientData.unit_service,
          patient: patientData?._id,
          employee: user?.employee?._id,
          work_group: patientData?.work_group,
          descriptionEn: `Video call initiated by Dr. ${user?.employee?.name_english} with patient ${patientData?.name_english} at ${new Date().toLocaleString()}`,
          descriptionAR: `تم بدء مكالمة فيديو من قبل الدكتور ${user?.employee?.name_arabic} مع المريض ${patientData?.name_arabic} بتاريخ ${new Date().toLocaleString('ar-EG')}`,
          room_name: uniqueRoom,
        }),
      });

      router.push(
        `/call?roomUrl=${encodeURIComponent(data.url)}&userName=${encodeURIComponent(
          user?.employee?.name_arabic || user?.employee?.name_english
        )}&uniqueRoom=${encodeURIComponent(uniqueRoom)}`
      );

      const socket = io(process.env.REACT_APP_API_URL);
      socket.emit('callUser', {
        userId: patientData.user,
        userName: curLangAr ? patientData?.name_arabic : patientData?.name_english,
        roomUrl,
        uniqueRoom,
      });
    } catch (error) {
      console.error('❌ handleCall error:', error);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'about':
        return <PatientAbout patient={usPatientData} />;
      case 'communication':
        return <PatientCommunication patient={usPatientData} />;
      case 'file':
        return <PatientFile patient={usPatientData} />;
      case 'history':
        return <PatientHistory patient={usPatientData} />;
      case 'sick_leave':
        return <PatientSickLeaves patient={usPatientData} />;
      case 'medical_reports':
        return <PatientMedicalReports patient={usPatientData} />;
      case 'prescriptions':
        return <PatientPrescriptions patient={usPatientData} />;
      case 'appointments':
        return <AppointmentsHistory patient={usPatientData} />;
      case 'instructions':
        return <PatientInstructions patient={usPatientData} />;
      case 'upload':
        return <PatientUpload patient={usPatientData} />;
      case 'edit':
        return <EditPatient patient={usPatientData} />;
      case 'checklist':
        return <PatientCheckList patient={usPatientData} />;
      default:
        return null;
    }
  };

  return (
    <Container
      sx={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: isMobile ? '20px' : '0' }}
      maxWidth={false}
    >
      <Stack paddingTop={5} minHeight="100vh" direction={{ md: 'row' }}>
        {isMobile ? (
          <>
            <IconButton
              sx={{
                position: 'fixed',
                top: 16,
                left: 16,
                zIndex: 1300,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: 'background.paper',
                },
              }}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  paddingTop: '64px',
                },
              }}
            >
              <Box sx={{ width: 250, p: 2 }} role="presentation">
                <List>
                  {TABS.map((tab) => (
                    <ListItem
                      button
                      key={tab.value}
                      selected={tab.value === currentTab}
                      onClick={() => {
                        setCurrentTab(tab.value);
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText primary={tab.label} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Stack gap={2} sx={{ minWidth: 200, pr: 2 }}>
            <PageSelector
              vertical
              pages={TABS.map((tab) => ({
                ...tab,
                onClick: () => setCurrentTab(tab.value),
                active: tab.value === currentTab,
              }))}
            />
          </Stack>
        )}

        <Stack gap={2} flex={1}>
          <Stack
            direction="row"
            padding={3}
            paddingX={{ xs: 2, md: 10 }}
            paddingTop={0}
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <IconButton onClick={() => router.back()}>
                <Iconify icon="eva:arrow-ios-back-fill" />
              </IconButton>
              <Typography variant="h6">
                {curLangAr ? patientData?.name_arabic : patientData?.name_english}
              </Typography>
            </Stack>

            <Stack direction="row" gap={2} flexWrap="wrap">
              <Typography variant="h6">{t(patientData?.gender)}</Typography>
              <Typography variant="h6">{calculateAge(patientData?.birth_date)}</Typography>
              <Typography variant="h6">{fDate(patientData?.birth_date)}</Typography>
            </Stack>

            <Stack direction="row" gap={2}>
              <Button
                sx={{ minWidth: 120 }}
                variant="contained"
                onClick={() => setCurrentTab('edit')}
              >
                {t('edit')}
              </Button>
              {patientData && (
                <Button
                  sx={{ minWidth: 120 }}
                  variant="contained"
                  color="primary"
                  onClick={handleCall}
                >
                  {t('Call')}
                </Button>
              )}
            </Stack>
          </Stack>

          <Box sx={{ px: { xs: 2, md: 10 }, pb: 4 }}>{renderTabContent()}</Box>
        </Stack>
      </Stack>
    </Container>
  );
}
