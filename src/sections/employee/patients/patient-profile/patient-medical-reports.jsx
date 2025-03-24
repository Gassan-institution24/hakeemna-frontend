import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetmedicalreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import MedicalReportItem from './items/medical-report/medical-report-item';
import MedicalReportUpload from './items/medical-report/medical-report-upload';

export default function PatientMedicalReports({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, refetch } = useGetmedicalreports({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);

  return (
    <Container sx={{ py: 3, backgroundColor: 'background.neutral' }} maxWidth="xl">
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? t('X') : t('new medical report')}
        </Button>
      </Stack>
      {showAdd && (
        <MedicalReportUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
      {data?.map((one, idx) => (
        <MedicalReportItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientMedicalReports.propTypes = { patient: PropTypes.object };
