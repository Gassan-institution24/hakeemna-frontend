import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function PaymentDialog({ open, onClose, row, refetch }) {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const defaultValues = useMemo(
    () => ({
      amount: row.required_amount,
      payment_method: 'cash',
    }),
    [row.required_amount]
  );
  const methods = useForm({ defaultValues });

  const handlePayment = methods.handleSubmit(async (data) => {
    try {
      const paymentdata = await axiosInstance.patch(endpoints.income_payment.pay(row._id), data);
      enqueueSnackbar(t('paid successfully'));
      refetch();
      window.open(
        paths.unitservice.accounting.reciepts.info(paymentdata?.data?.receipt_voucher_num),
        '_blank'
      );
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
        variant: 'error',
      });
    }
  });

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <FormProvider methods={methods}>
        <DialogTitle sx={{ pb: 2, textTransform: 'capitalize' }}>{t('payment info')}</DialogTitle>
        <DialogContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle2">
              {t('sequence')} : {row.sequence_number}
            </Typography>
            <Typography variant="subtitle2">
              {t('economic movement')} : {row.economic_movement?.sequence_number}-
              {fDate(row.economic_movement?.created_at, 'yyyy')}
            </Typography>
          </Stack>
          <Stack gap={2}>
            <Stack gap={1}>
              <Typography variant="subtitle2">{t('payment amount')}</Typography>
              <RHFTextField
                type="number"
                name="amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <RHFRadioGroup
              row
              name="payment_method"
              label={t('payment method')}
              options={[
                { label: 'cash', value: 'cash' },
                { label: 'credit card', value: 'credit_card' },
                { label: 'bank transfer', value: 'bank_transfer' },
                { label: 'instant bank transfer', value: 'instant_transfer' },
              ]}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              handlePayment();
              onClose();
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
PaymentDialog.propTypes = {
  open: PropTypes.bool,
  row: PropTypes.object,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
};
