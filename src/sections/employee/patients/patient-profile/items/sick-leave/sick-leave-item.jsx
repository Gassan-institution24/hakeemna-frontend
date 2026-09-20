import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { ConvertToHTML } from 'src/utils/convert-to-html';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFDatePicker } from 'src/components/hook-form';

import RecordCard, {
  RecordStat,
  RecordBlock,
} from 'src/sections/shared/patient-profile/record-card';

import PdfPreviewDialogPrescriptionPDF from './SickLeavePDF';

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

  const { handleSubmit, reset } = methods;

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
  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const openPdfDialog = (report) => {
    setSelectedReport(report);
    setOpenPreview(true);
  };
  const htmlToPlainText = (html) => {
    if (!html) return '';

    // 1️⃣ decode HTML entities
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    const decoded = txt.value;

    // 2️⃣ remove html tags
    return decoded.replace(/<[^>]*>/g, '').trim();
  };


  const handleEdit = () => {
    reset({
      Medical_sick_leave_start: one?.Medical_sick_leave_start || null,
      Medical_sick_leave_end: one?.Medical_sick_leave_end || null,
      description: htmlToPlainText(one?.description),
    });
    setEditting(true);
  };

  // The substance of a sick leave is how long it runs, and nothing on the card
  // used to say so -- you had to subtract two dates yourself.
  const days = (() => {
    const from = one?.Medical_sick_leave_start && new Date(one.Medical_sick_leave_start);
    const to = one?.Medical_sick_leave_end && new Date(one.Medical_sick_leave_end);
    if (!from || !to || Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
    return Math.max(1, Math.round((to - from) / 86400000) + 1);
  })();

  return (
    <RecordCard
      icon="solar:bed-bold-duotone"
      color="info"
      title={editting ? t('sick leave') : fDate(one.created_at)}
      subtitle={
        !editting && one?.Medical_sick_leave_start
          ? // An en dash, not an arrow: an arrow would point the wrong way in Arabic.
            `${fDate(one.Medical_sick_leave_start)} \u2013 ${fDate(one.Medical_sick_leave_end)}`
          : null
      }
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
              <IconButton onClick={handleEdit}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </>
        )
      }
    >
      {editting ? (
        <FormProvider methods={methods}>
          <Stack gap={2}>
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
        <Stack gap={2}>
          {days !== null && (
            <RecordStat value={days} unit={t('days')} label={t('duration')} color="info.main" />
          )}

          {!!one?.description && (
            <RecordBlock>{ConvertToHTML(one?.description)}</RecordBlock>
          )}
        </Stack>
      )}

      <PdfPreviewDialogPrescriptionPDF
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </RecordCard>
  );
}
SickLeaveItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
