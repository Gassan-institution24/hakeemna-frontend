import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSWorkGroups, useGetUSWorkShifts } from 'src/api';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AppointmentToolbar({
  filters,
  onFilters,
  onAdd,
  //
  dateError,
  options,
}) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { workGroupsData } = useGetUSWorkGroups(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { workShiftsData } = useGetUSWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );

  const popover = usePopover();

  const handleFilterTypes = useCallback(
    (event) => {
      onFilters('types', event.target.value);
    },
    [onFilters]
  );
  const handleFilterWorkShift = useCallback(
    (event) => {
      onFilters('shift', event.target.value);
    },
    [onFilters]
  );
  const handleFilterWorkGroup = useCallback(
    (event) => {
      onFilters('group', event.target.value);
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
        <FormControl
          sx={{
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{`${t('appointment type')}`}</InputLabel>

          <Select
            value={filters.types}
            onChange={handleFilterTypes}
            input={<OutlinedInput label={t('appointment type')} />}
            // renderValue={(selected) =>
            //   options.filter((value) => selected.includes(value._id))[0].name_english
            // }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {curLangAr ? option?.name_arabic : option?.name_english}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{`${t('work group')}`}</InputLabel>

          <Select
            value={filters.group}
            onChange={handleFilterWorkGroup}
            input={<OutlinedInput label={t('work group')} />}
            // renderValue={(selected) =>
            //   selected
            // }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {workGroupsData.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {curLangAr ? option?.name_arabic : option?.name_english}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{`${t('work shift')}`}</InputLabel>

          <Select
            value={filters.shift}
            onChange={handleFilterWorkShift}
            input={<OutlinedInput label={t('work shift')} />}
            // renderValue={(selected) =>
            //   workShiftsData.filter((value) => selected.includes(value._id))[0].name_english
            // }
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {workShiftsData.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {curLangAr ? option?.name_arabic : option?.name_english}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label={t('date')}
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

        {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search customer or invoice number..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          /> */}
        <Stack direction="row">
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
          {ACLGuard({ category: 'employee', subcategory: 'appointments', acl: 'create' }) && (
            <IconButton color="error" onClick={onAdd}>
              <Iconify icon="zondicons:add-outline" />
            </IconButton>
          )}
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
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          {t('print')}
        </MenuItem>

        <MenuItem
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

AppointmentToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onAdd: PropTypes.func,
  options: PropTypes.array,
};
