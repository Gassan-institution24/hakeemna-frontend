import * as Yup from 'yup';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useParams } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import RHFHoursMins from 'src/components/hook-form/rhf-hours-min';
import FormProvider, { RHFTextField, RHFDatePicker } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CreateMonthlyReport({
  row,
  open,
  onClose,
  refetch,
  start_date,
  end_date,
  hours,
  annual,
  sick,
  unpaid,
  publicHolidays,
  other,
  ids,
  monthly,
  length,
}) {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const attendanceSchema = Yup.object().shape({
    start_date: Yup.date().required(t('required field')),
    end_date: Yup.date().required(t('required field')),
    working_time: Yup.number(),
    calculated_time: Yup.number(),
    annual: Yup.number(),
    sick: Yup.number(),
    unpaid: Yup.number(),
    public: Yup.number(),
    other: Yup.number(),
    social_security: Yup.number(),
    tax: Yup.number(),
    deduction: Yup.number(),
    total: Yup.number(),
    annual_equivalent: Yup.number(),
    sick_equivalent: Yup.number(),
    unpaid_equivalent: Yup.number(),
    public_equivalent: Yup.number(),
    other_equivalent: Yup.number(),
    days: Yup.number(),
    note: Yup.string().nullable(),
  });

  const defaultValues = {
    unit_service:
      row?.unit_service ||
      user?.employee?.employee_engagements?.[user.employee.selected_engagement].unit_service?._id,
    employee_engagement: row?.employee_engagement || id,
    start_date: row?.start_date || start_date || null,
    end_date: row?.end_date || end_date || null,
    working_time: row?.working_time || hours || 0,
    calculated_time: row?.calculated_time || 0,
    annual: row?.annual || annual || 0,
    sick: row?.sick || sick || 0,
    unpaid: row?.unpaid || unpaid || 0,
    public: row?.public || publicHolidays || 0,
    other: row?.other || other || 0,
    social_security: row?.social_security || 0,
    tax: row?.tax || 0,
    deduction: row?.deduction || 0,
    total: row?.total || 0,
    annual_equivalent: row?.annual_equivalent || 0,
    sick_equivalent: row?.sick_equivalent || 0,
    unpaid_equivalent: row?.unpaid_equivalent || 0,
    public_equivalent: row?.public_equivalent || 0,
    other_equivalent: row?.other_equivalent || 0,
    note: row?.note || '',
    days: row?.days || length || 0,
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

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (monthly) {
        if (row) {
          await axiosInstance.patch(endpoints.yearlyReport.one(row._id), data);
          onClose();
          refetch();
          enqueueSnackbar(t('edited successfuly'));
          return;
        }
        await axiosInstance.post(endpoints.yearlyReport.all, { ...data, ids });
        onClose();
        refetch();
        enqueueSnackbar(t('created successfuly'));
      } else {
        if (row) {
          await axiosInstance.patch(endpoints.monthlyReport.one(row._id), data);
          onClose();
          refetch();
          enqueueSnackbar(t('edited successfuly'));
          return;
        }
        await axiosInstance.post(endpoints.monthlyReport.all, { ...data, ids });
        onClose();
        refetch();
        enqueueSnackbar(t('created successfuly'));
      }
    } catch (error) {
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    methods.setValue(
      'total',
      values.salary ? values.salary - values.deduction - values.tax - values.social_security : 0
    );
    // eslint-disable-next-line
  }, [values.salary, values.deduction, values.tax, values.social_security]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => {
        methods.reset();
        onClose();
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {monthly ? t('Create Yearly report') : t('Create Monthly report')}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} mt={2}>
            <Box
              display="grid"
              columnGap={2}
              rowGap={2}
              gridTemplateColumns={{ xs: 'repeat(2, 1fr)' }}
              alignItems="flex-end"
            >
              <RHFDatePicker disabled name="start_date" label={t('Start date')} />
              <RHFDatePicker disabled name="end_date" label={t('End date')} />
              <RHFHoursMins disabled name="working_time" label={t('Working time')} />
              <RHFTextField disabled type="number" name="days" label={t('Days')} />
              <RHFTextField disabled type="number" name="annual" label={t('Annual')} />
              <RHFHoursMins type="number" name="annual_equivalent" label={t('Annual equivalent')} />
              <RHFTextField disabled type="number" name="sick" label={t('Sick')} />
              <RHFHoursMins type="number" name="sick_equivalent" label={t('Sick equivalent')} />
              <RHFTextField disabled type="number" name="unpaid" label={t('Unpaid')} />
              <RHFHoursMins type="number" name="unpaid_equivalent" label={t('Unpaid equivalent')} />
              <RHFTextField disabled type="number" name="public" label={t('Public')} />
              <RHFHoursMins type="number" name="public_equivalent" label={t('Public equivalent')} />
              <RHFTextField disabled type="number" name="other" label={t('Other')} />
              <RHFHoursMins type="number" name="other_equivalent" label={t('Other equivalent')} />
            </Box>
            <Divider />
            <Box
              display="grid"
              columnGap={2}
              rowGap={2}
              gridTemplateColumns={{ xs: 'repeat(2, 1fr)' }}
              alignItems="flex-end"
            >
              <RHFHoursMins name="calculated_time" label={t('Calculated minutes')} />
              <RHFTextField type="number" name="salary" label={t('Salary')} />
              <RHFTextField type="number" name="social_security" label={t('social security')} />
              <RHFTextField type="number" name="tax" label={t('tax')} />
              <RHFTextField type="number" name="deduction" label={t('deduction')} />
              <RHFTextField disabled type="number" name="total" label={t('total')} />
            </Box>

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

CreateMonthlyReport.propTypes = {
  refetch: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  monthly: PropTypes.bool,
  row: PropTypes.object,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  hours: PropTypes.number,
  annual: PropTypes.number,
  sick: PropTypes.number,
  unpaid: PropTypes.number,
  publicHolidays: PropTypes.number,
  other: PropTypes.number,
  length: PropTypes.number,
  ids: PropTypes.array,
};
