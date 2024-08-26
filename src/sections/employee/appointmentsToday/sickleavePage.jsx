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
  console.log(data, 'data');
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

      enqueueSnackbar('Prescription updated successfully', { variant: 'success' });
      navigate(-1);
      refetch();
      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating data', { variant: 'error' });
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
            <Typography variant="h3">{data?.patient?.name_english}</Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('from')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateTime(data?.Medical_sick_leave_start)}
              </span>
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('to')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateTime(data?.Medical_sick_leave_end)}
              </span>
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Dr.')}&nbsp;
              {curLangAr
                ? `قام ${data?.employee?.name_arabic} باضافة اجازة مرضية`
                : `${data?.employee?.name_english} added sick leave`}
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('description')}:&nbsp;&nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>{data?.description}</span>{' '}
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
              <Iconify icon="icon-park:back" />
              &nbsp; {t('back')}
            </Button>
          </Box>
          <Box>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={medicalReportDialog.onTrue}>
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
