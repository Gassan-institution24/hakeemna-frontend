import React from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetSickLeaves } from 'src/api/sick_leave';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import SickLeaveItem from './items/sick-leave/sick-leave-item';
import SickLeaveUpload from './items/sick-leave/sick-leave-upload';

export default function PatientSickLeaves({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, loading, error, refetch } = useGetSickLeaves({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);

  const rows = Array.isArray(data) ? data : [];

  return (
    <ProfilePane
      icon="solar:bed-bold-duotone"
      title={t('Sick Leave')}
      count={rows.length}
      loading={loading}
      error={error}
      isEmpty={!rows.length}
      emptyTitle={t('No sick leave issued')}
      emptyDescription={t('Sick leave certificates issued to this patient appear here.')}
      addLabel={t('New Sick Leave')}
      adding={showAdd}
      onToggleAdd={() => setShowAdd((open) => !open)}
      form={
        <SickLeaveUpload
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
          <SickLeaveItem key={one._id} one={one} refetch={refetch} />
        ))}
      </RecordGrid>
    </ProfilePane>
  );
}
PatientSickLeaves.propTypes = { patient: PropTypes.object };
