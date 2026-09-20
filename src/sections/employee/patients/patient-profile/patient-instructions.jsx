import React from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetInstructions } from 'src/api/Instructions';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import InstructionItem from './items/instructions/instruction-item';
import InstructionUpload from './items/instructions/instruction-upload';

export default function PatientInstructions({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, loading, error, refetch } = useGetInstructions({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);

  const rows = Array.isArray(data) ? data : [];

  return (
    <ProfilePane
      icon="solar:clipboard-text-bold-duotone"
      title={t('Patient Instructions')}
      count={rows.length}
      loading={loading}
      error={error}
      isEmpty={!rows.length}
      emptyTitle={t('No instructions given')}
      emptyDescription={t('Care instructions written for this patient appear here.')}
      addLabel={t('New Instruction')}
      adding={showAdd}
      onToggleAdd={() => setShowAdd((open) => !open)}
      form={
        <InstructionUpload
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
          <InstructionItem key={one._id} one={one} refetch={refetch} />
        ))}
      </RecordGrid>
    </ProfilePane>
  );
}
PatientInstructions.propTypes = { patient: PropTypes.object };
