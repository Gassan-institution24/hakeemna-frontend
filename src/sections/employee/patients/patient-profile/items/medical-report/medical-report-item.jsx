import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import React, { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFUpload } from 'src/components/hook-form';

import RecordCard, {
  RecordBlock,
  RecordAttachments,
} from 'src/sections/shared/patient-profile/record-card';

import MedicalReportPDF from './MedicalReportPDF';

export default function MedicalReportItem({ one, refetch }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();
  const [editting, setEditting] = useState(false);

  const schema = Yup.object().shape({
    file: Yup.mixed(),
    description: Yup.string().required(),
  });

  const defaultValues = {
    file: one?.file || [],
    description: one?.description || null,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, setValue, watch, reset } = methods;

  const handleDrop = (acceptedFile) => {
    const oldFiles = watch('file');
    setValue('file', [...oldFiles, ...acceptedFile]);
  };
  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = watch('file').filter((file) => file !== inputFile);
      setValue('file', filtered);
    },
    [setValue, watch]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('description', data.description);

      const existingFiles = data.file.filter((f) => !(f instanceof File));
      formData.append('existingFiles', JSON.stringify(existingFiles));

      data.file
        .filter((f) => f instanceof File)
        .forEach((file) => {
          formData.append('file', file);
        });
      await axiosInstance.patch(endpoints.medicalreports.one(one?._id), formData);
      setEditting(false);
      refetch();
      // eslint-disable-next-line
      enqueueSnackbar(`${t('medical report')} ${t('added successfully')}`);
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
        variant: 'error',
      });
    }
  });
  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const openPdfDialog = (report) => {
    setSelectedReport(report);
    setOpenPreview(true);
  };
  return (
    <RecordCard
      icon="solar:document-medicine-bold-duotone"
      color="success"
      title={editting ? t('medical report') : fDate(one.created_at)}
      footer={!editting ? <RecordAttachments files={one.file} fallbackLabel={t('file')} /> : null}
      actions={
        editting ? (
          <Tooltip title={t('cancel')}>
            <IconButton onClick={() => setEditting(false)}>
              <Iconify icon="mingcute:close-fill" />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Box key={currentLang.value}>
              <Tooltip title={t('Print')}>
                <IconButton color="primary" onClick={() => openPdfDialog(one)}>
                  <Iconify icon="solar:printer-minimalistic-bold" />
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title={t('edit')}>
              <IconButton
                onClick={() => {
                  reset({ file: one?.file || [], description: one?.description || '' });
                  setEditting(true);
                }}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    >
      {editting ? (
        <FormProvider methods={methods}>
          {/* The title and the cancel button are the card header's job now. */}
          <Stack gap={2}>
            <RHFEditor
              lang="en"
              name="description"
              label={t('description')}
              sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
            />
            <RHFUpload
              multiple
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={(file) => handleDrop(file)}
              onRemove={handleRemoveFile}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={onSubmit}>
                {t('save')}
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      ) : (
        <RecordBlock>
          <Box
            sx={{ textTransform: 'none' }}
            dangerouslySetInnerHTML={{ __html: one.description }}
          />
        </RecordBlock>
      )}
      {/* PDF PREVIEW DIALOG */}
      {openPreview && selectedReport && (
        <MedicalReportPDF
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          report={selectedReport}
        />
      )}
    </RecordCard>
  );
}
MedicalReportItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
