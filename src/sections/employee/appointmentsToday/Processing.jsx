import React from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { alpha } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
} from '@mui/lab';
import {
  Paper,
  Button,
  Dialog,
  Checkbox,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';
import { useGetPatientHistoryData, useGetOneEntranceManagement } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFUpload, RHFTextField } from 'src/components/hook-form';

export default function Processing() {
  const params = useParams();
  const { id } = params;
  const { Entrance } = useGetOneEntranceManagement(id);
  const { historyData } = useGetPatientHistoryData(Entrance?.patient?._id);

  // Separate state for each dialog
  const medicalReportDialog = useBoolean();
  const prescriptionDialog = useBoolean();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const oldMedicalReportsSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    file: Yup.array().required(),
    name: Yup.string().required('File name is required'),
    note: Yup.string().nullable(),
    agree: Yup.boolean().required(),
    specialty: Yup.string().required(),
  });

  const defaultValues = {
    date: '',
    file: [],
    name: '',
    note: '',
    patient: Entrance?.patient?._id,
  };
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });
  const {
    setValue,
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const TIMELINES = [
    {
      key: 1,
      title: `${Entrance?.patient?.name_english} medical history`,
      icon: historyData ? (
        <Iconify sx={{ color: '#00A76F' }} icon="icon-park-outline:correct" width={24} />
      ) : (
        <Iconify icon="eva:folder-add-fill" width={24} />
      ),
    },
    {
      key: 2,
      title: 'last activity',
      color: 'primary',
      icon: historyData ? (
        <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
      ) : (
        <Iconify icon="cil:room" width={24} />
      ),
    },
    {
      key: 3,
      title: 'Next activity',
      color: 'primary',
      icon: historyData ? (
        <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
      ) : (
        <Iconify icon="cil:room" width={24} />
      ),
    },
    {
      key: 4,
      title: 'prescription (optional)',
      color: 'secondary',
      icon: historyData ? (
        <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
      ) : (
        <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />
      ),
    },
    {
      key: 5,
      title: 'medical report (optional)',
      color: 'info',
      icon: historyData ? (
        <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
      ) : (
        <Iconify icon="streamline:checkup-medical-report-clipboard" width={23} />
      ),
    },
  ];

  const renderMedicalReport = (
    <>
      <Button variant="outlined" color="success" onClick={medicalReportDialog.onTrue} sx={{ mt: 1 }}>
        {t('Add medical report')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
        <FormProvider methods={methods}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {t('IMPORTANT')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              {curLangAr
                ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
                : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
            </Typography>
            <RHFTextField lang="en" name="name" label={t('File name*')} sx={{ mb: 2 }} />
            <Controller
              name="date"
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('Date of making the medical report*')}
                  sx={{ mb: 2 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
            <RHFUpload
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              multiple
            />
            <RHFTextField lang="en" name="note" label={t('More information')} />
          </DialogContent>
          <Checkbox
            size="small"
            name="agree"
            color="success"
            sx={{ position: 'relative', top: 5, left: 25 }}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              mt: { md: -2.5, xs: -2.3 },
              ml: curLangAr ? { md: -31, xs: -5 } : { md: -7.5, xs: 4 },
              typography: 'caption',
              textAlign: 'center',
              fontSize: { md: 12, xs: 10 },
            }}
          >
            {t('I have read and agreed to these ')}&nbsp;
            <Link underline="always" color="text.primary">
              {t('Terms of Service ')}&nbsp;
            </Link>
            {t('And the ')}&nbsp;
            <Link underline="always" color="text.primary">
              {t('Privacy Policy')}
            </Link>
            .
          </Typography>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={medicalReportDialog.onFalse}>
              {t('Cancel')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );

  const renderPrescription = (
    <>
      <Button variant="outlined" color="success" onClick={prescriptionDialog.onTrue} sx={{ mt: 1 }}>
        {t('Add prescription')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Dialog open={prescriptionDialog.value} onClose={prescriptionDialog.onFalse}>
        <FormProvider methods={methods}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {t('IMPORTANT')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              {curLangAr
                ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
                : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
            </Typography>
            <RHFTextField lang="en" name="name" label={t('File name*')} sx={{ mb: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={prescriptionDialog.onFalse}>
              {t('Cancel')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );

  return (
    <Timeline position="alternate">
      {TIMELINES.map((item) => (
        <TimelineItem key={item.key}>
          <TimelineSeparator>
            <TimelineDot color={item.color}>{item.icon}</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper
              sx={{
                p: 3,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
              }}
            >
              <Typography variant="subtitle2">{item.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.title === 'medical report (optional)' && renderMedicalReport}
                {item.title === 'prescription (optional)' && renderPrescription}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
