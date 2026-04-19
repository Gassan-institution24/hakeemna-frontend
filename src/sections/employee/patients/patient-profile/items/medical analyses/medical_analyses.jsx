/* eslint-disable no-nested-ternary */
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';

import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicalAnalysis } from 'src/api/medical_analysis';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';

export default function MedicalAnalysisItem({ one, patient, refetch }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const isDelivered = Boolean(one?.delivered_at);
  const [showFiles, setShowFiles] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { medicalAnalysisData } = useGetMedicalAnalysis();
  const [previewFile, setPreviewFile] = useState(null);
  const [editing, setEditing] = useState(false);

  const schema = Yup.object().shape({
    medical_analysis: Yup.array().of(
      Yup.object().shape({
        medical_analysis: Yup.string().required(t('required field')),
        Doctor_Comments: Yup.string(),
      })
    ),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      medical_analysis: one.medical_analysis.map((m) => ({
        medical_analysis: m.medical_analysis._id,
        Doctor_Comments: m.Doctor_Comments,
      })),
    },
  });

  const { control, setValue, handleSubmit, watch } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medical_analysis',
  });

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(endpoints.medicalAnalysisPatient.one(patient?._id, id));
      enqueueSnackbar(t('deleted successfully'));
      refetch();
    } catch (e) {
      enqueueSnackbar(e?.arabic_message || e?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.patch(endpoints.medicalAnalysisPatient.one(patient?._id, one?._id), {
        medical_analysis: data.medical_analysis,
      });

      enqueueSnackbar(t('updated successfully!'));
      setEditing(false);
      refetch();
    } catch (e) {
      enqueueSnackbar(e?.arabic_message || e?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  });
  const downloadFile = async (fileUrl) => {
    try {
      const response = await axiosInstance.get(fileUrl, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      enqueueSnackbar('Download failed', { variant: 'error' });
    }
  };
  return (
    <Card sx={{ py: 3, px: 5, mb: 2 }}>
      {editing ? (
        <FormProvider methods={methods}>
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={2} alignItems="center">
                <Autocomplete
                  fullWidth
                  value={
                    medicalAnalysisData?.find(
                      (item) => item._id === watch(`medical_analysis.${index}.medical_analysis`)
                    ) || null
                  }
                  options={medicalAnalysisData || []}
                  onChange={(e, newValue) =>
                    setValue(`medical_analysis.${index}.medical_analysis`, newValue?._id, {
                      shouldValidate: true,
                    })
                  }
                  getOptionLabel={(option) =>
                    curLangAr ? option?.name_arabic || '' : option?.name_english || ''
                  }
                  renderInput={(params) => <TextField {...params} label={t('medical analysis')} />}
                />

                <TextField
                  fullWidth
                  label={t('doctor comment')}
                  {...methods.register(`medical_analysis.${index}.Doctor_Comments`)}
                />

                <IconButton color="error" onClick={() => remove(index)}>
                  <Iconify icon="mi:delete" />
                </IconButton>
              </Stack>
            ))}

            <Divider sx={{ mt: 2 }} />

            <Stack direction="row" justifyContent="flex-start">
              <Button
                color="success"
                startIcon={<Iconify icon="ri:add-line" />}
                onClick={() =>
                  append({
                    radiology: '',
                    Doctor_Comments: '',
                  })
                }
              >
                {t('add')}
              </Button>
            </Stack>

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={() => setEditing(false)}>{t('cancel')}</Button>
              <Button variant="contained" onClick={onSubmit}>
                {t('save')}
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {fDate(one.created_at)}
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => setEditing(true)}>
                <Iconify icon="lets-icons:edit-fill" />
              </IconButton>

              <IconButton color="error" onClick={() => handleDelete(one?._id)}>
                <Iconify icon="mdi:delete-outline" />
              </IconButton>

              {isDelivered && (
                <IconButton color="primary" onClick={() => setShowFiles(true)}>
                  <Iconify icon="mdi:file-eye-outline" />
                </IconButton>
              )}
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
            {one.medical_analysis?.map((med, indx) => (
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
        </>
      )}
      <Dialog open={showFiles} onClose={() => setShowFiles(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('uploaded files')}</DialogTitle>

        <DialogContent>
          {one?.file?.length > 0 ? (
            <Stack spacing={2}>
              {one.file.map((file, index) => (
                <Stack
                  key={index}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Typography variant="body2">{file.split('/').pop()}</Typography>

                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => setPreviewFile(file)}>
                      <Iconify icon="mdi:eye-outline" />
                    </IconButton>

                    <IconButton onClick={() => downloadFile(file)}>
                      <Iconify icon="mdi:download" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}

              <Divider />

              <Button
                variant="contained"
                startIcon={<Iconify icon="mdi:download-multiple" />}
                onClick={() => {
                  one.file.forEach((file) => downloadFile(file));
                }}
              >
                {t('download all')}
              </Button>
            </Stack>
          ) : (
            <Typography>{t('no files available')}</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowFiles(false)}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{previewFile?.split('/').pop()}</DialogTitle>

        <DialogContent dividers>
          {previewFile && /\.(jpg|jpeg|png|webp)$/i.test(previewFile) ? (
            <Box
              component="img"
              src={previewFile}
              sx={{
                width: '100%',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />
          ) : previewFile && /\.pdf$/i.test(previewFile) ? (
            <embed src={previewFile} type="application/pdf" width="100%" height="500px" />
          ) : (
            <Button variant="contained" onClick={() => downloadFile(previewFile)}>
              {t('download file')}
            </Button>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPreviewFile(null)}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

MedicalAnalysisItem.propTypes = {
  one: PropTypes.object,
  patient: PropTypes.object,
  refetch: PropTypes.func,
};
