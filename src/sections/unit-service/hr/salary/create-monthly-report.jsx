import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Box, Typography } from '@mui/material';
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

const steps = ['days', 'hours', 'Salary'];

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
  salary,
  company_contribution_amount,
  employee_contribution_amount,
  ids,
  monthly,
  length,
  intervalData,
  employeeEngagementData,
}) {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [activeStep, setActiveStep] = useState(0);
  const [yearlyIntervalData, setYearlyIntervalData] = useState(null);

  const attendanceSchema = Yup.object().shape({
    start_date: Yup.date().required(),
    end_date: Yup.date().required(),
  });

  // ✅ تحويل دقائق → ساعات
  const formatMinutesToHours = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    if (open && monthly && !row) {
      const fetchYearlyData = async () => {
        try {
          const res = await axiosInstance.get(endpoints.monthlyReport.interval, {
            params: {
              employee_engagement: id,
              startDate: start_date,
              endDate: end_date,
            },
          });
          setYearlyIntervalData(res.data);
        } catch (e) {
          setYearlyIntervalData(null);
        }
      };

      fetchYearlyData();
    }
  }, [open, monthly, row, start_date, end_date, id]);

  const defaultValues = {
    unit_service:
      row?.unit_service ||
      user?.employee?.employee_engagements?.[user.employee.selected_engagement].unit_service?._id,

    employee_engagement: row?.employee_engagement || id,

    start_date: row?.start_date || start_date || null,
    end_date: row?.end_date || end_date || null,

    working_time:
      row?.working_time ||
      (monthly ? yearlyIntervalData?.working_time : intervalData?.working_time) ||
      hours ||
      0,

    days: row?.days || (monthly ? yearlyIntervalData?.days : intervalData?.days) || length || 0,

    annual: row?.annual || annual || 0,
    sick: row?.sick || sick || 0,
    unpaid: row?.unpaid || unpaid || 0,
    public: row?.public || publicHolidays || 0,
    other: row?.other || other || 0,

    annual_equivalent: 0,
    sick_equivalent: 0,
    unpaid_equivalent: 0,
    public_equivalent: 0,
    other_equivalent: 0,

    calculated_time: 0,

    salary: salary || 0,
    over_time: 0,
    extras: 0,
    working_hours_to_work_system: 0,
    tax: 0,
    deduction: 0,
    social_security: 0,

    employee_contribution_amount: employee_contribution_amount || 0,
    company_contribution_amount: company_contribution_amount || 0,

    total: 0,
    note: '',
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

  // ✅ calculated_time AUTO (بالدقائق)
  useEffect(() => {
    const calculated =
      (Number(values.working_time) || 0) +
      (Number(values.unpaid_equivalent) || 0) +
      (Number(values.other_equivalent) || 0) +
      (Number(values.public_equivalent) || 0) +
      (Number(values.sick_equivalent) || 0) +
      (Number(values.annual_equivalent) || 0);

    methods.setValue('calculated_time', calculated);
  }, [
    values.working_time,
    values.unpaid_equivalent,
    values.other_equivalent,
    values.public_equivalent,
    values.sick_equivalent,
    values.annual_equivalent,
    methods,
  ]);

  // ✅ total
  useEffect(() => {
    const total =
      (Number(values.salary) || 0) +
      (Number(values.over_time) || 0) +
      (Number(values.extras) || 0) -
      (Number(values.tax) || 0) -
      (Number(values.deduction) || 0) -
      (Number(values.social_security) || 0) -
      (Number(values.employee_contribution_amount) || 0);

    methods.setValue('total', total);
  }, [values, methods]);

  // ✅ company contribution
  useEffect(() => {
    const company = (Number(values.salary) || 0) * 0.14;
    methods.setValue('company_contribution_amount', company);
  }, [values.salary, methods]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.post(endpoints.monthlyReport.all, { ...data, ids });

      enqueueSnackbar(t('Success'));
      refetch();
      onClose();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{t('Create Monthly report')}</DialogTitle>

          <DialogTitle>
            {t('employee')}:{' '}
            {curLangAr
              ? employeeEngagementData?.employee?.name_arabic
              : employeeEngagementData?.employee?.name_english}
          </DialogTitle>
        </Box>

        <DialogContent dividers>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{t(label)}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* STEP 1 */}
          {activeStep === 0 && (
            <Box display="grid" gap={2} gridTemplateColumns="repeat(2,1fr)">
              <RHFDatePicker disabled name="start_date" label={t('Start date')} />
              <RHFDatePicker disabled name="end_date" label={t('End date')} />
              <RHFHoursMins disabled name="working_time" label={t('Working time')} />
              <RHFTextField disabled name="days" label={t('Days')} />
              <RHFTextField disabled name="annual" label={t('Annual')} />
              <RHFTextField disabled name="sick" label={t('Sick')} />
              <RHFTextField disabled name="unpaid" label={t('Unpaid')} />
              <RHFTextField disabled name="public" label={t('Public')} />
              <RHFTextField disabled name="other" label={t('Other')} />
            </Box>
          )}

          {/* STEP 2 */}
          {activeStep === 1 && (
            <Stack spacing={2}>
              {/* 🔹 SMALL SUMMARY */}
              <Box sx={{ p: 1.5, border: '1px solid #ddd', borderRadius: 1.5 }}>
                <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={1}>
                  <Typography variant="caption">
                    {t('Days')}: {values.days}
                  </Typography>
                  <Typography variant="caption">
                    {t('Annual')}: {values.annual}
                  </Typography>
                  <Typography variant="caption">
                    {t('Sick')}: {values.sick}
                  </Typography>
                  <Typography variant="caption">
                    {t('Unpaid')}: {values.unpaid}
                  </Typography>
                  <Typography variant="caption">
                    {t('Public')}: {values.public}
                  </Typography>
                </Box>
              </Box>

              <Box display="grid" gap={2} gridTemplateColumns="repeat(2,1fr)">
                <RHFHoursMins name="annual_equivalent" label={t('Annual equivalent')} />
                <RHFHoursMins name="sick_equivalent" label={t('Sick equivalent')} />
                <RHFHoursMins name="unpaid_equivalent" label={t('Unpaid equivalent')} />
                <RHFHoursMins name="public_equivalent" label={t('Public equivalent')} />
                <RHFHoursMins name="other_equivalent" label={t('Other equivalent')} />

                <RHFHoursMins name="calculated_time" label={t('Calculated time')} disabled />
              </Box>
            </Stack>
          )}

          {/* STEP 3 */}
          {activeStep === 2 && (
            <Stack spacing={2}>
              {/* 🔹 calculated time display */}
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} alignItems="center">
                {/* 🔹 Display calculated time */}
                <Box
                  sx={{
                    p: 1.5,
                    border: '1px solid #ddd',
                    borderRadius: 1.5,
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2">
                    {t('Calculated time')}: {formatMinutesToHours(values.calculated_time)}
                  </Typography>
                </Box>

                {/* 🔹 Editable input */}
                <RHFTextField
                  type="number"
                  name="working_hours_to_work_system"
                  label={t('Working Hours according to Work System')}
                />
              </Box>

              <Box display="grid" gap={2} gridTemplateColumns="repeat(3,1fr)">
                <RHFTextField type="number" name="salary" label={t('Salary')} />
                <RHFTextField type="number" name="over_time" label={t('Over Time')} />
                <RHFTextField type="number" name="extras" label={t('Extras')} />
                <RHFTextField
                  name="employee_contribution_amount"
                  label={t('Employee contribution')}
                />
                <RHFTextField type="number" name="tax" label={t('Tax')} />
                <RHFTextField type="number" name="deduction" label={t('deduction')} />
                <RHFTextField type="number" name="total" label={t('net salary')} disabled />
              </Box>

              {/* 🔹 company contribution */}
              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                <Typography variant="subtitle1">{t('Company contribution')}</Typography>
                <Typography>{values.company_contribution_amount}</Typography>
              </Box>

              <RHFTextField name="note" label={t('Note')} multiline rows={3} />
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t('Cancel')}</Button>

          {activeStep !== 0 && <Button onClick={handleBack}>{t('previous')}</Button>}

          {activeStep < steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              {t('Next')}
            </Button>
          )}

          {activeStep === steps.length - 1 && (
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('Save')}
            </LoadingButton>
          )}
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
  salary: PropTypes.number,
  company_contribution_amount: PropTypes.number,
  employee_contribution_amount: PropTypes.number,
  annual: PropTypes.number,
  sick: PropTypes.number,
  unpaid: PropTypes.number,
  publicHolidays: PropTypes.number,
  other: PropTypes.number,
  length: PropTypes.number,
  ids: PropTypes.array,
  intervalData: PropTypes.object,
  employeeEngagementData: PropTypes.object,
};
