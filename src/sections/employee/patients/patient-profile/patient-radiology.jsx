import React from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useGetRadiologyPatient } from 'src/api/radiology_patient';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import RadiologyItem from './items/radiology/RadiologyItem';
import RadiologyUpload from './items/radiology/radiology-upload';

export default function PatientRadiology({ patient }) {
  const { t } = useTranslate();

  const { radiologyData, loading, error, refetch } = useGetRadiologyPatient(patient?._id);

  const [showAdd, setShowAdd] = React.useState(false);

  const rows = Array.isArray(radiologyData) ? radiologyData : [];

  return (
    <ProfilePane
      icon="solar:bone-bold-duotone"
      title={t('Radiology')}
      count={rows.length}
      loading={loading}
      error={error}
      isEmpty={!rows.length}
      emptyTitle={t('No radiology studies')}
      emptyDescription={t('Imaging studies recorded for this patient appear here.')}
      addLabel={t('New Radiology')}
      adding={showAdd}
      onToggleAdd={() => setShowAdd((open) => !open)}
      form={
        <RadiologyUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      }
    >
      <RecordGrid min={460}>
        {rows.map((one) => (
          <RadiologyItem key={one._id} one={one} patient={patient} refetch={refetch} />
        ))}
      </RecordGrid>
    </ProfilePane>
  );
}
PatientRadiology.propTypes = { patient: PropTypes.object };
