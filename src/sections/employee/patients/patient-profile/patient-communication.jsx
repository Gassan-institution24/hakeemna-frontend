import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSPCommunication } from 'src/api/uspcommunication';

import CommunicationItem from './items/communication/communication-item';
import CommunicationUpload from './items/communication/communication-upload';

export default function PatientCommunication({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, refetch } = useGetUSPCommunication({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);
  return (
    <Container sx={{ backgroundColor: 'background.neutral', py: 3 }} maxWidth="xl">
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? t('X') : t('new communication')}
        </Button>
      </Stack>
      {showAdd && (
        <CommunicationUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
      {data?.map((one, idx) => (
        <CommunicationItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientCommunication.propTypes = { patient: PropTypes.object };
