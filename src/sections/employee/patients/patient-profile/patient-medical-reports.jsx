import React from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useGetmedicalreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import MedicalReportItem from './items/medical-report/medical-report-item';
import MedicalReportUpload from './items/medical-report/medical-report-upload';

export default function PatientMedicalReports({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, loading, error, refetch } = useGetmedicalreports({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);

  const rows = Array.isArray(data) ? data : [];

  return (
    <ProfilePane
      icon="solar:document-medicine-bold-duotone"
      title={t('Medical Reports')}
      subtitle={t('Reports written by this clinic for the patient')}
      count={rows.length}
      loading={loading}
      error={error}
      isEmpty={!rows.length}
      emptyTitle={t('No medical reports')}
      emptyDescription={t('Medical reports written for this patient appear here.')}
      addLabel={t('New Medical Report')}
      adding={showAdd}
      onToggleAdd={() => setShowAdd((open) => !open)}
      form={
        <MedicalReportUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      }
    >
      <RecordGrid>
        {rows.map((one) => (
          <MedicalReportItem key={one._id} one={one} refetch={refetch} />
        ))}
      </RecordGrid>
    </ProfilePane>
  );
}
PatientMedicalReports.propTypes = { patient: PropTypes.object };
