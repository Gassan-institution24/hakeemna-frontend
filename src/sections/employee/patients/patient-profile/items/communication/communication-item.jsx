import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Card, Stack, Button, Typography, IconButton } from '@mui/material';

import { fDate, fDateAndTime, fDateTime } from 'src/utils/format-time';
import { ConvertToHTML } from 'src/utils/convert-to-html';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFDatePicker } from 'src/components/hook-form';

export default function CommunicationItem({ one, refetch }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();
  const [editting, setEditting] = useState(false);

  const schema = Yup.object().shape({
    date: Yup.date().required(),
    description: Yup.string().required(),
  });

  const defaultValues = {
    date: one?.date || null,
    description: one?.description || null,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.patch(endpoints.uspcommunication.onee(one?._id), data);
      setEditting(false);
      refetch();
      // eslint-disable-next-line
      enqueueSnackbar(`${t('communication')} ${t('added successfully')}`);
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
            <Typography variant="subtitle1">{t('communication')}</Typography>
            <RHFDatePicker name="date" label={t('date')} />
            <RHFEditor
              lang="en"
              name="description"
              label={t('description')}
              sx={{ textTransform: 'lowercase' }}
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
            <Typography variant="subtitle2">{fDateTime(one.created_at)}</Typography>
            <IconButton onClick={() => setEditting(true)}>
              <Iconify icon="lets-icons:edit-fill" />
            </IconButton>
          </Stack>
          {/* <Typography variant='subtitle2'>{t('prescription')}:</Typography> */}
          <Stack mt={1} ml={1} gap={1}>
            <Stack direction="row" gap={3}>
              <Typography variant="body2" color="text.disabled">
                {t('date')}
              </Typography>
              <Typography variant="body2">{fDateAndTime(one?.date)}</Typography>
            </Stack>
            <Typography variant="body2" color="text.disabled">
              {t('description')}
            </Typography>
            <Typography variant="body2">{ConvertToHTML(one?.description)}</Typography>
          </Stack>
        </>
      )}
    </Card>
  );
}
CommunicationItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
