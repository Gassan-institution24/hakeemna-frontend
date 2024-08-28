import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers';
import {
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEntranceSickLeaves } from 'src/api/sickleave';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function SickLeave({ patient, unit_service_patient, service_unit }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const { id } = useParams();
  const curLangAr = currentLang.value === 'ar';
  const dialog = useBoolean();
  const { data, refetch } = useGetEntranceSickLeaves(id);
  const { user } = useAuthContext();
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const router = useRouter();
  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    description: Yup.string(),
    unit_services: Yup.string(),
    Medical_sick_leave_start: Yup.date(),
    entrance_mangament: Yup.string(),
    Medical_sick_leave_end: Yup.date(),
  });
  const defaultValues = {
    employee: user?.employee?._id,
    patient: patient?._id,
    unit_services: service_unit,
    entrance_mangament: id,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(PrescriptionsSchema),
    defaultValues,
  });
  const handleViewClick = (idd) => {
    router.push(paths.employee.sickleave(idd));
  };
  const handleHover = (hoverdId) => {
    setHoveredButtonId(hoverdId);
  };
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };

  const removemedicalrepoort = async (IdToremove2) => {
    await axiosInstance.delete(endpoints.sickleave.onee(IdToremove2), {
      Activation: false,
    });

    enqueueSnackbar('Feild removed successfully', { variant: 'success' });
    refetch();
    reset();
  };
  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
      patient: patient?._id,
      unit_service_patient,
      unit_services: service_unit,
      entrance_mangament: id,
    });
  }, [user?.employee?._id, reset, patient?._id, service_unit, id, unit_service_patient]);

  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.post('/api/sickleave', submitdata);
      enqueueSnackbar('sick leave created successfully', { variant: 'success' });
      dialog.onFalse();
      refetch();
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mt: 1 }}>
        {t('Add sick leave')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      {data?.map((info, i) => (
        <Typography
          key={i}
          variant="h6"
          sx={{
            bgcolor: '#fff',
            m: 2,
            border: 2,
            borderRadius: 2,
            borderColor: '#EDEFF2',
            p: 2,
          }}
        >
          {curLangAr
            ? `قام ${info?.employee?.name_arabic} باضافة اجازة مرضية`
            : `${info?.employee?.name_english} has add ${info?.description} medical report`}

          <br />
          <Button onClick={() => removemedicalrepoort(info?._id)}>
            {t('Remove')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
          </Button>
          <Button
            onMouseOver={() => handleHover(info?._id)}
            onMouseOut={handleMouseOut}
            onClick={() => handleViewClick(info?._id)}
            sx={{ m: 1 }}
          >
            {t('View')} &nbsp;{' '}
            <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
          </Button>
        </Typography>
      ))}
      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {curLangAr ? 'اضافة اجازة مرضية' : 'add sick leave'}
          </DialogTitle>
          <DialogContent>
            <Controller
              name="Medical_sick_leave_start"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  label={t('Medical sick leave start*')}
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
                  label={t('Medical sick leave end*')}
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
            <RHFTextField name="description" multiline label={t('description')} />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
              {t('Cancel')}
            </Button>

            <Button type="submit" variant="contained" loading={isSubmitting}>
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
SickLeave.propTypes = {
  patient: PropTypes.object,
  service_unit: PropTypes.string,
  unit_service_patient: PropTypes.string,
};
