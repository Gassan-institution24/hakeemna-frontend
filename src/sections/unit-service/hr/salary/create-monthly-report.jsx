import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useParams } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

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
    note: row?.note || '',
  };

  const methods = useForm({
    resolver: yupResolver(attendanceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (monthly) {
        await axiosInstance.post(endpoints.yearlyReport.all, { ...data, ids });
        onClose();
        refetch();
        enqueueSnackbar(t('created successfuly'));
      } else {
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
            >
              <RHFDatePicker name="start_date" label={t('Start date')} />
              <RHFDatePicker name="end_date" label={t('End date')} />
              <RHFTextField type="number" name="working_time" label={t('Working minutes')} />
              <RHFTextField type="number" name="calculated_time" label={t('Calculated minutes')} />
              <RHFTextField type="number" name="annual" label={t('Annual')} />
              <RHFTextField type="number" name="sick" label={t('Sick')} />
              <RHFTextField type="number" name="unpaid" label={t('Unpaid')} />
              <RHFTextField type="number" name="public" label={t('Public')} />
              <RHFTextField type="number" name="other" label={t('Other')} />
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
  ids: PropTypes.array,
};
