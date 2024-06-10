import * as Yup from 'yup';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
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
  TableCell,
  TableBody,
  TableHead,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { fMonth } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetMedicines,
  useGetPatientHistoryData,
  useGetOneEntranceManagement,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import CheckList from './checkList';
import SickLeave from './sickLeave';

export default function Processing() {
  const params = useParams();
  const { id } = params;
  const { medicinesData } = useGetMedicines();
  const { user } = useAuthContext();
  const { Entrance, refetch } = useGetOneEntranceManagement(id);
  const { data } = useGetPatient(Entrance?.patient?._id);
  const { historyData } = useGetPatientHistoryData(Entrance?.patient?._id);
  const medicalReportDialog = useBoolean();
  const prescriptionDialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [filterforspecialties, setFilterforspecialties] = useState();
  const [itemsToShow, setItemsToShow] = useState(2);
  const router = useRouter();
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
    department: Yup.string(),
    Drugs_report: Yup.string(),
    medical_report: Yup.string(),
    Medical_sick_leave_start: Yup.date(),
    Medical_sick_leave_end: Yup.date(),
  });
  const defaultValues = {
    employee: user?.employee?._id,
    patient: Entrance?.patient?._id,
    service_unit: Entrance?.service_unit,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(PrescriptionsSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const watchStartTime = watch('Start_time');
  const watchEndTime = watch('End_time');

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
    });
  }, [user, Entrance, reset]);

  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      const start = new Date(watchStartTime);
      const end = new Date(watchEndTime);
      const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setValue('Num_days', difference > 0 ? difference : 0);
    }
  }, [watchStartTime, watchEndTime, setValue]);

  const onSubmit = async (submitdata) => {
    try {
      if (medicalReportDialog.value) {
        await axiosInstance.post('/api/examination', submitdata);
        await axiosInstance.patch(`/api/entrance/${id}`, {
          medical_report_status: true,
        });
        enqueueSnackbar('prescription uploaded successfully', { variant: 'success' });
        refetch();
        medicalReportDialog.onFalse();
        reset();
      }
      if (prescriptionDialog.value) {
        await axiosInstance.post('/api/drugs', submitdata);
        await axiosInstance.patch(`/api/entrance/${id}`, {
          Drugs_report_status: true,
        });
        enqueueSnackbar('prescription uploaded successfully', { variant: 'success' });
        refetch();
        prescriptionDialog.onFalse();
        reset();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEndAppointment = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
        Patient_attended: true,
        wating: false,
      });
      await axiosInstance.patch(`/api/appointments/${entrance?.appointmentId}`, {
        finished_or_not: true,
      });
      enqueueSnackbar('appointment finished', { variant: 'success' });
      router.push(paths.employee.appointmentsToday);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('no', { variant: 'error' });
    }
  };
  const dataFiltered = applyFilter({
    inputData: historyData,
    filterforspecialties,
  });
  const TIMELINES = [
    {
      key: 1,
      title: (
        <>
          {`${Entrance?.patient?.name_english} medical history`}
          <TextField
            onChange={(e) => setFilterforspecialties(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Search details"
            sx={{ ml: 2, mb: 2 }}
          />
        </>
      ),
      color: 'primary',
      icon: dataFiltered ? (
        <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
      ) : (
        <Iconify icon="eva:folder-add-fill" width={24} />
      ),
    },
    {
      key: 2,
      title: (
        <>
          last activity <br />
          Dr message:
          <Typography>the patient need a surgery now</Typography>
        </>
      ),
      color: 'info',
      icon: <Iconify icon="bi:door-closed" width={23} />,
    },
    {
      key: 3,
      title: (
        <>
          <span
            style={{ backgroundColor: '#22C55E', color: 'white', padding: 6, borderRadius: 10 }}
          >
            Doctor Check List
          </span>
          <CheckList />
        </>
      ),
      color: 'primary',
      icon: <Iconify icon="octicon:checklist-16" width={23} />,
    },
    {
      key: 4,
      title: (
        <>
          Next activity <br />
          <Button
            onClick={() => alert('test')}
            variant="contained"
            sx={{ bgcolor: 'success.main', mr: 1, mt: 1 }}
          >
            wating
          </Button>
          <Button
            onClick={() => alert('test')}
            variant="contained"
            disabled
            sx={{ bgcolor: 'success.main', mr: 1, mt: 1 }}
          >
            surgery
          </Button>
          <Button
            onClick={() => handleEndAppointment(Entrance)}
            variant="contained"
            sx={{ bgcolor: 'error.main', mt: 1 }}
          >
            end appointment
          </Button>
        </>
      ),
      color: 'info',
      icon: <Iconify icon="cil:room" width={24} />,
    },
    {
      key: 5,
      title: 'medical report (optional)',
      color: 'primary',

      icon:
        Entrance?.medical_report_status === true ? (
          <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
        ) : (
          <Iconify icon="streamline:checkup-medical-report-clipboard" width={23} />
        ),
    },
    {
      key: 6,
      title: 'prescription (optional)',
      color: 'info',
      icon:
        Entrance?.Drugs_report_status === true ? (
          <Iconify sx={{ color: '#fff' }} icon="icon-park-outline:correct" width={24} />
        ) : (
          <Iconify icon="material-symbols-light:prescriptions-outline" width={24} />
        ),
    },
    {
      key: 7,
      title: (
        <>
          sick leave (optional) <br />
          <SickLeave patient={data} />
        </>
      ),
      color: 'primary',
      icon: <Iconify icon="pepicons-pencil:leave" width={24} />,
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
              {medicinesData?.map((test, idx) => (
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
            <RHFTextField lang="en" name="Num_days" label={t('Number of days')} sx={{ mb: 2 }} />

            <Controller
              name="Start_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('Start time*')}
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
    <Card>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{t('Date')}</TableCell>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Subject')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataFiltered?.slice(0, itemsToShow).map(
              (historydata, i) =>
                historydata?.status === 'active' && (
                  <TableRow key={i}>
                    <TableCell>{fMonth(historydata?.created_at)}</TableCell>
                    <TableCell>
                      {curLangAr ? historydata?.name_arabic : historydata?.name_english}
                    </TableCell>
                    <TableCell>
                      {curLangAr ? historydata?.sub_arabic : historydata?.sub_english}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
        {dataFiltered?.length > itemsToShow && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setItemsToShow(itemsToShow + itemsToShow)}
            sx={{ m: 2 }}
          >
            {t('Load More')}
          </Button>
        )}
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
                {item.key === 1 && renderHistory}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
function normalizeArabicText(text) {
  // Normalize Arabic text by replacing 'أ' with 'ا'
  return text.replace(/أ/g, 'ا');
}

function applyFilter({ inputData, filterforspecialties }) {
  if (!filterforspecialties) {
    return inputData;
  }

  // Normalize the search term for comparison
  const normalizedSearchTerm = normalizeArabicText(filterforspecialties.toLowerCase());

  inputData = inputData?.filter((data) => {
    const normalizedDataNameEnglish = normalizeArabicText(data?.name_english.toLowerCase());
    const normalizedDataNameArabic = normalizeArabicText(data?.name_arabic.toLowerCase());
    const normalizedDataSubArabic = normalizeArabicText(data?.sub_english.toLowerCase());
    const normalizedDataSubEnglish = normalizeArabicText(data?.sub_arabic.toLowerCase());
    return (
      normalizedDataNameEnglish.includes(normalizedSearchTerm) ||
      normalizedDataNameArabic.includes(normalizedSearchTerm) ||
      normalizedDataSubArabic.includes(normalizedSearchTerm) ||
      normalizedDataSubEnglish.includes(normalizedSearchTerm) ||
      data?._id === filterforspecialties ||
      JSON.stringify(data.code) === filterforspecialties
    );
  });

  return inputData;
}
