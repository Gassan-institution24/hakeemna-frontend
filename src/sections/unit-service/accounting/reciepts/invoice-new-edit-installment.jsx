import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Stack,
  Button,
  Dialog,
  Divider,
  MenuItem,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import {
  RHFSelect,
  RHFTextField,
  RHFDatePicker,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditInsurance({ open, onClose, onSubmit }) {
  const { control, watch, setValue } = useFormContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payment_details',
  });

  const totalInstallments =
    values.payment_details.reduce((acc, one) => acc + one.amount, 0) + values.patient_paid;

  useEffect(() => {
    setValue('totalInstallments', totalInstallments);
  }, [totalInstallments, setValue]);

  const handleAdd = () => {
    append({
      due_date: values.payment_details?.[values.payment_details.length - 1]?.due_date || new Date(),
      amount: values.totalAmount - values.totalInstallments,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2, textTransform: 'capitalize' }}>{t('payment info')}</DialogTitle>
      <DialogContent>
        <Stack
          divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
          spacing={2}
          paddingTop={2}
        >
          <Stack alignItems="flex-start" spacing={1}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="flex-start"
              spacing={2}
              sx={{ width: 1 }}
            >
              <TextField
                disabled
                fullWidth
                size="small"
                value={t('now')}
                label={t('due date')}
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                size="small"
                type="number"
                name="patient_paid"
                label={t('amount')}
                placeholder="0"
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 200 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFSelect size="small" name="payment_method" label={t('payment method')}>
                {[
                  { label: 'cash', value: 'cash' },
                  { label: 'credit card', value: 'credit_card' },
                  { label: 'bank transfer', value: 'bank_transfer' },
                  { label: 'instant bank transfer', value: 'instant_transfere' },
                ].map((one, idx) => (
                  <MenuItem key={idx} value={one.value}>
                    {t(one.label)}
                  </MenuItem>
                ))}
              </RHFSelect>
              <Box width={200} />
            </Stack>
          </Stack>
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-start" spacing={1}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="flex-start"
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFDatePicker
                  size="small"
                  name={`payment_details[${index}].due_date`}
                  label={t('due date')}
                />
                <RHFTextField
                  size="small"
                  type="number"
                  name={`payment_details[${index}].amount`}
                  label={t('amount')}
                  placeholder="0"
                  InputLabelProps={{ shrink: true }}
                  // sx={{
                  //   maxWidth: { md: 200 },
                  // }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <RHFSelect
                  size="small"
                  name={`payment_details[${index}].payment_method`}
                  label={t('payment method')}
                >
                  {[
                    { label: 'cash', value: 'cash' },
                    { label: 'credit card', value: 'credit_card' },
                    { label: 'bank transfer', value: 'bank_transfer' },
                    { label: 'instant bank transfer', value: 'instant_transfere' },
                  ].map((one, idx) => (
                    <MenuItem key={idx} value={one.value}>
                      {t(one.label)}
                    </MenuItem>
                  ))}
                </RHFSelect> */}
                <Button
                  size="small"
                  color="error"
                  sx={{ width: 50 }}
                  tabIndex={-1}
                  onClick={() => handleRemove(index)}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </Button>
              </Stack>
            </Stack>
          ))}

          <Stack
            spacing={3}
            mb={2}
            direction={{ xs: 'column', md: 'row' }}
            // justifyContent="flex-start"
            alignItems={{ xs: 'flex-end', md: 'center' }}
          >
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAdd}
              sx={{ flexShrink: 0 }}
            >
              {t('add installment')}
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Stack
          my={1}
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{ textAlign: 'right', typography: 'body2' }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ color: 'text.secondary' }}>{t('invoice total amount')}:</Box>
            <Box sx={{ typography: 'subtitle2' }}>
              <RHFTextField
                disabled
                type="number"
                name="totalAmount"
                size="small"
                sx={{
                  width: 160,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ color: 'text.secondary' }}>{t('installments total amount')}:</Box>
            <Box>
              <RHFTextField
                type="number"
                name="totalInstallments"
                size="small"
                sx={{
                  width: 160,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>
        </Stack>
        <Divider />
        {/* <Divider sx={{ mt: 1, mb: 1, borderStyle: 'dashed' }} /> */}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={values.totalAmount !== values.totalInstallments}
          variant="contained"
          onClick={() => {
            onSubmit();
            onClose();
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
InvoiceNewEditInsurance.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
