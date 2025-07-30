import io from 'socket.io-client';
import React, { useState } from 'react';
import { useParams } from 'react-router';

import { Stack, Button, Container, Typography, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useGetOneUSPatient } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import PageSelector from 'src/components/pageSelector';
import UnitServiceVideoCallsTableView from 'src/sections/unit-service/videocalls/UnitServiceVideoCallsTableView';

import PatientFile from '../patient-profile/patient-file';
import EditPatient from '../patient-profile/patient-edit';
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
  const TABS = [
    { value: 'communication', label: t('communication') },
    { value: 'file', label: t('file') },
    { value: 'sick_leave', label: t('sick leave') },
    { value: 'medical_reports', label: t('medical reports') },
    { value: 'prescriptions', label: t('prescriptions') },
    { value: 'appointments', label: t('appointments') },
    { value: 'instructions', label: t('instructions') },
    { value: 'requests', label: t('requests') },
    { value: 'transfer', label: t('transfer') },
    { value: 'checklist', label: t('checklist') },
    { value: 'medical_analyses', label: t('medical analyses') },
    { value: 'video_calls', label: t('Video calls') },
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName: uniqueRoom }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create room');
      }

      const data = await response.json();
      const roomUrl = data.url;

      const saveResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/video-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unit_service: usPatientData.unit_service, // تأكد هذا هو ID من `unit_services`
          patient: patientData?._id,
          description: `Call started at ${new Date().toISOString()}`,
          room_name: uniqueRoom,
          work_group: usPatientData.work_group,
          employee: user?.employee?._id,
        }),
      });

      if (!saveResponse.ok) {
        const err = await saveResponse.json();
        console.warn('⚠️ Video call not saved:', err);
      } else {
        console.log('✅ Video call saved in DB');
      }

      router.push(
        `/call?roomUrl=${encodeURIComponent(data.url)}&userName=${encodeURIComponent(
          user?.employee?.name_arabic || user?.employee?.name_english
        )}`
      );

      const socket = io(process.env.REACT_APP_API_URL);
      socket.emit('callUser', {
        userId: patientData.user,
        userName: curLangAr ? patientData?.name_arabic : patientData?.name_english,
        roomUrl,
      });

      console.log('📤 Sent callUser with room:', roomUrl);
    } catch (error) {
      console.error('❌ handleCall error:', error);
    }
  };

  return (
    <Container sx={{ backgroundColor: '#fff', minHeight: '100vh' }} maxWidth="">
      <Stack paddingTop={5} minHeight="100vh" direction={{ md: 'row' }}>
        <Stack gap={2}>
          <PageSelector
            vertical
            pages={TABS.map((tab) => ({
              ...tab,
              onClick: () => setCurrentTab(tab.value),
              active: tab.value === currentTab,
            }))}
          />
        </Stack>
        <Stack gap={2} flex={1}>
          <Stack
            direction="row"
            padding={3}
            paddingX={10}
            paddingTop={0}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <IconButton onClick={() => router.back()}>
                <Iconify icon="eva:arrow-ios-back-fill" />
              </IconButton>
              <Typography variant="h6">
                {curLangAr ? patientData?.name_arabic : patientData?.name_english}
              </Typography>
            </Stack>
            <Typography variant="h6">{t(patientData?.gender)}</Typography>
            <Typography variant="h6">{calculateAge(patientData?.birth_date)}</Typography>
            <Typography variant="h6">{fDate(patientData?.birth_date)}</Typography>
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
          {currentTab === 'about' && usPatientData && <PatientAbout patient={usPatientData} />}
          {currentTab === 'communication' && usPatientData && (
            <PatientCommunication patient={usPatientData} />
          )}
          {currentTab === 'file' && usPatientData && <PatientFile patient={usPatientData} />}
          {currentTab === 'sick_leave' && usPatientData && (
            <PatientSickLeaves patient={usPatientData} />
          )}
          {currentTab === 'medical_reports' && usPatientData && (
            <PatientMedicalReports patient={usPatientData} />
          )}
          {currentTab === 'prescriptions' && usPatientData && (
            <PatientPrescriptions patient={usPatientData} />
          )}
          {currentTab === 'appointments' && usPatientData && (
            <AppointmentsHistory patient={usPatientData} />
          )}
          {currentTab === 'instructions' && usPatientData && (
            <PatientInstructions patient={usPatientData} />
          )}
          {currentTab === 'upload' && usPatientData && <PatientUpload patient={usPatientData} />}

          {currentTab === 'edit' && usPatientData && <EditPatient patient={usPatientData} />}
          {currentTab === 'checklist' && usPatientData && (
            <PatientCheckList patient={usPatientData} />
          )}
          {currentTab === 'video_calls' && usPatientData && <UnitServiceVideoCallsTableView patient={usPatientData} />}
        </Stack>
      </Stack>
    </Container>
  );
}
