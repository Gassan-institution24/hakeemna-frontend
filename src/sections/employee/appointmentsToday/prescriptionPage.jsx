import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Card,
  Button,
  Dialog,
  Checkbox,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { fDateTime, fDateAndTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicines, useGePrescription } from 'src/api';

import Iconify from 'src/components/iconify/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function PrescriptionPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { prescriptionData, refetch } = useGePrescription(id);
  const { medicinesData } = useGetMedicines();
  const [DoctorComment, setDoctorComment] = useState('');
  const prescriptionDialog = useBoolean();
  const [chronic, setChronic] = useState(false);
  const navigate = useNavigate();

  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    Start_time: Yup.mixed(),
    End_time: Yup.mixed(),
    file: Yup.array(),
    Frequency_per_day: Yup.string(),
    entrance_mangament: Yup.string(),
    description: Yup.string(),
    department: Yup.string(),
    Drugs_report: Yup.string(),
    medical_report: Yup.string(),
    Medical_sick_leave_start: Yup.mixed(),
    Medical_sick_leave_end: Yup.mixed(),
  });

  const defaultValues = {
    medicines: '',
    Frequency_per_day: '',
    Num_days: '',
    Start_time: null,
    End_time: null,
    Doctor_Comments: '',
    chronic: false,
  };

  const methods = useForm({
    mode: 'all',
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
  useEffect(() => {
    if (prescriptionData) {
      setChronic(prescriptionData.chronic);
      setDoctorComment(prescriptionData.Doctor_Comments || '');
      reset({
        medicines: prescriptionData.medicines?._id || '',
        Frequency_per_day: prescriptionData.Frequency_per_day || '',
        Num_days: prescriptionData.Num_days || '',
        Start_time: prescriptionData.Start_time ? new Date(prescriptionData.Start_time) : null,
        End_time: prescriptionData.End_time ? new Date(prescriptionData.End_time) : null,
        Doctor_Comments: prescriptionData.Doctor_Comments || '',
        chronic: prescriptionData.chronic,
      });
    }
  }, [prescriptionData, reset]);
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
  const onSubmit = async (submitdata) => {
    try {
      submitdata.chronic = chronic;
      submitdata.Doctor_Comments = DoctorComment;
      await axiosInstance.patch(`/api/drugs/${id}`, submitdata);

      enqueueSnackbar('Prescription updated successfully', { variant: 'success' });
      navigate(-1);

      refetch();
      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error uploading data', { variant: 'error' });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          component={Card}
          sx={{
            p: 3,
            width: '80%',
            display: 'grid',
            gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
          }}
        >
          <Box>
            <Typography variant="h3">{prescriptionData?.patient?.name_english}</Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Date')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateTime(prescriptionData?.created_at)}
              </span>
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('name')}:&nbsp; &nbsp;
              {prescriptionData?.medicines?.map((medicineName, index) => (
                <span style={{ color: 'gray', fontWeight: 400 }} key={index}>
                  ({medicineName?.medicines?.trade_name}){' '}
                </span>
              ))}
            </Typography>

            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Dr.')}&nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {prescriptionData?.employee?.name_english}
              </span>{' '}
              &nbsp; {t('added a new prescription')}
            </Typography>
            {prescriptionData?.Doctor_Comments && (
              <Typography sx={{ fontWeight: 600, p: 2 }}>
                {t('note')}:&nbsp;&nbsp;
                <span style={{ color: 'gray', fontWeight: 400 }}>
                  {prescriptionData?.Doctor_Comments}
                </span>{' '}
              </Typography>
            )}

            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
              <Iconify icon="icon-park:back" />
              &nbsp; {t('Back')}
            </Button>
          </Box>
          <Box>
            <Typography variant="h3">{prescriptionData?.medicines?.trade_name}</Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Date')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateTime(prescriptionData?.created_at)}
              </span>
            </Typography>
            {prescriptionData?.Frequency_per_day && (
              <Typography sx={{ fontWeight: 600, p: 2 }}>
                {t('Frequency')}:&nbsp; &nbsp;
                <span style={{ color: 'gray', fontWeight: 400 }}>
                  {prescriptionData?.Frequency_per_day}
                </span>
              </Typography>
            )}

            {prescriptionData?.chronic ? (
              <Typography sx={{ fontWeight: 600, p: 2 }}>{t('Chronic: Yes')}</Typography>
            ) : (
              prescriptionData?.Num_days && (
                <Typography sx={{ fontWeight: 600, p: 2 }}>
                  {t('Duration')}:&nbsp;&nbsp;
                  {prescriptionData?.Start_time && prescriptionData?.End_time ? (
                    <>
                      {t('From')} {fDateAndTime(prescriptionData?.Start_time)} {t('To')}{' '}
                      {fDateAndTime(prescriptionData?.End_time)}
                      <span style={{ color: '#2F88FF', fontWeight: 500 }}>
                        &nbsp;{prescriptionData?.Num_days} day/s
                      </span>
                    </>
                  ) : (
                    `${prescriptionData?.Num_days} day/s`
                  )}
                </Typography>
              )
            )}

            {/* <Button variant="outlined" sx={{ mt: 2 }} onClick={prescriptionDialog.onTrue}>
              <Iconify icon="icon-park:edit-two" />
              &nbsp; {t('Update')}
            </Button> */}
          </Box>
        </Stack>
      </Box>

      <Dialog open={prescriptionDialog.value} onClose={prescriptionDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {curLangAr ? 'تعديل الوصفة الطبية' : 'update prescription'}
          </DialogTitle>
          <DialogContent>
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
            <RHFTextField name="Frequency_per_day" label={t('Frequency pe day')} sx={{ mb: 2 }} />
            <RHFTextField name="Num_days" label={t('Number of days')} sx={{ mb: 2 }} />

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
              name="Doctor_Comments"
              label={t('Doctor Comments')}
              multiline
              value={DoctorComment}
              sx={{ mb: 2 }}
              onChange={(e) => setDoctorComment(e.target.value)}
            />
          </DialogContent>
          <Checkbox
            size="small"
            name="chronic"
            color="success"
            checked={chronic}
            sx={{ position: 'relative', top: 5, left: 25 }}
            onChange={() => setChronic(!chronic)}
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
}
