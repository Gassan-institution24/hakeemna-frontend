import io from 'socket.io-client';
import { useParams } from 'react-router';
import React, { useRef, useState, useEffect } from 'react';

import { Box, Card, Chip, Stack, Button, Container, Typography, IconButton } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useGetOneUSPatient } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
import { useSubscriptionGuard } from 'src/auth/guard/subscription-guard';

import Iconify from 'src/components/iconify';
import ProfileTabs from 'src/components/profile-tabs';

import PatientFile from '../patient-profile/patient-file';
import EditPatient from '../patient-profile/patient-edit';
import PatientHistory from '../patient-profile/patient-hy';
import PatientAbout from '../patient-profile/patient-about';
import PatientUpload from '../patient-profile/patient-upload';
import PatientCheckList from '../patient-profile/patient-checklist';
import PatientRadiology from '../patient-profile/patient-radiology';
import AppointmentsHistory from '../patient-profile/appoint-history';
import PatientSickLeaves from '../patient-profile/patient-sick-leave';
import PatientDentalChart from '../dental-chart/patient-dental-chart';
import PatientInstructions from '../patient-profile/patient-instructions';
import PatientPrescriptions from '../patient-profile/patient-prescriptions';
import PatientCommunication from '../patient-profile/patient-communication';
import PatientMedicalReports from '../patient-profile/patient-medical-reports';
import PatientMedicalAnalyses from '../patient-profile/patient_medical_analyses';

// ----------------------------------------------------------------------

export default function PatientProfile() {
  const { id } = useParams();
  const socketRef = useRef(null);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const patientData = usPatientData.patient
    ? { ...usPatientData.patient, ...usPatientData }
    : usPatientData;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const checkAcl = useAclGuard();
  const { hasFeature } = useSubscriptionGuard();

  // eslint-disable-next-line no-unused-vars
  const [callData, setCallData] = useState(null);

  // check online
  const [isPatientOnline, setIsPatientOnline] = useState(false);
  useEffect(() => {
    if (patientData?.patient?.online !== undefined) {
      setIsPatientOnline(patientData.patient?.online);
    }
  }, [patientData?.patient?.online]);

  useEffect(() => {
    if (!patientData?.patient?._id) return;

    socketRef.current = io(process.env.REACT_APP_API_URL);

    socketRef.current.on('userOnlineStatus', ({ userId, online }) => {
      if (userId === patientData?.patient?._id) {
        setIsPatientOnline(online);
      }
    });

    // eslint-disable-next-line consistent-return
    return () => socketRef.current.disconnect();
  }, [patientData?.patient?._id]);

  const [currentTab, setCurrentTab] = useState('communication');

  const TABS = [
    { value: 'communication', label: t('communication') },
    { value: 'file', label: t('file') },
    { value: 'history', label: t('history') },
    { value: 'sick_leave', label: t('sick leave') },
    { value: 'medical_reports', label: t('medical reports') },
    { value: 'prescriptions', label: t('prescriptions') },
    { value: 'appointments', label: t('appointments') },
    { value: 'instructions', label: t('instructions') },
    { value: 'checklist', label: t('checklist') },
    { value: 'medical_analysis', label: t('medical analysis') },
    { value: 'radiology', label: t('radiology') },
    checkAcl('dental_chart:read') &&
      hasFeature('dental_chart') && { value: 'dental', label: t('dental chart') },
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
          work_group: patientData?.work_groups?.[0],
          descriptionEn: `Video call initiated by Dr. ${user?.employee?.name_english} with patient ${patientData?.name_english} at ${new Date().toLocaleString()}`,
          descriptionAR: `تم بدء مكالمة فيديو من قبل الدكتور ${user?.employee?.name_arabic} مع المريض ${patientData?.name_arabic} بتاريخ ${new Date().toLocaleString('ar-EG')}`,
          room_name: uniqueRoom,
        }),
      });

      // add more data to url like role
      window.open(
        `/video-call/${id}?roomUrl=${encodeURIComponent(roomUrl)}&uniqueRoom=${uniqueRoom}&role=host`,
        '_blank'
      );

      setCallData({ roomUrl, uniqueRoom });
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
      case 'medical_analysis':
        return <PatientMedicalAnalyses patient={usPatientData} />;
      case 'radiology':
        return <PatientRadiology patient={usPatientData} />;
      case 'dental':
        return <PatientDentalChart patient={usPatientData} />;
      default:
        return null;
    }
  };

  const patientName = curLangAr
    ? patientData?.name_arabic || patientData?.name_english
    : patientData?.name_english || patientData?.name_arabic;

  return (
    <Container maxWidth="xl" sx={{ pt: 2 }}>
      <Card sx={{ p: 3, mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={() => router.back()}>
              <Iconify icon={curLangAr ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} />
            </IconButton>

            <Stack gap={0.5}>
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                  {t('patients')}
                </Typography>
                <Typography variant="subtitle1" color="text.disabled">
                  /
                </Typography>
                <Typography variant="h6">{patientName}</Typography>

                {patientData?.patient?._id ? (
                  <Iconify
                    icon="eva:checkmark-circle-2-fill"
                    width={20}
                    sx={{ color: 'primary.main' }}
                  />
                ) : (
                  <Typography variant="body2" color="warning.main" fontWeight={600}>
                    {curLangAr ? 'غير موثق' : 'Not Verified'}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {patientData?.gender && <Chip size="small" label={t(patientData.gender)} />}
                {patientData?.birth_date && (
                  <>
                    <Chip size="small" label={calculateAge(patientData.birth_date)} />
                    <Chip size="small" label={fDate(patientData.birth_date)} />
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" gap={2}>
            <Button sx={{ minWidth: 120 }} variant="contained" onClick={() => setCurrentTab('edit')}>
              {t('edit')}
            </Button>
            {patientData?.patient?._id && (
              <Button
                sx={{ minWidth: 120 }}
                variant="contained"
                color="primary"
                onClick={handleCall}
                disabled={!isPatientOnline}
              >
                {t('Call')}
              </Button>
            )}
          </Stack>
        </Stack>

        <ProfileTabs tabs={TABS} value={currentTab} onChange={setCurrentTab} sx={{ mt: 2 }} />
      </Card>

      <Box sx={{ pb: 4 }}>{renderTabContent()}</Box>
    </Container>
  );
}
