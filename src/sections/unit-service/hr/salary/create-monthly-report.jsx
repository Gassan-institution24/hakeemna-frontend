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
  company_contribution,
  employee_contribution,
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

  const [activeStep, setActiveStep] = useState(0);
  const [yearlyIntervalData, setYearlyIntervalData] = useState(null);
  console.log(yearlyIntervalData, 'yearlyIntervalData');
  const attendanceSchema = Yup.object().shape({
    start_date: Yup.date().required(),
    end_date: Yup.date().required(),

    salary: Yup.number(),
    tax: Yup.number(),
    deduction: Yup.number(),
    social_security: Yup.number(),

    company_contribution: Yup.number(),
    employee_contribution: Yup.number(),

    over_time: Yup.number(),
    extras: Yup.number(),
  });

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

    annual_equivalent: row?.annual_equivalent || 0,
    sick_equivalent: row?.sick_equivalent || 0,
    unpaid_equivalent: row?.unpaid_equivalent || 0,
    public_equivalent: row?.public_equivalent || 0,
    other_equivalent: row?.other_equivalent || 0,

    calculated_time: row?.calculated_time || 0,

    salary: salary || 0,

    over_time: row?.over_time || 0,
    extras: row?.extras || 0,

    social_security: row?.social_security || 0,
    tax: row?.tax || 0,
    deduction: row?.deduction || 0,

    employee_contribution: employee_contribution || 0,
    company_contribution: company_contribution || 0,

    total: row?.total || 0,

    note: row?.note || '',
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
  useEffect(() => {
    if (monthly) return;
    // eslint-disable-next-line no-shadow
    const salary = Number(values.salary) || 0;
    const overtime = Number(values.over_time) || 0;
    const extras = Number(values.extras) || 0;
    const tax = Number(values.tax) || 0;
    const deduction = Number(values.deduction) || 0;
    const social = Number(values.social_security) || 0;
    const employee = Number(values.employee_contribution) || 0;

    const total = salary + overtime + extras - tax - deduction - social - employee ;

    methods.setValue('total', total);
  }, [
    monthly,
    values.salary,
    values.over_time,
    values.extras,
    values.tax,
    values.deduction,
    values.social_security,
    values.employee_contribution,
    values.company_contribution,
    methods,
  ]);
  useEffect(() => {
    if (monthly && yearlyIntervalData) {
      methods.setValue('working_time', yearlyIntervalData.working_time || 0);
      methods.setValue('calculated_time', yearlyIntervalData.calculated_time || 0);

      methods.setValue('days', yearlyIntervalData.days || 0);

      methods.setValue('annual', yearlyIntervalData.annual || 0);
      methods.setValue('sick', yearlyIntervalData.sick || 0);
      methods.setValue('unpaid', yearlyIntervalData.unpaid || 0);
      methods.setValue('public', yearlyIntervalData.public || 0);
      methods.setValue('other', yearlyIntervalData.other || 0);

      methods.setValue('annual_equivalent', yearlyIntervalData.annual_equivalent || 0);
      methods.setValue('sick_equivalent', yearlyIntervalData.sick_equivalent || 0);
      methods.setValue('unpaid_equivalent', yearlyIntervalData.unpaid_equivalent || 0);
      methods.setValue('public_equivalent', yearlyIntervalData.public_equivalent || 0);
      methods.setValue('other_equivalent', yearlyIntervalData.other_equivalent || 0);

      methods.setValue('salary', yearlyIntervalData.salary || 0);
      methods.setValue('tax', yearlyIntervalData.tax || 0);
      methods.setValue('deduction', yearlyIntervalData.deduction || 0);
      methods.setValue('social_security', yearlyIntervalData.social_security || 0);

      methods.setValue('total', yearlyIntervalData.total || 0);
    }
  }, [monthly, yearlyIntervalData, methods]);
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (monthly) {
        if (row) {
          await axiosInstance.patch(endpoints.yearlyReport.one(row._id), data);
        } else {
          await axiosInstance.post(endpoints.yearlyReport.all, { ...data, ids });
        }
      } else if (row) {
        await axiosInstance.patch(endpoints.monthlyReport.one(row._id), data);
      } else {
        await axiosInstance.post(endpoints.monthlyReport.all, { ...data, ids });
      }

      enqueueSnackbar(t('Success'));
      refetch();
      onClose();
    } catch (error) {
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
    }
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {monthly ? t('Create Yearly report') : t('Create Monthly report')}
        </DialogTitle>

        <DialogContent dividers>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{t(label)}</StepLabel>
              </Step>
            ))}
          </Stepper>

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

          {activeStep === 1 && (
            <Box display="grid" gap={2} gridTemplateColumns="repeat(2,1fr)">
              <RHFHoursMins name="annual_equivalent" label={t('Annual equivalent')} />
              <RHFHoursMins name="sick_equivalent" label={t('Sick equivalent')} />
              <RHFHoursMins name="unpaid_equivalent" label={t('Unpaid equivalent')} />
              <RHFHoursMins name="public_equivalent" label={t('Public equivalent')} />
              <RHFHoursMins name="other_equivalent" label={t('Other equivalent')} />

              <RHFHoursMins name="calculated_time" label={t('Calculated time')} />

              <Button
                variant="contained"
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
              >
                {t('Calculate')}
              </Button>
            </Box>
          )}

          {activeStep === 2 && (
            <Stack spacing={2}>
              <Box display="grid" gap={2} gridTemplateColumns="repeat(3,1fr)">
                <RHFTextField type="number" name="salary" label={t('Salary')} />
                <RHFTextField type="number" name="over_time" label={t('Over Time')} />
                <RHFTextField type="number" name="extras" label={t('Extras')} />
                {!yearlyIntervalData && (
                  <RHFTextField name="employee_contribution" label={t('Employee contribution')} />
                )}
                <RHFTextField type="number" name="tax" label={t('tax')} />
                <RHFTextField type="number" name="deduction" label={t('deduction')} />

                <RHFTextField type="number" name="total" label={t('net salary')} disabled />
              </Box>
              <RHFTextField name="note" label={t('Note')} multiline rows={3} />

              {!yearlyIntervalData && (
                <>
                  {/* <RHFTextField name="employee_contribution" label={t('Employee contribution')} /> */}
                  <RHFTextField name="company_contribution" label={t('Company contribution')} />
                </>
              )}
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
  company_contribution: PropTypes.number,
  employee_contribution: PropTypes.number,
  annual: PropTypes.number,
  sick: PropTypes.number,
  unpaid: PropTypes.number,
  publicHolidays: PropTypes.number,
  other: PropTypes.number,
  length: PropTypes.number,
  ids: PropTypes.array,
  intervalData: PropTypes.object,
};
