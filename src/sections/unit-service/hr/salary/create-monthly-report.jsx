import * as Yup from 'yup';
import { useEffect, useState } from 'react';
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
import { fHourMin } from 'src/utils/format-time';

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
  intervalData,
}) {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  
  // State to store fetched interval data for yearly reports
  const [yearlyIntervalData, setYearlyIntervalData] = useState(null);
  
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

  // Fetch interval data only for yearly reports when modal opens
  useEffect(() => {
    if (open && monthly && !row) {
      // Fetch interval data for yearly reports only
      const fetchYearlyData = async () => {
        try {
          const response = await axiosInstance.get(endpoints.monthlyReport.interval, {
            params: {
              startDate: start_date,
              endDate: end_date,
            },
          });
          setYearlyIntervalData(response.data);
        } catch (error) {
          console.error('Error fetching yearly interval data:', error);
          setYearlyIntervalData(null);
        }
      };
      
      fetchYearlyData();
    } else {
      // Clear interval data for monthly reports or when editing
      setYearlyIntervalData(null);
    }
  }, [open, monthly, row, start_date, end_date]);

  const defaultValues = {
    unit_service:
    row?.unit_service ||
    user?.employee?.employee_engagements?.[user.employee.selected_engagement].unit_service?._id,
    employee_engagement: row?.employee_engagement || id,
    start_date: row?.start_date || start_date || null,
    end_date: row?.end_date || end_date || null,
    working_time: row?.working_time || (monthly ? yearlyIntervalData?.working_time : intervalData?.working_time) || hours || 0,
    calculated_time: row?.calculated_time || (monthly ? yearlyIntervalData?.calculated_time : intervalData?.calculated_time) || 0,
    annual: row?.annual || (monthly ? yearlyIntervalData?.annual : intervalData?.annual) || annual || 0,
    sick: row?.sick || (monthly ? yearlyIntervalData?.sick : intervalData?.sick) || sick || 0,
    unpaid: row?.unpaid || (monthly ? yearlyIntervalData?.unpaid : intervalData?.unpaid) || unpaid || 0,
    public: row?.public || (monthly ? yearlyIntervalData?.public : intervalData?.public) || publicHolidays || 0,
    other: row?.other || (monthly ? yearlyIntervalData?.other : intervalData?.other) || other || 0,
    social_security: row?.social_security || (monthly ? yearlyIntervalData?.social_security : intervalData?.social_security) || 0,
    tax: row?.tax || (monthly ? yearlyIntervalData?.tax : intervalData?.tax) || 0,
    deduction: row?.deduction || (monthly ? yearlyIntervalData?.deduction : intervalData?.deduction) || 0,
    total: row?.total || (monthly ? yearlyIntervalData?.total : intervalData?.total) || 0,
    annual_equivalent: row?.annual_equivalent || (monthly ? yearlyIntervalData?.annual_equivalent : intervalData?.annual_equivalent) || 0,
    sick_equivalent: row?.sick_equivalent || (monthly ? yearlyIntervalData?.sick_equivalent : intervalData?.sick_equivalent) || 0,
    unpaid_equivalent: row?.unpaid_equivalent || (monthly ? yearlyIntervalData?.unpaid_equivalent : intervalData?.unpaid_equivalent) || 0,
    public_equivalent: row?.public_equivalent || (monthly ? yearlyIntervalData?.public_equivalent : intervalData?.public_equivalent) || 0,
    other_equivalent: row?.other_equivalent || (monthly ? yearlyIntervalData?.other_equivalent : intervalData?.other_equivalent) || 0,
    note: row?.note || '',
    days: row?.days || (monthly ? yearlyIntervalData?.days : intervalData?.days) || length || 0,
    salary: row?.salary || (monthly ? yearlyIntervalData?.salary : intervalData?.salary) || 0,
  };

  const methods = useForm({
    resolver: yupResolver(attendanceSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Reset form when modal opens - distinguish between create and edit
  useEffect(() => {
    if (open) {
      if (row) {
        // Editing existing report - load all values from backend
        reset({
          unit_service: row.unit_service,
          employee_engagement: row.employee_engagement,
          start_date: row.start_date,
          end_date: row.end_date,
          working_time: row.working_time,
          calculated_time: row.calculated_time,
          annual: row.annual,
          sick: row.sick,
          unpaid: row.unpaid,
          public: row.public,
          other: row.other,
          social_security: row.social_security,
          tax: row.tax,
          deduction: row.deduction,
          total: row.total,
          annual_equivalent: row.annual_equivalent,
          sick_equivalent: row.sick_equivalent,
          unpaid_equivalent: row.unpaid_equivalent,
          public_equivalent: row.public_equivalent,
          other_equivalent: row.other_equivalent,
          note: row.note,
          days: row.days,
          salary: row.salary,
        });
      } else {
        // Creating new report - use fetched data for yearly reports, reset calculated fields for monthly
        const newValues = {
          unit_service: user?.employee?.employee_engagements?.[user.employee.selected_engagement].unit_service?._id,
          employee_engagement: id,
          start_date: start_date || null,
          end_date: end_date || null,
          working_time: monthly ? (yearlyIntervalData?.working_time || hours || 0) : (hours || 0),
          calculated_time: monthly ? (yearlyIntervalData?.calculated_time || 0) : 0,
          annual: monthly ? (yearlyIntervalData?.annual || annual || 0) : (annual || 0),
          sick: monthly ? (yearlyIntervalData?.sick || sick || 0) : (sick || 0),
          unpaid: monthly ? (yearlyIntervalData?.unpaid || unpaid || 0) : (unpaid || 0),
          public: monthly ? (yearlyIntervalData?.public || publicHolidays || 0) : (publicHolidays || 0),
          other: monthly ? (yearlyIntervalData?.other || other || 0) : (other || 0),
          social_security: monthly ? (yearlyIntervalData?.social_security || 0) : 0,
          tax: monthly ? (yearlyIntervalData?.tax || 0) : 0,
          deduction: monthly ? (yearlyIntervalData?.deduction || 0) : 0,
          total: monthly ? (yearlyIntervalData?.total || 0) : 0,
          annual_equivalent: monthly ? (yearlyIntervalData?.annual_equivalent || 0) : 0,
          sick_equivalent: monthly ? (yearlyIntervalData?.sick_equivalent || 0) : 0,
          unpaid_equivalent: monthly ? (yearlyIntervalData?.unpaid_equivalent || 0) : 0,
          public_equivalent: monthly ? (yearlyIntervalData?.public_equivalent || 0) : 0,
          other_equivalent: monthly ? (yearlyIntervalData?.other_equivalent || 0) : 0,
          note: '',
          days: monthly ? (yearlyIntervalData?.days || length || 0) : (length || 0),
          salary: monthly ? (yearlyIntervalData?.salary || 0) : 0,
        };
        reset(newValues);
      }
    }
  }, [open, reset, row, id, start_date, end_date, hours, annual, sick, unpaid, publicHolidays, other, length, user, monthly, yearlyIntervalData]);

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

  // Generate unique key to force re-mounting when switching employees
  const dialogKey = `${row?.employee_engagement || id}-${start_date}-${end_date}-${monthly}`;

  return (
    <Dialog
      key={dialogKey}
      fullWidth
      maxWidth="md"
      open={open}
      onClose={() => {
        methods.reset();
        setYearlyIntervalData(null); // Clear interval data when closing
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
              <RHFHoursMins disabled={monthly && ids.length > 0} type="number" name="annual_equivalent" label={t('Annual equivalent')} />
              <RHFTextField disabled type="number" name="sick" label={t('Sick')} />
              <RHFHoursMins disabled={monthly && ids.length > 0} type="number" name="sick_equivalent" label={t('Sick equivalent')} />
              <RHFTextField disabled type="number" name="unpaid" label={t('Unpaid')} />
              <RHFHoursMins disabled={monthly && ids.length > 0} type="number" name="unpaid_equivalent" label={t('Unpaid equivalent')} />
              <RHFTextField disabled type="number" name="public" label={t('Public')} />
              <RHFHoursMins disabled={monthly && ids.length > 0} type="number" name="public_equivalent" label={t('Public equivalent')} />
              <RHFTextField disabled type="number" name="other" label={t('Other')} />
              <RHFHoursMins disabled={monthly && ids.length > 0} type="number" name="other_equivalent" label={t('Other equivalent')} />
            </Box>
            <Divider />
            <Box
              display="grid"
              columnGap={2}
              rowGap={2}
              gridTemplateColumns={{ xs: 'repeat(2, 1fr)' }}
              alignItems="flex-end"
            >
              <RHFHoursMins
                disabled={monthly && ids.length > 0}
                name="calculated_time"
                label={t('Calculated minutes')}
                button={
                  monthly && ids.length > 0 ? null :
                  <Button
                    onClick={() =>
                      methods.setValue(
                        'calculated_time',
                        values.working_time +
                          values.unpaid_equivalent +
                          values.other_equivalent +
                          values.public_equivalent +
                          values.sick_equivalent +
                          values.annual_equivalent
                      )
                    }
                    sx={{ my: 1 }}
                    size="small"
                    variant="contained"
                    color="primary"
                  >
                    {t('Calculate')}
                  </Button>
                }
              />
              <RHFTextField disabled={monthly && ids.length > 0} type="number" name="salary" label={t('Salary')} />
              <RHFTextField disabled={monthly && ids.length > 0} type="number" name="social_security" label={t('social security')} />
              <RHFTextField disabled={monthly && ids.length > 0} type="number" name="tax" label={t('tax')} />
              <RHFTextField disabled={monthly && ids.length > 0} type="number" name="deduction" label={t('deduction')} />
              <RHFTextField disabled={monthly && ids.length > 0} type="number" name="total" label={t('total')} />
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
  start_date: PropTypes.instanceOf(Date),
  end_date: PropTypes.instanceOf(Date),
  hours: PropTypes.number,
  annual: PropTypes.number,
  sick: PropTypes.number,
  unpaid: PropTypes.number,
  publicHolidays: PropTypes.number,
  other: PropTypes.number,
  length: PropTypes.number,
  ids: PropTypes.array,
  intervalData: PropTypes.object,
};
