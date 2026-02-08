import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { Stack } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Card,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';
import { fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useGetOneSickLeaves } from 'src/api/sickleave';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function MdicalreportPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { data, refetch } = useGetOneSickLeaves(id);
  const medicalReportDialog = useBoolean();
  const navigate = useNavigate();
  const medicalReportSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    Medical_sick_leave_start: Yup.string(),
    Medical_sick_leave_end: Yup.string(),
    entrance_mangament: Yup.string(),
    description: Yup.string().required(t('Description is required')),
  });
  const defaultValues = {
    description: '',
  };
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(medicalReportSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.patch(`/api/sickleave/${id}`, submitdata);

      enqueueSnackbar(t('Sick Leave updated successfully'), { variant: 'success' });
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
              {t('Sick Leave Details')}
            </Typography>

            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
              {t('creation time')} : {fDateTime(data?.created_at)}
            </Typography>
          </Box>

          {/* Doctor */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {t('doctor')} :
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}
              </Typography>
            </Box>
          </Box>
          {/* Patient */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {t('patient')} :
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                 {curLangAr
                  ? data?.unit_service_patient?.name_arabic ||
                    data?.unit_service_patient?.name_english
                  : data?.unit_service_patient?.name_english ||
                    data?.unit_service_patient?.name_arabic}
              </Typography>
            </Box>
          </Box>


          {/* Sick Leave Period */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              border: '1px solid #eee',
              bgcolor: '#fafafa',
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              {t('Sick Leave Period')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>{t('from')} :</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {fDateTime(data?.Medical_sick_leave_start)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>{t('to')} :</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {fDateTime(data?.Medical_sick_leave_end)}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          {data?.description && (
            <Box
              sx={{
                mb: 4,
                p: 2,
                bgcolor: '#fff',
                borderLeft: '4px solid #4CAF50',
                borderRadius: 1,
              }}
            >
              <Typography fontWeight={600} mb={0.5}>
                {t('description')}
              </Typography>
              <Typography color="text.secondary">{data?.description}</Typography>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="text" onClick={() => navigate(-1)}>
              <Iconify icon="icon-park:back" />
              &nbsp; {t('back')}
            </Button>

            <Button variant="outlined" onClick={medicalReportDialog.onTrue}>
              <Iconify icon="icon-park:edit-two" />
              &nbsp; {t('update')}
            </Button>
          </Box>
        </Stack>
      </Box>

      <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {t('update sick leave')}
          </DialogTitle>
          <DialogContent>
            <RHFTextField
              lang="en"
              multiline
              name="description"
              label={t('description')}
              sx={{ mb: 2, mt: 2 }}
            />
            <Controller
              name="Medical_sick_leave_start"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('Start time')}
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
              name="Medical_sick_leave_end"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('End time')}
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
}
