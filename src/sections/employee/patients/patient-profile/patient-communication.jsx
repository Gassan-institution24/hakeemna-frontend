import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUSPCommunication } from 'src/api/uspcommunication';

import CommunicationItem from './items/communication-item';

export default function PatientCommunication({ patient }) {
  const { user } = useAuthContext();
  const { data, refetch } = useGetUSPCommunication({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });
  return (
    <Container maxWidth="xl">
      {data?.map((one, idx) => (
        <CommunicationItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientCommunication.propTypes = {
  patient: PropTypes.object,
};
