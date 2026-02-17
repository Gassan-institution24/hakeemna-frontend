import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { Box, Card, Stack, Button, Container, Typography, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicalAnalysisPatient } from 'src/api/medical_analysis_patient';

import Iconify from 'src/components/iconify';

import MedicalAnalysesUpload from './items/medical analyses/medical_analyses-upload';

export default function PatientMedicalAnalyses({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const { medicalAnalysisData, refetch } = useGetMedicalAnalysisPatient(patient?._id);

  const [showAdd, setShowAdd] = React.useState(false);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(endpoints.medicalAnalysisPatient.one(patient?._id, id));
      enqueueSnackbar(`${t('medical analysis')} ${t('deleted successfully')}`);
      refetch();
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  };
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

      {medicalAnalysisData?.map((one, idx) => (
        <Card key={idx} sx={{ py: 3, px: 5, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {fDate(one.created_at)}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              {/* DELETE BUTTON */}
              <IconButton color="error" onClick={() => handleDelete(one?._id)}>
                <Iconify icon="mdi:delete-outline" />
              </IconButton>
            </Stack>
          </Stack>

          <Box
            mt={1}
            ml={1}
            rowGap={0.5}
            columnGap={3}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          >
            <Typography variant="body2" color="text.disabled">
              {t('medical analysis')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('group')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('doctor comment')}
            </Typography>
            {/* ANALYSES LIST */}
            {one.medical_analyses?.map((med, indx) => (
              <React.Fragment key={indx}>
                <Typography variant="body2">{med?.medical_analysis?.name_english}</Typography>

                <Typography variant="body2">
                  {med?.medical_analysis?.medical_analysis_group}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {med.Doctor_Comments}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
        </Card>
      ))}
    </Container>
  );
}
PatientMedicalAnalyses.propTypes = { patient: PropTypes.object };
