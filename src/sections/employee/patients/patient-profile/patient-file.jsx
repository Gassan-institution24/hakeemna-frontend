import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@mui/material';

import { useGetdoctorreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import FileItem from './items/file-item';

export default function PatientFile({ patient }) {
  const { user } = useAuthContext();
  const { data, refetch } = useGetdoctorreports({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });
  return (
    <Container maxWidth="xl">
      {data?.map((one, idx) => (
        <FileItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientFile.propTypes = {
  patient: PropTypes.object,
};
