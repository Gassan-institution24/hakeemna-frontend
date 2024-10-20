import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
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

  return (
    <>
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

        <Stack direction="row" justifyContent='flex-end' flex={1} mr={3}>
          {hours > 60 ? `${Math.floor(hours / 60)} : ${(hours % 60).toString().padStart(2, '0')} hr` : `${hours} min`}
          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
      </Stack>
      {/* </Stack> */}

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
};
