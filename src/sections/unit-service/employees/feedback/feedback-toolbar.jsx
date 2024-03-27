import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Rating } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TablesTableToolbar({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
}) {
  const { t } = useTranslate();
  // const { currentLang } = useLocales();
  // const curLangAr = currentLang.value === 'ar';

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );
  const handleFilterRate = useCallback(
    (event) => {
      onFilters(
        'rate',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );
  const rateOptions = [1, 2, 3, 4, 5];

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
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>{t('rate')}</InputLabel>

        <Select
          multiple
          value={filters.rate}
          onChange={handleFilterRate}
          input={<OutlinedInput label={t('rate')} />}
          renderValue={(selected) => selected.map((value, idx) => value).join(', ')}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 240 },
            },
          }}
        >
          {rateOptions.map((option, idx) => (
            <MenuItem lang="ar" key={idx} value={option}>
              <Checkbox disableRipple size="small" checked={filters.rate.includes(option)} />
              <Rating size="small" readOnly value={option} precision={0.1} max={5} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder={t('Search name or number...')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {canReset && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          {t('clear')}
        </Button>
      )}
    </Stack>
  );
}

TablesTableToolbar.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
};
