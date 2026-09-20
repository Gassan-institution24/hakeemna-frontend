import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import React, { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Chip, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFUpload } from 'src/components/hook-form';

import RecordCard, {
  RecordBlock,
  RecordAttachments,
} from 'src/sections/shared/patient-profile/record-card';

export default function FileItem({ one, refetch }) {
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

  const { handleSubmit, setValue, watch } = methods;

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
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        }
        formData.append(key, data[key]);
      });
      await axiosInstance.patch(endpoints.doctorreport.one(one?._id), formData);
      setEditting(false);
      refetch();
      // eslint-disable-next-line
      enqueueSnackbar(`${t('patient file')} ${t('added successfully')}`);
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
        variant: 'error',
      });
    }
  });

  const isDentalChartLog = one.source === 'dental_chart';

  return (
    <RecordCard
      icon={
        isDentalChartLog ? 'solar:health-bold-duotone' : 'solar:folder-with-files-bold-duotone'
      }
      color={isDentalChartLog ? 'info' : 'primary'}
      title={editting ? t('patient record') : fDate(one.created_at)}
      footer={!editting ? <RecordAttachments files={one.file} fallbackLabel={t('file')} /> : null}
      badge={
        isDentalChartLog ? (
          <Chip
            label={one.name || t('dental chart log')}
            size="small"
            color="info"
            sx={{ fontWeight: 600, height: 24 }}
          />
        ) : null
      }
      actions={
        // A dental chart log is written by the chart, not by hand, so it has no
        // edit affordance at all.
        // eslint-disable-next-line no-nested-ternary
        editting ? (
          <Tooltip title={t('cancel')}>
            <IconButton onClick={() => setEditting(false)}>
              <Iconify icon="mingcute:close-fill" />
            </IconButton>
          </Tooltip>
        ) : !isDentalChartLog ? (
          <Tooltip title={t('edit')}>
            <IconButton onClick={() => setEditting(true)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        ) : null
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
    </RecordCard>
  );
}
FileItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
