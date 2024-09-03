import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useMemo, useEffect } from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useNewScreen } from 'src/hooks/use-new-screen';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetAppointmentTypes,
  useGetUSActiveWorkGroups,
  useGetUSActiveWorkShifts,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function BookManually({ onClose, refetch, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { id } = useParams();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { handleAddNew } = useNewScreen();

  const { appointmenttypesData } = useGetAppointmentTypes();
  const { workGroupsData } = useGetUSActiveWorkGroups(id);
  const { workShiftsData } = useGetUSActiveWorkShifts(id);

  const NewUserSchema = Yup.object().shape({
    work_shift: Yup.string().required('Work Shift is required'),
    work_group: Yup.string().required('Work Group is required'),
    service_types: Yup.array(),
    appointment_type: Yup.string().required('Appointment Type is required'),
    start_time: Yup.mixed().required('Start time is required'),
  });

  const defaultValues = useMemo(
    () => ({
      start_time: new Date(),
      appointment_type: appointmenttypesData?.[0]?._id,
      work_group: workGroupsData?.[0]?._id,
      work_shift: workShiftsData.filter((one) => {
        const currentDate = new Date();

        const startTime = new Date(currentDate);
        startTime.setHours(
          new Date(one.start_time).getHours(),
          new Date(one.start_time).getMinutes(),
          0,
          0
        );

        const endTime = new Date(currentDate);
        endTime.setHours(
          new Date(one.end_time).getHours(),
          new Date(one.end_time).getMinutes(),
          0,
          0
        );

        if (startTime <= endTime) {
          return currentDate >= startTime && currentDate < endTime;
        }
        // If the shift crosses midnight
        const endTimeNextDay = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
        return currentDate >= startTime || currentDate < endTimeNextDay;
      })?.[0]?._id,
      service_types: [],
    }),
    [workGroupsData, workShiftsData, appointmenttypesData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const { reset, setValue, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(endpoints.appointments.all, {
        ...data,
        emergency: true,
        unit_service: id,
        department: workGroupsData.filter((item) => item._id === data.work_group)?.[0]?.department
          ._id,
      });
      reset();
      enqueueSnackbar(t('created successfully!'));
      refetch();

      onClose();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog maxWidth="lg" onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle sx={{ mb: 1 }}>
          {curLangAr ? 'إنشاء موعد مستعجل جديد' : 'new urgent appointment'}
        </DialogTitle>

        <DialogContent sx={{ overflow: 'unset' }}>
          <Stack spacing={2.5}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <Controller
                name="start_time"
                render={({ field, fieldState: { error } }) => (
                  <DateTimePicker
                    label={`${t('start date')} *`}
                    sx={{ width: '30vw', minWidth: '300px' }}
                    onChange={(newValue) => {
                      const selectedTime = zonedTimeToUtc(
                        newValue,
                        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                          ?.unit_service?.country?.time_zone || 'Asia/Amman'
                      );
                      setValue('start_time', new Date(selectedTime));
                    }}
                    minutesStep={5}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                      },
                    }}
                  />
                )}
              />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFSelect name="appointment_type" label={`${t('appointment type')} *`}>
                  {appointmenttypesData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="work_shift"
                  label={`${t('work shift')} *`}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {workShiftsData &&
                    workShiftsData.map((option, index, idx) => (
                      <MenuItem lang="ar" key={idx} value={option._id}>
                        {curLangAr ? option?.name_arabic : option?.name_english}
                      </MenuItem>
                    ))}
                  <Divider />
                  <MenuItem
                    lang="ar"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontWeight: 600,
                      // color: 'error.main',
                    }}
                    onClick={() => handleAddNew(paths.unitservice.tables.workshifts.new)}
                  >
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {t('Add new')}
                    </Typography>
                    <Iconify icon="material-symbols:new-window-sharp" />
                  </MenuItem>
                </RHFSelect>
                <RHFSelect name="work_group" label={`${t('work group')} *`}>
                  {workGroupsData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    lang="ar"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontWeight: 600,
                      // color: 'error.main',
                    }}
                    onClick={() => handleAddNew(paths.unitservice.tables.workgroups.new)}
                  >
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {t('Add new')}
                    </Typography>
                    <Iconify icon="material-symbols:new-window-sharp" />
                  </MenuItem>
                </RHFSelect>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('cancel')}
          </Button>

          <Button type="submit" variant="contained">
            {t('add')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

BookManually.propTypes = {
  onClose: PropTypes.func,
  refetch: PropTypes.func,
};
