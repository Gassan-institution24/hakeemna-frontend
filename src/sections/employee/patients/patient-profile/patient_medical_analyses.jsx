import React from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useGetMedicalAnalysisPatient } from 'src/api/medical_analysis_patient';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import MedicalAnalysisItem from './items/medical analyses/medical_analyses';
import MedicalAnalysesUpload from './items/medical analyses/medical_analyses-upload';

export default function PatientMedicalAnalyses({ patient }) {
  const { t } = useTranslate();

  const { medicalAnalysisData, loading, error, refetch } = useGetMedicalAnalysisPatient(
    patient?._id
  );

  const [showAdd, setShowAdd] = React.useState(false);

  const rows = Array.isArray(medicalAnalysisData) ? medicalAnalysisData : [];

  return (
    <ProfilePane
      icon="solar:test-tube-bold-duotone"
      title={t('Lab Results')}
      count={rows.length}
      loading={loading}
      error={error}
      isEmpty={!rows.length}
      emptyTitle={t('No lab results')}
      emptyDescription={t('Laboratory analyses recorded for this patient appear here.')}
      addLabel={t('New Lab Result')}
      adding={showAdd}
      onToggleAdd={() => setShowAdd((open) => !open)}
      form={
        <MedicalAnalysesUpload
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
          <MedicalAnalysisItem key={one._id} one={one} patient={patient} refetch={refetch} />
        ))}
      </RecordGrid>
    </ProfilePane>
  );
}
PatientMedicalAnalyses.propTypes = { patient: PropTypes.object };
