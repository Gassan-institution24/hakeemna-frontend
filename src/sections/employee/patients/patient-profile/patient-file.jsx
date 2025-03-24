import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetdoctorreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import FileItem from './items/file/file-item';
import PatientFileUpload from './items/file/file-upload';

export default function PatientFile({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, refetch } = useGetdoctorreports({
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
          {showAdd ? t('X') : t('new information')}
        </Button>
      </Stack>
      {showAdd && (
        <PatientFileUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
      {data?.map((one, idx) => (
        <FileItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientFile.propTypes = { patient: PropTypes.object };
