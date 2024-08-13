import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

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

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { RHFTextField, RHFRadioGroup, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditInsurance({ open, onClose, onSubmit }) {
  const { watch, setValue } = useFormContext();

  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const USData =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;

  const values = watch();
  const changeHandler = (e) => {
    setValue(e.target.name, e.target.value);
    if (e.target.name === 'patient_paid') {
      setValue('insurance_coverage_amount', values.totalAmount - e.target.value);
    } else {
      setValue('patient_paid', values.totalAmount - e.target.value);
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2, textTransform: 'capitalize' }}>{t('payment info')}</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Stack gap={1}>
            <Typography variant="subtitle2">{t('amount paid by patient')}</Typography>
            <RHFTextField
              type="number"
              name="patient_paid"
              onChange={changeHandler}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          {values.patient_paid > 0 && (
            <RHFRadioGroup
              row
              name="payment_method"
              label={t('payment method')}
              options={[
                { label: t('cash'), value: 'cash' },
                { label: t('credit card'), value: 'credit_card' },
                { label: t('bank transfer'), value: 'bank_transfer' },
                { label: t('instant bank transfer'), value: 'instant_transfer' },
              ]}
            />
          )}
          <Stack gap={1}>
            <Typography variant="subtitle2">{t('amount covered by insurance')}</Typography>
            <RHFTextField
              type="number"
              name="insurance_coverage_amount"
              onChange={changeHandler}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Stack gap={1}>
            <Typography variant="subtitle2">{t('insurance number')}</Typography>
            <RHFTextField name="insurance_number" />
          </Stack>
          <Stack gap={1}>
            <Typography variant="subtitle2">{t('insurance company')}</Typography>
            <RHFAutocomplete
              lang="ar"
              sx={{ minWidth: 200 }}
              name="insurance_company"
              // label="insurance company"
              options={USData?.insurance?.map((one) => one._id)}
              getOptionLabel={(option) =>
                USData?.insurance?.find((one) => one._id === option)?.[
                curLangAr ? 'name_arabic' : 'name_english'
                ]
              }
              renderOption={(props, option, idx) => (
                <li lang="ar" {...props} key={idx} value={option}>
                  {
                    USData?.insurance?.find((one) => one._id === option)?.[
                    curLangAr ? 'name_arabic' : 'name_english'
                    ]
                  }
                </li>
              )}
            />
          </Stack>
          {/* <Stack direction={{ md: 'row' }} alignItems='flex-end' gap={2} minWidth={300}> */}
          {/* <RHFRadioGroup
              row
              name="insurance_coverage"
              label={t('insurance coverage')}
              options={[
                { label: 'amount', value: 'amount' },
                { label: 'percentage', value: 'percentage' },
                ]}
                /> */}
          {/* {values.insurance_coverage === 'amount' &&  */}

          {/* } */}
          {/* {values.insurance_coverage === 'percentage' && <RHFTextField type='number' size='small' name='insurance_coverage_percent' sx={{ maxWidth: 200 }} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                </InputAdornment>
              ),
            }} />} */}
          {/* </Stack> */}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel')}
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            onSubmit();
            onClose();
          }}
        >
          {t('submit')}
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
