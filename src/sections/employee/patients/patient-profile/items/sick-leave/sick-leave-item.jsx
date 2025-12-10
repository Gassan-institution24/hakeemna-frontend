import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Card, Stack, Button, Typography, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { ConvertToHTML } from 'src/utils/convert-to-html';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFDatePicker } from 'src/components/hook-form';

import SickLeavePDF from "./SickLeavePDF";

export default function SickLeaveItem({ one, refetch }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();
  const [editting, setEditting] = useState(false);

  const schema = Yup.object().shape({
    Medical_sick_leave_start: Yup.date().required(),
    Medical_sick_leave_end: Yup.date().required(),
    description: Yup.string().required(),
  });

  const defaultValues = {
    Medical_sick_leave_start: one?.Medical_sick_leave_start || null,
    Medical_sick_leave_end: one?.Medical_sick_leave_end || null,
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
      await axiosInstance.patch(endpoints.sickleave.onee(one?._id), data);
      setEditting(false);
      refetch();
      // eslint-disable-next-line
      enqueueSnackbar(`${t('sick leave')} ${t('added successfully')}`);
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
            <Typography variant="subtitle1">{t('sick leave')}</Typography>
            <RHFDatePicker name="Medical_sick_leave_start" label={t('start date')} />
            <RHFDatePicker name="Medical_sick_leave_end" label={t('end date')} />
            <RHFEditor
              lang="en"
              name="description"
              label={t('description')}
              sx={{ textTransform: 'lowercase' }}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => onSubmit('sick_leave')}>
                {t('save')}
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{fDate(one.created_at)}</Typography>

            <Stack direction="row" gap={1}>
                <PDFDownloadLink
                  document={<SickLeavePDF sickleave={one} />}
                  fileName="SickLeave.pdf"
                  style={{ textDecoration: "none" }}
                >
                  {({ loading }) => (
                    <IconButton color="primary" disabled={loading}>
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  )}
                </PDFDownloadLink>

              <IconButton onClick={() => setEditting(true)}>
                <Iconify icon="lets-icons:edit-fill" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack mt={1} ml={1} gap={1}>
            <Stack direction="row" gap={3}>
              <Typography variant="body2" color="text.disabled">
                {t('start date')}
              </Typography>
              <Typography variant="body2">{fDate(one?.Medical_sick_leave_start)}</Typography>
            </Stack>
            <Stack direction="row" gap={3}>
              <Typography variant="body2" color="text.disabled">
                {t('end date')}
              </Typography>
              <Typography variant="body2">{fDate(one?.Medical_sick_leave_end)}</Typography>
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
SickLeaveItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
