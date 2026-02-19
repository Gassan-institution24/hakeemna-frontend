import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetMedicalAnalysisPatient } from 'src/api/medical_analysis_patient';

import MedicalAnalysisItem from './items/medical analyses/medical_analyses';
import MedicalAnalysesUpload from './items/medical analyses/medical_analyses-upload';

export default function PatientMedicalAnalyses({ patient }) {
  const { t } = useTranslate();

  const { medicalAnalysisData, refetch } = useGetMedicalAnalysisPatient(patient?._id);

  const [showAdd, setShowAdd] = React.useState(false);
  return (
    <Container sx={{ py: 3, backgroundColor: 'background.neutral' }} maxWidth="xl">
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? t('X') : t('new medical analysis')}
        </Button>
      </Stack>
      {showAdd && (
        <MedicalAnalysesUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}

      {medicalAnalysisData?.map((one) => (
        <MedicalAnalysisItem key={one._id} one={one} patient={patient} refetch={refetch} />
      ))}
    </Container>
  );
}
PatientMedicalAnalyses.propTypes = { patient: PropTypes.object };
