import * as Yup from 'yup';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import FormProvider, {
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFDatePicker,
  RHFTimePicker,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AttendanceEdit({ row, open, onClose, refetch, employeeId, lastAttendance }) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const attendanceSchema = Yup.object().shape({
    date: Yup.date().nullable().test('check-last-attendance', t('There is already an attendance registered today.'), (value) => {
      const lastAttendanceDate = lastAttendance?.date.split('T')[0];

      const currentDate = value.toISOString().split('T')[0];

      console.log('lastAttendanceDate', lastAttendanceDate);
      console.log('currentDate', currentDate);
      if(currentDate === lastAttendanceDate) {
        return false;
      }
      return value && value.toString().length > 0;
    }),
    check_in_time: Yup.date().nullable(),
    off: Yup.boolean().nullable(),
    check_out_time: Yup.date().nullable(),
    leave_end: Yup.date().nullable(),
    leave_start: Yup.date().nullable(),
    employee_engagement: Yup.string().nullable(),
    leave: Yup.string().nullable(),
    work_type: Yup.string().nullable(),
    note: Yup.string().nullable(),
  });

  const defaultValues = {
    date: row?.date || null,
    check_in_time: row?.check_in_time || null,
    off: row?.off || !!row?.leave || false,
    check_out_time: row?.check_out_time || null,
    leave_end: row?.leave_end || null,
    leave_start: row?.leave_start || null,
    leave: row?.leave || '',
    work_type: row?.work_type || '',
    note: row?.note || '',
    employee_engagement: employeeId || '',
  };

  const methods = useForm({
    resolver: yupResolver(attendanceSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const leaveValue = watch('leave');
  const offValues = watch('off');

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (offValues) {
        data.check_in_time = null;
        data.check_out_time = null;
        data.leave_start = null;
        data.leave_end = null;
        data.work_type = '';
      } else {
        data.leave = '';
      }
      if (row?._id) {
        await axiosInstance.patch(endpoints.attendence.one(row?._id), data);
        onClose();
        refetch();
        enqueueSnackbar(t('updated successfuly'));
      } else {
        await axiosInstance.post(endpoints.attendence.create, data);
        onClose();
        refetch();
        enqueueSnackbar(t('created successfuly'));
      }
    } catch (error) {
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message || error, {
        variant: 'error',
      });
      refetch();
    }
  });

  useEffect(() => {
    if (leaveValue) {
      methods.setValue('check_in_time', null);
      methods.setValue('check_out_time', null);
      methods.setValue('leave_start', null);
      methods.setValue('leave_end', null);
      methods.setValue('work_type', '');
    } else {
      methods.setValue('leave', '');
    }
    // eslint-disable-next-line
  }, [leaveValue]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={() => {
        methods.reset();
        onClose();
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{row ? t('Edit Attendance details') : t('Create New Attendance')}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} mt={2}>
            <Box>
              <RHFDatePicker name="date" label={t('Date')} />
              <Stack direction="row" justifyContent="flex-end">
                <RHFCheckbox
                  name="off"
                  label={t('leave')}
                  onChange={() => methods.setValue('off', !offValues)}
                />
              </Stack>
            </Box>
            {offValues && (
              <RHFSelect name="leave" label={t('Leave')}>
                <MenuItem value="annual">{t('annual')}</MenuItem>
                <MenuItem value="sick">{t('sick')}</MenuItem>
                <MenuItem value="unpaid">{t('unpaid')}</MenuItem>
                <MenuItem value="public">{t('public')}</MenuItem>
                <MenuItem value="other">{t('other')}</MenuItem>
              </RHFSelect>
            )}
            {!offValues && (
              <>
                <RHFSelect name="work_type" label={t('Work type')}>
                  <MenuItem value="online">{t('online')}</MenuItem>
                  <MenuItem value="onsite">{t('onsite')}</MenuItem>
                  <MenuItem value="hybrid">{t('hybrid')}</MenuItem>
                  <MenuItem value="field">{t('on the ground')}</MenuItem>
                </RHFSelect>
                <RHFTimePicker name="check_in_time" label={t('Check in time')} />
                <RHFTimePicker name="check_out_time" label={t('Check out time')} />
                <RHFTimePicker name="leave_start" label={t('Leave start')} />
                <RHFTimePicker name="leave_end" label={t('Leave end')} />
              </>
            )}
            <RHFTextField name="note" label={t('note')} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {t('Save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

AttendanceEdit.propTypes = {
  refetch: PropTypes.func,
  onClose: PropTypes.func,
  employeeId: PropTypes.string,
  open: PropTypes.bool,
  row: PropTypes.object,
  lastAttendance: PropTypes.object,
};
