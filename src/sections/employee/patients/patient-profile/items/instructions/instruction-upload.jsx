import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Box, Card, Stack, Radio, Button, Typography } from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeAdjustabledocument } from 'src/api/adjustabledocument';

import FormProvider from 'src/components/hook-form/form-provider';

export default function InstructionUpload({ patient, refetch }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const [selectedInstruction, setSelectedInstruction] = useState('');

  const { adjustabledocument } = useGetEmployeeAdjustabledocument(user?.employee?._id);

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const methods = useForm();

  const handleSubmit = async (table) => {
    try {
      if (!selectedInstruction) {
        enqueueSnackbar(t('no data to submit'), { variant: 'error' });
        return;
      }
      await axiosInstance.post(`/api/instructions`, {
        patient: patient?.patient?._id,
        unit_service_patient: patient?._id,
        adjustable_documents: selectedInstruction,
        unit_service: employee?.unit_service?._id,
      });
      setSelectedInstruction('');
      refetch();
      enqueueSnackbar(t('instruction saved successfully'), { variant: 'success' });
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods}>
      {adjustabledocument?.length > 0 && (
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack gap={2} height="100%">
            <Typography variant="subtitle1">{t('Instructions')}</Typography>
            <Stack gap={1} sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                {adjustabledocument?.map((document) => (
                  <Box
                    key={document?._id}
                    onClick={() => setSelectedInstruction(document?._id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        backgroundColor: 'primary.lighter',
                        paddingX: 4,
                        paddingY: 1,
                        borderRadius: 2,
                        border: selectedInstruction === document?._id ? '1px solid #00A76F' : '',
                      }}
                    >
                      <Typography>{document?.title}</Typography>
                      <Typography>{document?.applied}</Typography>
                      <Radio
                        checked={selectedInstruction === document?._id}
                        value={document?._id}
                        onChange={() => setSelectedInstruction(document?._id)}
                      />
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Stack>
            <div style={{ flex: 1 }} />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => handleSubmit('instructions')}>
                {t('save')}
              </Button>
            </Stack>
          </Stack>
        </Card>
      )}
    </FormProvider>
  );
}
InstructionUpload.propTypes = { patient: PropTypes.object, refetch: PropTypes.func };
