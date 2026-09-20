import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, Button, Tooltip, IconButton } from '@mui/material';

import { ConvertToHTML } from 'src/utils/convert-to-html';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { fDateTime, fDateAndTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFDatePicker } from 'src/components/hook-form';

import RecordCard, { RecordBlock } from 'src/sections/shared/patient-profile/record-card';

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
    <RecordCard
      icon="solar:chat-round-dots-bold-duotone"
      title={editting ? t('communication') : fDateAndTime(one?.date) || fDateTime(one.created_at)}
      subtitle={!editting ? fDateTime(one.created_at) : null}
      actions={
        <Tooltip title={editting ? t('cancel') : t('edit')}>
          <IconButton onClick={() => setEditting(!editting)}>
            <Iconify icon={editting ? 'mingcute:close-fill' : 'solar:pen-bold'} />
          </IconButton>
        </Tooltip>
      }
    >
      {editting ? (
        <FormProvider methods={methods}>
          <Stack gap={2}>
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
        <RecordBlock>{ConvertToHTML(one?.description)}</RecordBlock>
      )}
    </RecordCard>
  );
}
CommunicationItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
