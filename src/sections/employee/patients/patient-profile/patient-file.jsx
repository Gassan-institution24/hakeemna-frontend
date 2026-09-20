import React from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useGetdoctorreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import FileItem from './items/file/file-item';
import PatientFileUpload from './items/file/file-upload';

export default function PatientFile({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, loading, error, refetch } = useGetdoctorreports({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);

  const rows = Array.isArray(data) ? data : [];

  return (
    <ProfilePane
      icon="solar:folder-with-files-bold-duotone"
      title={t('File')}
      // "File", "Medical Reports" and "Upload Files" are three nearby names, and
      // nothing in the rail says which holds what. The subtitle does.
      subtitle={t("The doctor's own notes on this patient")}
      count={rows.length}
      loading={loading}
      error={error}
      isEmpty={!rows.length}
      emptyTitle={t('Nothing in the file yet')}
      emptyDescription={t('Notes recorded about this patient appear here.')}
      addLabel={t('New Information')}
      adding={showAdd}
      onToggleAdd={() => setShowAdd((open) => !open)}
      form={
        <PatientFileUpload
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
          <FileItem key={one._id} one={one} refetch={refetch} />
        ))}
      </RecordGrid>
    </ProfilePane>
  );
}
PatientFile.propTypes = { patient: PropTypes.object };
