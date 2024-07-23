import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { useGetInsuranceCos } from 'src/api';
import { RHFAutocomplete, RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';


import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function InvoiceNewEditInsurance({ open, onClose, onSubmit }) {
  const { control, watch } = useFormContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { insuranseCosData } = useGetInsuranceCos()

  const values = watch();

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ pb: 2, textTransform: 'capitalize' }}>
        {t('payment info')}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Typography variant='subtitle2'>{t('amount payed by patient')}</Typography>
          <RHFTextField type='number' name='pay' InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
              </InputAdornment>
            ),
          }} />
          {/* <Typography variant='subtitle2'>{t('insurance coverage')}</Typography> */}
          <RHFTextField name='insurance_number' label='insurance number' sx={{ mt: 2 }} />
          <RHFAutocomplete
            lang="ar"
            sx={{ minWidth: 200 }}
            name="insurance_company"
            label='insurance company'
            options={insuranseCosData.map((one) => one._id)}
            getOptionLabel={(option) =>
              insuranseCosData.find((one) => one._id === option)?.[
              curLangAr ? 'name_arabic' : 'name_english'
              ]
            }
            renderOption={(props, option, idx) => (
              <li lang="ar" {...props} key={idx} value={option}>
                {
                  insuranseCosData.find((one) => one._id === option)?.[
                  curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
              </li>
            )}
          />
          <Stack direction={{ md: 'row' }} alignItems='flex-end' gap={2} minWidth={300}>
            <RHFRadioGroup
              row
              name="insurance_coverage"
              label={t('insurance coverage')}
              options={[
                { label: 'amount', value: 'amount' },
                { label: 'percentage', value: 'percentage' },
              ]}
            />
            {values.insurance_coverage === 'amount' && <RHFTextField type='number' size='small' name='insurance_coverage_amount' sx={{ maxWidth: 200 }} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                </InputAdornment>
              ),
            }} />}
            {values.insurance_coverage === 'percentage' && <RHFTextField type='number' size='small' name='insurance_coverage_percent' sx={{ maxWidth: 200 }} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                </InputAdornment>
              ),
            }} />}
          </Stack>
        </Stack>

      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="contained" onClick={() => {
          onSubmit()
          onClose()
        }}>
          Apply
        </Button>
      </DialogActions>
    </Dialog >
  );
}
InvoiceNewEditInsurance.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
