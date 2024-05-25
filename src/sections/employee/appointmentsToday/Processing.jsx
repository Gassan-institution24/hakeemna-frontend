import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Table from '@mui/material/Table';
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
  Card,
  Paper,
  Button,
  Dialog,
  MenuItem,
  TableRow,
  Checkbox,
  TableCell,
  TableBody,
  TableHead,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { fMonth } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicines, useGetPatientHistoryData, useGetOneEntranceManagement } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';

export default function Processing() {
  const params = useParams();
  const { id } = params;
  const { medicines } = useGetMedicines();
  const { user } = useAuthContext();
  const { Entrance } = useGetOneEntranceManagement(id);
  const { historyData } = useGetPatientHistoryData(Entrance?.patient?._id);
  const medicalReportDialog = useBoolean();
  const prescriptionDialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    Num_days: Yup.number(),
    medicines: Yup.string(),
    Start_time: Yup.date(),
    End_time: Yup.date(),
    Frequency_per_day: Yup.string(),
    Doctor_Comments: Yup.string(),
    description: Yup.string(),
  });

  const defaultValues = {
    employee: user?.employee?._id,
    patient: Entrance?.patient?._id,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(PrescriptionsSchema),
    defaultValues,
  });
  const {
    watch,
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;
  console.log(watch(), 'data');
  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/drugs', data);
      await axiosInstance.post('/api/examination', data);
      enqueueSnackbar('prescription uploaded successfully', { variant: 'success' });
      prescriptionDialog.onFalse();
      medicalReportDialog.onFalse();
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };
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
      icon: <Iconify icon="cil:room" width={24} />
    },
    {
      key: 3,
      title: 'Next activity',
      color: 'primary',
      icon:<Iconify icon="cil:room" width={24} />
    },
    {
      key: 4,
      title: 'prescription (optional)',
      color: 'secondary',
      icon: <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />
    },
    {
      key: 5,
      title: 'medical report (optional)',
      color: 'info',
      icon: <Iconify icon="streamline:checkup-medical-report-clipboard" width={23} />,
    },
  ];

  const renderMedicalReport = (
    <>
      <Button
        variant="outlined"
        color="success"
        onClick={medicalReportDialog.onTrue}
        sx={{ mt: 1 }}
      >
        {t('Add medical report')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {t('IMPORTANT')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              {curLangAr
                ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
                : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
            </Typography>
            {/* <RHFTextField lang="en" name="name" label={t('File name*')} sx={{ mb: 2 }} /> */}
            {/* <Controller
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
            /> */}
            {/* <RHFUpload
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              multiple
            /> */}
            <RHFTextField lang="en" name="description" label={t('description')} />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={medicalReportDialog.onFalse}>
              {t('Cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('Upload')}
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
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {t('IMPORTANT')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              {curLangAr
                ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
                : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
            </Typography>
            <RHFSelect
              label={t('medicine*')}
              fullWidth
              name="medicines"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 2 }}
            >
              {medicines?.map((test, idx) => (
                <MenuItem lang="ar" value={test?._id} key={idx} sx={{ mb: 1 }}>
                  {test?.trade_name}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              lang="en"
              name="Frequency_per_day"
              label={t('Frequency pe day')}
              sx={{ mb: 2 }}
            />
            <Controller
              name="Start_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('Start time*')}
                  // maxDate={maxDate}
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
            <Controller
              name="End_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('End time*')}
                  // maxDate={maxDate}
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
            <RHFTextField lang="en" name="Num_days" label={t('Num days')} sx={{ mb: 2 }} />
            <RHFTextField
              lang="en"
              name="Doctor_Comments"
              label={t('Doctor Comments')}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={prescriptionDialog.onFalse}>
              {t('Cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );

  const renderHistory = (
    <Card sx={{ mt: 2 }}>
      <TableContainer sx={{ mb: 2, maxHeight: 200 }}>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('Date')}</TableCell>
              <TableCell>{t('Subject')}</TableCell>
              <TableCell>{t('Info')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody sx={{ maxHeight: 200 }}>
            {historyData?.map(
              (data, i) =>
                data?.status === 'active' && (
                  <TableRow key={i}>
                    <TableCell>{fMonth(data?.created_at)}</TableCell>
                    <TableCell>{curLangAr ? data?.name_arabic : data?.name_english}</TableCell>
                    <TableCell>{curLangAr ? data?.sub_arabic : data?.sub_english}</TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
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
                {item.title === `${Entrance?.patient?.name_english} medical history` &&
                  renderHistory}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
