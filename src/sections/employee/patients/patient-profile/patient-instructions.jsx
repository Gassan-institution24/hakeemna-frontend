import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useGetInstructions } from 'src/api/Instructions';

import InstructionItem from './items/instructions/instruction-item';
import InstructionUpload from './items/instructions/instruction-upload';

export default function PatientInstructions({ patient }) {
  const { user } = useAuthContext();
  const { data, refetch } = useGetInstructions({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  return (
    <Container sx={{ py: 3, backgroundColor: 'background.neutral' }} maxWidth="xl">
      <InstructionUpload patient={patient} />
        {data?.map((one, idx) => (
          <InstructionItem key={idx} one={one} refetch={refetch} />
        ))}
    </Container>
  );
}
PatientInstructions.propTypes = {
  patient: PropTypes.object,
};
