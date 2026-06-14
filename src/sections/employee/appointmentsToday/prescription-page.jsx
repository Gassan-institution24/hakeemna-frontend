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
  const { medicinesData } = useGetMedicines({ rowsPerPage: 5000 });
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

      enqueueSnackbar(t('Prescription updated successfully'), { variant: 'success' });
      navigate(-1);

      refetch();
      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Error updating data'), { variant: 'error' });
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
            p: 4,
            width: '85%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              pb: 2,
              borderBottom: '1px solid #eee',
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {t('Prescription Details')}
            </Typography>

            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
              {t('creation time')} : {fDateTime(prescriptionData?.created_at)}
            </Typography>
          </Box>

          {/* Doctor */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('doctor')} :
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {curLangAr
                  ? prescriptionData?.employee?.name_arabic
                  : prescriptionData?.employee?.name_english}
              </Typography>
            </Box>
          </Box>
          {/* Patient */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('patient')} :
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {curLangAr
                  ? prescriptionData?.unit_service_patient?.name_arabic ||
                    prescriptionData?.unit_service_patient?.name_english
                  : prescriptionData?.unit_service_patient?.name_english ||
                    prescriptionData?.unit_service_patient?.name_arabic}
              </Typography>
            </Box>
          </Box>

          {/* Medicines */}
          {prescriptionData?.medicines?.map((item, index) => (
            <Box
              key={index}
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 2,
                border: '1px solid #eee',
                bgcolor: '#fafafa',
              }}
            >
              {/* Medicine Name */}
              <Typography variant="h6" fontWeight={700} mb={2}>
                {item?.medicines?.trade_name}
              </Typography>

              {/* Frequency */}
              {item?.Frequency_per_day && (
                <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('frequency')} :
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>
                    {item?.Frequency_per_day}
                  </Typography>
                </Box>
              )}

              {/* Duration */}
              <Typography sx={{ fontWeight: 600 }}>{t('Duration')} :</Typography>

              {item?.Start_time && item?.End_time ? (
                <>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {t('From')} {fDateAndTime(item?.Start_time)}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {t('To')} {fDateAndTime(item?.End_time)}
                  </Typography>
                </>
              ) : (
                item?.chronic && (
                  <Typography sx={{ color: 'success.main' }}> {t('Chronic Treatment')}</Typography>
                )
              )}

              {/* Doctor Notes */}
              {item?.Doctor_Comments && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: '#fff',
                    borderLeft: '4px solid #4CAF50',
                    borderRadius: 1,
                  }}
                >
                  <Typography fontWeight={600} mb={0.5}>
                    {t('doctor comment')}
                  </Typography>
                  <Typography color="text.secondary">{item?.Doctor_Comments}</Typography>
                </Box>
              )}
            </Box>
          ))}

          {/* Back */}
          <Button
            variant="text"
            sx={{ mt: 2, alignSelf: 'flex-start' }}
            onClick={() => navigate(-1)}
          >
            <Iconify icon="icon-park:back" />
            &nbsp; {t('back')}
          </Button>
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
