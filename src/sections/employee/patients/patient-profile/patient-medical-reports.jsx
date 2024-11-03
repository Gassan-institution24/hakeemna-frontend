import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@mui/material';

import { useGetmedicalreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import MedicalReportItem from './items/medical-report-item';

export default function PatientMedicalReports({ patient }) {

  const { user } = useAuthContext();
  const { data, refetch } = useGetmedicalreports({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  return (
    <Container maxWidth="xl">
      {data?.map((one, idx) => (
        <MedicalReportItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientMedicalReports.propTypes = {
  patient: PropTypes.object,
};
