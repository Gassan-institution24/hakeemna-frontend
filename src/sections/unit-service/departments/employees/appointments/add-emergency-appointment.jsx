import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';
import { useGetAppointmentTypes, useGetServiceTypes, useGetWorkGroups } from 'src/api/tables';

import { useLocales, useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AddEmegencyAppointment({ onClose, ...other }) {
  const router = useRouter();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetServiceTypes();
  const { workGroupsData } = useGetWorkGroups();

  const NewUserSchema = Yup.object().shape({
    // appointment_type: Yup.string().required('Unit Service is required'),
    // date: Yup.string().required('Name is required'),
    // start_time: Yup.string().required('Name is required'),
    // end_time: Yup.string().required('Unit Service is required'),
  });

  const defaultValues = useMemo(
    () => ({
      appointment_type: null,
      date: null,
      start_time: null,
      services: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      //   await axios.post(endpoints.tables.appointments, data);
      reset();
      enqueueSnackbar('Create success!');
      console.info('DATA', data);
      onClose();
    } catch (error) {
      enqueueSnackbar('Please try again later!', { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <>
      <Dialog maxWidth="sm" onClose={onClose} {...other}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle>{curLangAr ? 'إنشاء موعد طوارئ جديد': 'New Emergency Appointment'}</DialogTitle>

          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack spacing={2.5}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Controller
                  name="start_time"
                  render={({ field, fieldState: { error } }) => (
                    <MobileTimePicker
              lang="ar"
                      minutesStep="5"
                      label={t("start time")}
                      onChange={(newValue) => {
                        setValue('start_time', newValue);
                      }}
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
                <RHFSelect
                  InputLabelProps={{ shrink: true }}
                  native
                  name="appointment_type"
                  label={t("appointment type")}
                >
                  {appointmenttypesData.map((option) => (
                    <MenuItem value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFMultiSelect
                  checkbox
                  name="services"
                  label={t("services")}
                  options={serviceTypesData}
                />
                <RHFSelect
                  InputLabelProps={{ shrink: true }}
                  native
                  name="work_group"
                  label={t("work group")}
                >
                  {workGroupsData.map((option) => (
                    <MenuItem value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
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

      
    </>
  );
}

AddEmegencyAppointment.propTypes = {
  onClose: PropTypes.func,
};
