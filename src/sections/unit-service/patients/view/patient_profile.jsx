import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetOneUSPatient } from 'src/api';
import useUSTypeGuard from 'src/auth/guard/USType-guard';

import Iconify from 'src/components/iconify';

import PatientOverview from 'src/sections/shared/patient-profile/overview';
import { mergeUsPatient } from 'src/sections/shared/patient-profile/utils';
import PatientUpload from 'src/sections/employee/patients/patient-profile/patient-upload';
import PatientProfileShell from 'src/sections/shared/patient-profile/patient-profile-shell';
import { useProfileSection } from 'src/sections/shared/patient-profile/use-profile-section';
import PatientFinancial from 'src/sections/employee/patients/patient-profile/patient-financial';
import PatientSickLeaves from 'src/sections/employee/patients/patient-profile/patient-sick-leave';
import PatientCommunication from 'src/sections/employee/patients/patient-profile/patient-communication';
import PatientPrescriptions from 'src/sections/employee/patients/patient-profile/patient-prescriptions';
import PatientMedicalReports from 'src/sections/employee/patients/patient-profile/patient-medical-reports';

import PatientFile from '../patient-profile/patient-file';
import EditPatient from '../patient-profile/patient-edit';
import AppointmentsHistory from '../patient-profile/appoint-history';

// ----------------------------------------------------------------------

// The endpoint takes populate as keys and resolves each to a whitelisted spec,
// so this is a plain list rather than a mongoose populate graph.
const POPULATE =
  'patient drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet insurance nationality country city work_groups';

export default function PatientProfile() {
  const { id } = useParams();
  const { t } = useTranslate();
  const { isMedLab } = useUSTypeGuard();

  const { usPatientData, loading } = useGetOneUSPatient(id, { populate: POPULATE });

  // Shared with the doctor's profile. This used to replace the record with the
  // linked patient account, which dropped the clinic's own fields -- file_code,
  // code and work_groups all vanished for a verified patient.
  const patientData = useMemo(() => mergeUsPatient(usPatientData), [usPatientData]);

  const pinned = useMemo(
    () => [{ value: 'overview', label: t('Overview'), icon: 'solar:widget-5-bold-duotone' }],
    [t]
  );

  // Same grouping as the doctor's profile, minus the sections a lab never has.
  // A group left with no items is dropped by the rail, not shown empty.
  const sections = useMemo(
    () =>
      [
        {
          key: 'clinical',
          label: t('Clinical'),
          items: [
            !isMedLab && {
              value: 'file',
              label: t('File'),
              icon: 'solar:folder-with-files-bold-duotone',
            },
            {
              value: 'medical_reports',
              label: t('Medical Reports'),
              icon: 'solar:document-medicine-bold-duotone',
            },
            !isMedLab && {
              value: 'prescriptions',
              label: t('Prescriptions'),
              icon: 'solar:pills-bold-duotone',
            },
          ].filter(Boolean),
        },
        {
          key: 'patient_care',
          label: t('Patient Care'),
          items: [
            !isMedLab && {
              value: 'sick_leave',
              label: t('Sick Leave'),
              icon: 'solar:bed-bold-duotone',
            },
            {
              value: 'communication',
              label: t('Patient Communication'),
              icon: 'solar:chat-round-dots-bold-duotone',
            },
          ].filter(Boolean),
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
      ].filter((section) => section.items.length),
    [t, isMedLab]
  );

  const validSections = useMemo(
    () => [...pinned, ...sections.flatMap((one) => one.items)].map((one) => one.value).concat('edit'),
    [pinned, sections]
  );

  const [section, setSection] = useProfileSection(validSections);

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return <PatientOverview patient={patientData} uspId={id} onNavigate={setSection} />;
      case 'file':
        return <PatientFile patient={usPatientData} />;
      case 'medical_reports':
        return <PatientMedicalReports patient={usPatientData} />;
      case 'prescriptions':
        return <PatientPrescriptions patient={usPatientData} />;
      case 'sick_leave':
        return <PatientSickLeaves patient={usPatientData} />;
      case 'communication':
        return <PatientCommunication patient={usPatientData} />;
      case 'appointments':
        return <AppointmentsHistory patient={usPatientData} />;
      case 'financial':
        return <PatientFinancial patient={usPatientData} />;
      case 'upload':
        return <PatientUpload patient={usPatientData} />;
      case 'edit':
        return <EditPatient patient={usPatientData} />;
      default:
        return null;
    }
  };

  return (
    <PatientProfileShell
      patient={patientData}
      loading={loading}
      bannerActions={
        // Same placement as the doctor's profile; this one has no Call button.
        <Button
          variant={section === 'edit' ? 'contained' : 'outlined'}
          color="inherit"
          onClick={() => setSection('edit')}
          startIcon={<Iconify icon="solar:user-id-bold-duotone" />}
        >
          {t('Patient Information')}
        </Button>
      }
      backTo={paths.unitservice.patients.all}
      pinned={pinned}
      sections={sections}
      section={section}
      onChangeSection={setSection}
    >
      {renderSection()}
    </PatientProfileShell>
  );
}
