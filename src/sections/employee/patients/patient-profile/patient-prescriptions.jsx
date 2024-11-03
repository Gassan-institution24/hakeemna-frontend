import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { Box, Card, Stack, Container, Typography, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetPrescription } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function PatientPrescriptions({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar()

  const { user } = useAuthContext();
  const { prescriptionData, refetch } = useGetPrescription({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
    populate: { path: 'medicines', populate: 'medicines' },
  });

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(endpoints.prescription.one(id))
      enqueueSnackbar(`${t('prescription')} ${t('deleted successfully')}`);
      refetch()
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
        variant: 'error',
      });
    }
  }
  return (
    <Container maxWidth="xl">
      {prescriptionData?.map((one, idx) => (
        <Card key={idx} sx={{ py: 3, px: 5, mb: 2 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems='center'>
            <Typography variant="subtitle2">{fDate(one.created_at)}</Typography>
            <IconButton color='error' onClick={() => handleDelete(one?._id)}><Iconify icon='mdi:delete-outline' /></IconButton>
          </Stack>
          <Box
            mt={1}
            ml={1}
            rowGap={0.5}
            columnGap={4}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(4, 1fr)',
            }}
          >
            <Typography variant="body2" color="text.disabled">
              {t('trade name')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('frequently')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('start date')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('end date')}
            </Typography>
            {one.medicines?.map((medicine, indx) => (
              <>
                <Typography variant="body2">
                  {medicine?.medicines?.trade_name} - {medicine?.medicines?.concentration}
                </Typography>
                <Typography variant="body2">{medicine?.Frequency_per_day}</Typography>
                <Typography variant="body2">{fDate(medicine?.Start_time)}</Typography>
                <Typography variant="body2">{fDate(medicine?.End_time)}</Typography>
              </>
            ))}
          </Box>
        </Card>
      ))}
    </Container>
  );
}
PatientPrescriptions.propTypes = {
  patient: PropTypes.object,
};
