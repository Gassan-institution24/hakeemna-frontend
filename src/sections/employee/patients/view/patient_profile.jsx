import { useParams } from 'react-router';
import React, { useState, useCallback } from 'react';

import { Tab, Box, Tabs, Card, Stack, Avatar, Container, Typography } from '@mui/material';

import { useGetOneUSPatient } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import PatientFile from '../patient-profile/patient-file';
import EditPatient from '../patient-profile/patient-edit';
import PatientAbout from '../patient-profile/patient-about';
import PatientUpload from '../patient-profile/patient-upload';
import AppointmentsHistory from '../patient-profile/appoint-history';
import PatientSickLeaves from '../patient-profile/patient-sick-leave';
import PatientPrescriptions from '../patient-profile/patient-prescriptions';
import PatientMedicalReports from '../patient-profile/patient-medical-reports';

// ----------------------------------------------------------------------

export default function PatientProfile() {
  const { id } = useParams();
  const { usPatientData } = useGetOneUSPatient(id, {
    populate: [
      {
        path: 'patient',
        populate: 'drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet',
      },
      { path: 'drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet' },
    ],
  });

  // const { isMedLab } = useUSTypeGuard();

  const patientData = usPatientData.patient ? usPatientData.patient : usPatientData;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [currentTab, setCurrentTab] = useState('upload');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = [
    // {
    //   value: 'about',
    //   label: t('about'),
    // },
    {
      value: 'file',
      label: t('file'),
    },
    {
      value: 'sick_leave',
      label: t('sick leave'),
    },
    {
      value: 'medical_reports',
      label: t('medical reports'),
    },
    {
      value: 'prescriptions',
      label: t('prescriptions'),
    },
    {
      value: 'appointments',
      label: t('appointments'),
    },
    {
      value: 'upload',
      label: t('upload files'),
    },
    {
      value: 'edit',
      label: t('edit'),
    },
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

  const patientGeneralData = [
    { title: 'age', value: calculateAge(patientData?.birth_date) },
    { title: 'gender', value: patientData?.gender },
    { title: 'phone', value: patientData?.mobile_num1 },
    { title: 'email', value: patientData?.email },
    { title: 'height', value: patientData?.height, unit: 'cm' },
    { title: 'weight', value: patientData?.weight, unit: 'kg' },
    { title: 'smoking', value: patientData?.smoking },
    { title: 'alcohol consumption', value: patientData?.alcohol_consumption },
    { title: 'sport exercises', value: patientData?.sport_exercises },
  ];

  return (
    <Container maxWidth="xl">
      <Card sx={{ px: 4, py: 2, mb: 4 }}>
        <Stack direction={{ md: 'row' }} alignItems="center" gap={5}>
          <Avatar
            src={patientData?.profile_picture}
            sx={{ width: { md: 100 }, height: { md: 100 } }}
          />
          <Stack gap={1}>
            <Typography variant="h6">
              {curLangAr ? patientData?.name_arabic : patientData?.name_english}
            </Typography>
            <Box
              rowGap={0.5}
              columnGap={8}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {patientGeneralData?.map((one, idx) => (
                <Typography key={idx} variant="body2">
                  <span style={{ fontWeight: 650, color: '#637381' }}>{t(one?.title)}</span>:{' '}
                  <span dir={one.title === 'phone' ? 'ltr' : ''}>{t(one.value)} {one.unit}</span>
                </Typography>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Card>
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab key={idx} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'about' && <PatientAbout patient={usPatientData} />}
      {currentTab === 'file' && <PatientFile patient={usPatientData} />}
      {currentTab === 'sick_leave' && <PatientSickLeaves patient={usPatientData} />}
      {currentTab === 'medical_reports' && <PatientMedicalReports patient={usPatientData} />}
      {currentTab === 'prescriptions' && <PatientPrescriptions patient={usPatientData} />}
      {currentTab === 'appointments' && <AppointmentsHistory patient={usPatientData} />}
      {currentTab === 'upload' && <PatientUpload patient={usPatientData} />}
      {currentTab === 'edit' && <EditPatient patient={usPatientData} />}
    </Container>
  );
}
