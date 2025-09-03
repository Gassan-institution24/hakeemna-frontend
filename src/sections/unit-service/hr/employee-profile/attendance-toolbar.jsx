import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AttendanceToolbar({
  filters,
  onFilters,
  onAdd,
  hours,
  //
  dateError,
  options,
  onShowUnattendanceChange,
}) {
  const { t } = useTranslate();
  // const { user } = useAuthContext();
  // const { currentLang } = useLocales();
  // const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();

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

  const handleUnattendanceCheckbox = useCallback(
    (event) => {
      const isChecked = event.target.checked;
      onFilters('showUnattendance', isChecked);
      if (onShowUnattendanceChange) {
        onShowUnattendanceChange(isChecked);
      }
    },
    [onFilters, onShowUnattendanceChange]
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
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
              width: { xs: 1, md: 200 },
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
              },
            }}
            sx={{
              width: { xs: 1, md: 200 },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={filters.showUnattendance || false}
                onChange={handleUnattendanceCheckbox}
                color="primary"
              />
            }
            label={t('Find missing attendance records')}
            sx={{
              minWidth: { xs: 'auto', md: 200 },
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          lang="ar"
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          {t('print')}
        </MenuItem>

        <MenuItem
          lang="ar"
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          {t('export')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AttendanceToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onAdd: PropTypes.func,
  options: PropTypes.array,
  hours: PropTypes.number,
  onShowUnattendanceChange: PropTypes.func,
};
