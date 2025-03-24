import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetInstructions } from 'src/api/Instructions';

import InstructionItem from './items/instructions/instruction-item';
import InstructionUpload from './items/instructions/instruction-upload';

export default function PatientInstructions({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, refetch } = useGetInstructions({
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
          {showAdd ? t('X') : t('new instruction')}
        </Button>
      </Stack>
      {showAdd && (
        <InstructionUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
      {data?.map((one, idx) => (
        <InstructionItem key={idx} one={one} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientInstructions.propTypes = { patient: PropTypes.object };
