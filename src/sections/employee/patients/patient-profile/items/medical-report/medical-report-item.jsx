import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import React, { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Card, Link, Stack, Button, Typography, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFUpload } from 'src/components/hook-form';

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

  return (
    <Card sx={{ py: 3, px: 5, mb: 2 }}>
      {editting ? (
        <FormProvider methods={methods}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
            <IconButton onClick={() => setEditting(false)}>
              <Iconify icon="mingcute:close-fill" />
            </IconButton>
          </Stack>
          <Stack gap={2}>
            <Typography variant="subtitle1">{t('medical report')}</Typography>
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
        <>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
            <Typography variant="subtitle2">{fDate(one.created_at)}</Typography>
            <IconButton onClick={() => setEditting(true)}>
              <Iconify icon="lets-icons:edit-fill" />
            </IconButton>
          </Stack>
          <Stack gap={1} mt={1} ml={1}>
            <Typography
              textTransform="none"
              variant="body2"
              dangerouslySetInnerHTML={{ __html: one.description }}
            />
            <Stack direction="row" gap={1}>
              {one.file?.map((file) => (
                <Link href={file} target="_blank" sx={{ fontSize: 14 }}>
                  {file.name || t('file')}
                </Link>
              ))}
            </Stack>
          </Stack>
        </>
      )}
    </Card>
  );
}
MedicalReportItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
