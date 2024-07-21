import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import { Divider, MenuItem, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { paths } from 'src/routes/paths';

import { useNewScreen } from 'src/hooks/use-new-screen';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetAppointmentTypes,
  useGetUSActiveWorkShifts,
  useGetUSActiveServiceTypes,
  useGetEmployeeActiveWorkGroups,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFMultiSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function BookManually({ onClose, refetch, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { handleAddNew } = useNewScreen();

  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
    { select: 'name_english name_arabic' }
  );
  const { workGroupsData } = useGetEmployeeActiveWorkGroups(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  );
  const { workShiftsData } = useGetUSActiveWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const NewUserSchema = Yup.object().shape({
    work_shift: Yup.string().required(t('required field')),
    work_group: Yup.string().required(t('required field')),
    service_types: Yup.array(),
    appointment_type: Yup.string().required(t('required field')),
    start_time: Yup.date().required(t('required field')),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      appointment_type: null,
      start_time: null,
      work_group: null,
      work_shift: null,
      service_types: [],
    }),
    [user?.employee]
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const appoint = await axios.post(endpoints.appointments.all, {
        ...data,
        department: workGroupsData.filter((item) => item._id === data.work_group)?.[0]?.department
          ?._id,
        emergency: true,
      });
      socket.emit('created', {
        data,
        user,
        link: paths.unitservice.employees.root,
        msg: `created emergency appointment <strong>[ ${appoint.data.code} ]</strong>`,
        ar_msg: `إنشاء موعد طارئ <strong>[ ${appoint.data.code} ]</strong>`,
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
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

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
                <RHFMultiSelect
                  checkbox
                  path={paths.unitservice.tables.services.new}
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
