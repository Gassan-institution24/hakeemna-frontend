import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetAppointmentTypes,
  useGetUSActiveWorkGroups,
  useGetUSActiveWorkShifts,
  useGetUSActiveServiceTypes,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFMultiSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function BookManually({ onClose, refetch, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );
  const { workGroupsData } = useGetUSActiveWorkGroups(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { workShiftsData } = useGetUSActiveWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  // console.log('workGroupsData', workGroupsData);

  const NewUserSchema = Yup.object().shape({
    work_shift: Yup.string().required('Work Shift is required'),
    work_group: Yup.string().required('Work Group is required'),
    service_types: Yup.array(),
    appointment_type: Yup.string().required('Appointment Type is required'),
    start_time: Yup.date().required('Start time is required'),
  });

  const defaultValues = useMemo(
    () => ({
      appointment_type: null,
      start_time: null,
      work_group: null,
      work_shift: null,
      service_types: [],
    }),
    []
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const { reset, setValue, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const appoint = await axios.post(endpoints.appointments.all, {
        ...data,
        emergency: true,
        unit_service:
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
            ._id,
        department: workGroupsData.filter((item) => item._id === data.work_group)?.[0]?.department
          ._id,
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.appointments.root,
        msg: `created an emergency appointment <strong>[ ${appoint?.data?.code} ]</strong>`,
      });
      reset();
      enqueueSnackbar(t('created successfully!'));
      refetch();

      onClose();
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <Dialog maxWidth="lg" onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle lang="ar" sx={{ mb: 1 }}>
          {curLangAr ? 'إنشاء موعد طوارئ جديد' : 'New Emergency Appointment'}
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
                  <MobileDateTimePicker
                    label={`${t('start date')} *`}
                    sx={{ width: '30vw', minWidth: '300px' }}
                    onChange={(newValue) => {
                      const selectedTime = zonedTimeToUtc(
                        newValue,
                        user?.employee?.employee_engagements[user?.employee.selected_engagement]
                          ?.unit_service?.country?.time_zone ||
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                      );
                      setValue('start_time', new Date(selectedTime));
                    }}
                    minutesStep="5"
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
                    <MenuItem key={idx} value={option._id}>
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
                      <MenuItem key={idx} value={option._id}>
                        {curLangAr ? option?.name_arabic : option?.name_english}
                      </MenuItem>
                    ))}
                </RHFSelect>
                <RHFSelect name="work_group" label={`${t('work group')} *`}>
                  {workGroupsData.map((option, index, idx) => (
                    <MenuItem key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFMultiSelect
                  checkbox
                  name="service_types"
                  label={t('service types')}
                  options={serviceTypesData}
                />
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
