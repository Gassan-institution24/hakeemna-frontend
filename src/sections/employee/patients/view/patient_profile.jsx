import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetOneUSPatient } from 'src/api';

import Iconify from 'src/components/iconify';

import PatientOverview from 'src/sections/shared/patient-profile/overview';
import { mergeUsPatient } from 'src/sections/shared/patient-profile/utils';
import PatientVisits from 'src/sections/shared/patient-profile/patient-visits';
import PatientProfileShell from 'src/sections/shared/patient-profile/patient-profile-shell';
import { useProfileSection } from 'src/sections/shared/patient-profile/use-profile-section';
import { usePatientVideoCall } from 'src/sections/shared/patient-profile/use-patient-video-call';

import PatientFile from '../patient-profile/patient-file';
import EditPatient from '../patient-profile/patient-edit';
import PatientHistory from '../patient-profile/patient-hy';
import PatientUpload from '../patient-profile/patient-upload';
import PatientFinancial from '../patient-profile/patient-financial';
import PatientCheckList from '../patient-profile/patient-checklist';
import PatientRadiology from '../patient-profile/patient-radiology';
import AppointmentsHistory from '../patient-profile/appoint-history';
import PatientSickLeaves from '../patient-profile/patient-sick-leave';
import PatientInstructions from '../patient-profile/patient-instructions';
import PatientPrescriptions from '../patient-profile/patient-prescriptions';
import PatientCommunication from '../patient-profile/patient-communication';
import PatientMedicalReports from '../patient-profile/patient-medical-reports';
import PatientMedicalAnalyses from '../patient-profile/patient_medical_analyses';

// ----------------------------------------------------------------------

// The endpoint takes populate as keys and resolves each to a whitelisted spec,
// so this is a plain list rather than a mongoose populate graph.
const POPULATE =
  'patient drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet insurance nationality country city work_groups';

export default function PatientProfile() {
  const { id } = useParams();
  const { t } = useTranslate();

  const { usPatientData, loading, refetch } = useGetOneUSPatient(id, { populate: POPULATE });

  const patientData = useMemo(() => mergeUsPatient(usPatientData), [usPatientData]);

  const { isPatientOnline, handleCall, canCall } = usePatientVideoCall({
    usPatientData,
    patientData,
  });

  // Grouped so a doctor scans by intent: what they read to decide, what they
  // produce for the patient, then everything administrative.
  const pinned = useMemo(
    () => [{ value: 'overview', label: t('Overview'), icon: 'solar:widget-5-bold-duotone' }],
    [t]
  );

  const sections = useMemo(
    () => [
      {
        key: 'clinical',
        label: t('Clinical'),
        items: [
          { value: 'history', label: t('Visit History'), icon: 'solar:history-bold-duotone' },
          { value: 'visits', label: t('Visits'), icon: 'solar:door-bold-duotone' },
          { value: 'file', label: t('File'), icon: 'solar:folder-with-files-bold-duotone' },
          {
            value: 'medical_reports',
            label: t('Medical Reports'),
            icon: 'solar:document-medicine-bold-duotone',
          },
          { value: 'prescriptions', label: t('Prescriptions'), icon: 'solar:pills-bold-duotone' },
          {
            value: 'medical_analysis',
            label: t('Lab Results'),
            icon: 'solar:test-tube-bold-duotone',
          },
          { value: 'radiology', label: t('Radiology'), icon: 'solar:bone-bold-duotone' },
        ],
      },
      {
        key: 'patient_care',
        label: t('Patient Care'),
        items: [
          { value: 'sick_leave', label: t('Sick Leave'), icon: 'solar:bed-bold-duotone' },
          {
            value: 'instructions',
            label: t('Patient Instructions'),
            icon: 'solar:clipboard-text-bold-duotone',
          },
          {
            value: 'checklist',
            label: t('Questionnaires'),
            icon: 'solar:checklist-minimalistic-bold-duotone',
            tooltip: t('Questions and assessments to evaluate the patient'),
          },
          {
            value: 'communication',
            label: t('Patient Communication'),
            icon: 'solar:chat-round-dots-bold-duotone',
          },
        ],
      },
      {
        key: 'administration',
        label: t('Administration'),
        items: [
          { value: 'appointments', label: t('Appointments'), icon: 'solar:calendar-bold-duotone' },
          {
            value: 'financial',
            label: t('Financial Information'),
            icon: 'solar:wallet-money-bold-duotone',
          },
          { value: 'upload', label: t('Upload Files'), icon: 'solar:upload-bold-duotone' },
        ],
      },
    ],
    [t]
  );

  const validSections = useMemo(
    () => [...pinned, ...sections.flatMap((one) => one.items)].map((one) => one.value).concat('edit'),
    [pinned, sections]
  );

  // Opens on the overview, same as the unit-service profile. Visit History is
  // the first item under Clinical if that is what you want instead.
  const [section, setSection] = useProfileSection(validSections);

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return (
          <PatientOverview patient={patientData} uspId={id} onNavigate={setSection} />
        );
      case 'visits':
        return <PatientVisits patient={usPatientData} />;
      case 'history':
        return <PatientHistory patient={usPatientData} />;
      case 'file':
        return <PatientFile patient={usPatientData} />;
      case 'medical_reports':
        return <PatientMedicalReports patient={usPatientData} />;
      case 'prescriptions':
        return <PatientPrescriptions patient={usPatientData} />;
      case 'medical_analysis':
        return <PatientMedicalAnalyses patient={usPatientData} />;
      case 'radiology':
        return <PatientRadiology patient={usPatientData} />;
      case 'sick_leave':
        return <PatientSickLeaves patient={usPatientData} />;
      case 'instructions':
        return <PatientInstructions patient={usPatientData} />;
      case 'checklist':
        return <PatientCheckList patient={usPatientData} />;
      case 'communication':
        return <PatientCommunication patient={usPatientData} />;
      case 'appointments':
        return <AppointmentsHistory patient={usPatientData} />;
      case 'financial':
        return <PatientFinancial patient={usPatientData} />;
      case 'upload':
        return <PatientUpload patient={usPatientData} />;
      case 'edit':
        return <EditPatient patient={usPatientData} onSaved={refetch} />;
      default:
        return null;
    }
  };

  // Patient Information sits beside Call rather than in the rail: it is the
  // record's own identity, not one of the clinical sections filed under it.
  const bannerActions = (
    <>
      {canCall && (
        <Button
          sx={{ minWidth: 120 }}
          variant="contained"
          onClick={handleCall}
          disabled={!isPatientOnline}
        >
          {t('Call')}
        </Button>
      )}

      <Button
        variant={section === 'edit' ? 'contained' : 'outlined'}
        color="inherit"
        onClick={() => setSection('edit')}
        startIcon={<Iconify icon="solar:user-id-bold-duotone" />}
      >
        {t('Patient Information')}
      </Button>
    </>
  );

  return (
    <PatientProfileShell
      patient={patientData}
      loading={loading}
      bannerActions={bannerActions}
      backTo={paths.employee.patients.all}
      pinned={pinned}
      sections={sections}
      section={section}
      onChangeSection={setSection}
    >
      {renderSection()}
    </PatientProfileShell>
  );
}
