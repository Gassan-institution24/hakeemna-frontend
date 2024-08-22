import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { zonedTimeToUtc } from 'date-fns-tz';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useUnitTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ConfigTableToolbar({
  filters,
  onFilters,
  onAdd,
  //
  dateError,
}) {
  const { t } = useTranslate();
  const popover = usePopover();

  const { myunitTime } = useUnitTime();

  const { user } = useAuthContext();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      const selectedTime = zonedTimeToUtc(
        newValue,
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?.country?.time_zone || 'Asia/Amman'
      );
      onFilters('startDate', selectedTime);
    },
    [onFilters, user]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      const selectedTime = zonedTimeToUtc(
        newValue,
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?.country?.time_zone || 'Asia/Amman'
      );
      onFilters('endDate', selectedTime);
    },
    [onFilters, user]
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
          label={t('date')}
          value={myunitTime(filters.startDate)}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <DatePicker
          label={t('end date')}
          value={myunitTime(filters.endDate)}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
            },
          }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

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
          <Stack direction="row">
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
            {/* {ACLGuard({
              category: 'employee',
              subcategory: 'appointment_configs',
              acl: 'update',
            }) && (
              <IconButton onClick={onAdd}>
                <Iconify icon="zondicons:add-outline" />
              </IconButton>
            )} */}
          </Stack>
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

ConfigTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onAdd: PropTypes.func,
};
