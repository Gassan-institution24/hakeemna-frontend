import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetRadiologyPatient } from 'src/api/radiology_patient';

import RadiologyItem from './items/radiology/RadiologyItem';
import RadiologyUpload from './items/radiology/radiology-upload';

export default function PatientRadiology({ patient }) {
  const { t } = useTranslate();

  const { radiologyData, refetch } = useGetRadiologyPatient(patient?._id);

  const [showAdd, setShowAdd] = React.useState(false);

  return (
    <Container sx={{ py: 3, backgroundColor: 'background.neutral' }} maxWidth="xl">
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? t('X') : t('new radiology')}
        </Button>
      </Stack>
      {showAdd && (
        <RadiologyUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
      {radiologyData?.map((one) => (
        <RadiologyItem key={one._id} one={one} patient={patient} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientRadiology.propTypes = { patient: PropTypes.object };
