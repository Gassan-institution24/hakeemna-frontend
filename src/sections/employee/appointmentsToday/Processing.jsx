import * as Yup from 'yup';
import { useParams } from 'react-router';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
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
  Box,
  Paper,
  Button,
  Dialog,
  Divider,
  Checkbox,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetMedicines,
  useGetMedRecord,
  useGetOneEntranceManagement,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFUpload, RHFSelect, RHFTextField } from 'src/components/hook-form';

import Rooms from './rooms';
import History from './history';
import CheckList from './checkList';
import SickLeave from './sickLeave';

export default function Processing() {
  const { user } = useAuthContext();
  const params = useParams();
  const { id } = params;
  const { medicinesData } = useGetMedicines();
  const { Entrance, refetch } = useGetOneEntranceManagement(id);
  const { medRecord } = useGetMedRecord(Entrance?.service_unit?._id, Entrance?.patient?._id);
  const { data } = useGetPatient(Entrance?.patient?._id);
  const medicalReportDialog = useBoolean();
  const prescriptionDialog = useBoolean();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [ImgFiles, setImgFiles] = useState([]);
  const [DoctorComment, setDoctorComment] = useState();
  const [chronic, setChronic] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    Num_days: Yup.number(),
    medicines: Yup.string(),
    Start_time: Yup.date(),
    End_time: Yup.date(),
    file: Yup.array(),
    Frequency_per_day: Yup.string(),
    Doctor_Comments: Yup.string(),
    description: Yup.string(),
    department: Yup.string(),
    chronic: Yup.boolean(),
    Drugs_report: Yup.string(),
    medical_report: Yup.string(),
    Medical_sick_leave_start: Yup.date(),
    Medical_sick_leave_end: Yup.date(),
  });

  const defaultValues = {
    employee: user?.employee?._id,
    patient: Entrance?.patient?._id,
    service_unit: Entrance?.service_unit,
    chronic: '',
    Doctor_Comments: '',
  };
  const [itemsToShow, setItemsToShow] = useState(2);

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
  const values = watch();
  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
    });
  }, [user, Entrance, reset]);

  const watchStartTime = watch('Start_time');
  const watchEndTime = watch('End_time');

  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      const start = new Date(watchStartTime);
      const end = new Date(watchEndTime);
      const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setValue('Num_days', difference > 0 ? difference : 0);
    }
  }, [watchStartTime, watchEndTime, setValue]);
  const fuser = () => {
    const allowedExtensions = ['.jpeg', '.png', '.jpg', '.gif'];

    const isValidFile = (fileName) => {
      const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
      return allowedExtensions.includes(fileExtension);
    };

    const isValidSize = (fileSize) => fileSize <= 3145728;

    return {
      validateFile: isValidFile,
      validateSize: isValidSize,
    };
  };

  const handleDrop = (acceptedFiles) => {
    const fileValidator = fuser();

    const isValidFiles = acceptedFiles.every(
      (file) => fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)
    );

    if (isValidFiles) {
      const newFiles = acceptedFiles;
      setImgFiles((currentFiles) => [...currentFiles, ...newFiles]);
      setValue('file', [...values.file, ...newFiles]);
    } else {
      enqueueSnackbar(t('Invalid file type or size'), { variant: 'error' });
    }
  };

  const onSubmit = async (submitdata) => {
    try {
      submitdata.Doctor_Comments = DoctorComment;
      submitdata.chronic = chronic;

      if (medicalReportDialog.value) {
        const formData = new FormData();

        Object.keys(submitdata).forEach((key) => {
          if (Array.isArray(submitdata[key])) {
            submitdata[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, submitdata[key]);
          }
        });

        if (ImgFiles) {
          ImgFiles.forEach((file, index) => {
            formData.append(`file[${index}]`, file);
          });
        }

        await axiosInstance.post(endpoints.history.all, {
          patient: Entrance?.patient?._id,
          name_english: 'A medical report has been added',
          name_arabic: 'تم ارفاق تقرير طبي',
          sub_english: `Medical report from ${Entrance?.service_unit?.name_english}`,
          sub_arabic: `تقرير طبي من ${Entrance?.service_unit?.name_arabic}`,
          actual_date: Entrance?.created_at,
          title: 'medical report',
          service_unit: Entrance?.service_unit?._id,
        });

        await axiosInstance.post('/api/examination', formData);

        await axiosInstance.patch(`/api/entrance/${id}`, {
          medical_report_status: true,
        });

        enqueueSnackbar('Medical report uploaded successfully', { variant: 'success' });

        refetch();
        medicalReportDialog.onFalse();
        reset();
      }
      if (prescriptionDialog.value) {
        await axiosInstance.post(endpoints.history.all, {
          patient: Entrance?.patient?._id,
          name_english: 'an prescription has been added',
          name_arabic: 'تم ارفاق وصفة طبية',
          sub_english: `prescription from  ${Entrance?.service_unit?.name_english}`,
          sub_arabic: `وصفة طبية من  ${Entrance?.service_unit?.name_arabic}`,
          actual_date: Entrance?.created_at,
          title: 'prescription',
          service_unit: Entrance?.service_unit?._id,
        });
        await axiosInstance.post('/api/drugs', submitdata);
        await axiosInstance.patch(`/api/entrance/${id}`, {
          Drugs_report_status: true,
        });
        enqueueSnackbar('Prescription uploaded successfully', { variant: 'success' });
        refetch();
        prescriptionDialog.onFalse();
        reset();
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error uploading data', { variant: 'error' });
    }
  };

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
    });
  }, [user, Entrance, reset]);

  const handleBackClick = (idd) => {
    router.push(paths.employee.recored(idd));
  };
  const firstSequenceNumber =
    medRecord && medRecord.length > 0 ? medRecord[0].sequence_number : null;
  const TIMELINES = [
    {
      key: 0,
      title: (
        <>
          {firstSequenceNumber && (
            <span
              style={{ backgroundColor: '#22C55E', color: 'white', padding: 6, borderRadius: 10 }}
            >
              Visits history {firstSequenceNumber}
            </span>
          )}
          <br />
          <Box sx={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
            {medRecord?.slice(0, itemsToShow).map((test, i) => (
              <Box key={i}>
                <Button onClick={() => handleBackClick(test?._id)} sx={{ width: '100%', m: 1 }}>
                  {Entrance?.patient?.name_english} was here in {fDateTime(test?.created_at)}
                </Button>
                <Divider />
              </Box>
            ))}
          </Box>
          {medRecord?.length > itemsToShow && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setItemsToShow(itemsToShow + 2)}
              sx={{ m: 2 }}
            >
              {t('Load More')}
            </Button>
          )}
        </>
      ),
      color: 'info',
      icon: <Iconify icon="healthicons:medical-records-outline" width={25} />,
    },
    {
      key: 1,
      title: <History />,
      color: 'primary',
      icon: <Iconify icon="eva:folder-add-fill" width={24} />,
    },
    {
      key: 4,
      title: <Rooms />,
      color: 'info',
      icon: <Iconify icon="cil:room" width={24} />,
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
          <SickLeave patient={data} service_unit={Entrance?.service_unit?._id} />
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
            <RHFTextField lang="en" multiline name="description" label={t('description')} />
            <RHFUpload
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={handleDrop}
              multiple
            />
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
              multiline
              // rows={4}
              sx={{ mb: 2 }}
              onChange={(e) => setDoctorComment(e.target.value)}
            />
          </DialogContent>
          <Checkbox
            size="small"
            name="chronic"
            color="success"
            sx={{ position: 'relative', top: 5, left: 25 }}
            onChange={() => {
              setChronic(!chronic);
            }}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              mt: { md: -3, xs: -2.3 },
              ml: curLangAr ? { md: -31, xs: -5 } : { md: 8, xs: 4 },
              typography: 'caption',

              fontSize: { md: 15, xs: 10 },
            }}
          >
            chronic
          </Typography>
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

  const renderTimelineItems = (item) => (
    <Paper
      sx={{
        p: 3,
        bgcolor: (themee) => alpha(themee.palette.grey[500], 0.12),
        width: '100%',
      }}
    >
      <Typography variant="subtitle2">{item.title}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {item.title === 'medical report (optional)' && renderMedicalReport}
        {item.title === 'prescription (optional)' && renderPrescription}
      </Typography>
    </Paper>
  );

  return isMobile ? (
    <div>
      {TIMELINES.map((item) => (
        <div key={item.key} style={{ marginBottom: '16px' }}>
          {renderTimelineItems(item)}
        </div>
      ))}
    </div>
  ) : (
    <Timeline
      position="alternate-reverse"
      sx={{
        backgroundImage:
          'url("https://cdni.iconscout.com/illustration/premium/thumb/consult-with-doctor-online-for-prescription-5588761-4655030.png?f=webp")',
        backgroundSize: '200px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
      }}
    >
      {TIMELINES.map((item) => (
        <TimelineItem key={item.key}>
          <TimelineSeparator>
            <TimelineDot color={item.color}>{item.icon}</TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{renderTimelineItems(item)}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
