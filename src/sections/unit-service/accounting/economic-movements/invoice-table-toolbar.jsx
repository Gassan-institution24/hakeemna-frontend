import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function InvoiceTableToolbar({
  filters,
  onFilters,
  //
  dateError,
  unitServices,
  patients,
  stakeholders,
}) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const handleFilterPatient = useCallback(
    (event) => {
      onFilters('patient', event.target.value);
    },
    [onFilters]
  );
  const handleFilterStakeholder = useCallback(
    (event) => {
      onFilters('stakeholder', event.target.value);
    },
    [onFilters]
  );
  const handleFilterType = useCallback(
    (event) => {
      onFilters('type', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <DatePicker
        label={t('start date')}
        value={filters.startDate}
        onChange={handleFilterStartDate}
        slotProps={{ textField: { fullWidth: true } }}
        sx={{
          maxWidth: { md: 180 },
        }}
      />

      <DatePicker
        label={t('end date')}
        value={filters.endDate}
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: dateError,
            helperText: dateError && t('End date must be later than start date'),
          },
        }}
        sx={{
          maxWidth: { md: 180 },
          [`& .${formHelperTextClasses.root}`]: {
            position: { md: 'absolute' },
            bottom: { md: -40 },
          },
        }}
      />

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>{t('patient')}</InputLabel>

        <Select
          onChange={handleFilterPatient}
          input={<OutlinedInput label="patient" />}
          sx={{ textTransform: 'capitalize' }}
          value={filters.patient}
        >
          <MenuItem value="">{t('all')}</MenuItem>
          <Divider />
          {patients?.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {curLangAr ? option.name_arabic : option.name_english}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>{t('stakeholder')}</InputLabel>

        <Select
          onChange={handleFilterStakeholder}
          input={<OutlinedInput label="stakeholder" />}
          sx={{ textTransform: 'capitalize' }}
          value={filters.stakeholder}
        >
          <MenuItem value={null}>{t('all')}</MenuItem>
          <Divider />
          {stakeholders?.map((option) => (
            <MenuItem key={option._id} value={option?._id}>
              {curLangAr ? option.name_arabic : option.name_english}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 180 },
        }}
      >
        <InputLabel>{t('type')}</InputLabel>

        <Select
          onChange={handleFilterType}
          input={<OutlinedInput label={t('type')} />}
          sx={{ textTransform: 'capitalize' }}
          value={filters.type}
        >
          <MenuItem value={null}>{t('all')}</MenuItem>
          <Divider />
          <MenuItem value="income"> {t('income')} </MenuItem>
          <MenuItem value="expences"> {t('expences')} </MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

InvoiceTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  unitServices: PropTypes.array,
  patients: PropTypes.array,
  stakeholders: PropTypes.array,
};
