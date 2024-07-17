import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicines, useGeEntrancePrescription } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function TestPage({ Entrance }) {
  const { user } = useAuthContext();
  const [DoctorComment, setDoctorComment] = useState();
  const router = useRouter();
  const { prescriptionData, refetch } = useGeEntrancePrescription(Entrance?._id);
  const prescriptionDialog = useBoolean();
  const { medicinesData } = useGetMedicines();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [chronic, setChronic] = useState(false);

  const handleHover = (hoverdId) => {
    setHoveredButtonId(hoverdId);
  };
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };
  const handleViewClick = (idd) => {
    router.push(paths.employee.prescription(idd));
  };
  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    Start_time: Yup.date(),
    End_time: Yup.date(),
    file: Yup.array(),
    Frequency_per_day: Yup.string(),
    entrance_mangament: Yup.string(),
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
    entrance_mangament: Entrance?._id,
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
  const removePrescription = async (IdToremove) => {
    await axiosInstance.patch(endpoints.prescription.one(IdToremove), {
      Activation: false,
    });

    enqueueSnackbar('Feild removed successfully', { variant: 'success' });
    refetch();
    reset();
  };
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
  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: Entrance?.patient?._id,
      service_unit: Entrance?.service_unit,
      entrance_mangament: Entrance?._id,
    });
  }, [user, Entrance, reset]);

  const onSubmit = async (submitdata) => {
    try {
      submitdata.chronic = chronic;
      submitdata.Doctor_Comments = DoctorComment;
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
        await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
          Drugs_report_status: true,
        });
        enqueueSnackbar('Prescription uploaded successfully', { variant: 'success' });
        prescriptionDialog.onFalse();
        refetch();
        reset();
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error uploading data', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ mt: 1 }}>
      <Button variant="outlined" color="success" onClick={prescriptionDialog.onTrue} sx={{ m: 2 }}>
        {t('Add prescription')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      {prescriptionData?.map((info, i) => (
        <Typography
          variant="h6"
          sx={{
            bgcolor: '#fff',
            m: 2,
            border: 2,
            borderRadius: 2,
            borderColor: '#EDEFF2',
            p: 2,
          }}
          key={i}
        >
          {info?.medicines?.trade_name}
          <Button
            onMouseOver={() => handleHover(info?._id)}
            onMouseOut={handleMouseOut}
            onClick={() => handleViewClick(info?._id)}
            sx={{ m: 1 }}
          >
            View &nbsp;{' '}
            <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
          </Button>

          <Button onClick={() => removePrescription(info?._id)}>
            Remove &nbsp; <Iconify icon="flat-color-icons:delete-database" />
          </Button>
        </Typography>
      ))}
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
    </Card>
  );

  //   )
}

TestPage.propTypes = {
  Entrance: PropTypes.object,
};
