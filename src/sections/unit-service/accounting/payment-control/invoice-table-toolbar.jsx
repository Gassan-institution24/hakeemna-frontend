import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { Divider, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSPatient, useGetUSActiveEmployeeEngs } from 'src/api';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function InvoiceTableToolbar({
  filters,
  onFilters,
  //
  dateError,
  serviceOptions,
}) {
  const popover = usePopover();
  const { user } = useAuthContext();
  const USData =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { employeesData } = useGetUSActiveEmployeeEngs(USData?._id, {
    select: 'employee',
    populate: [{ path: 'employee', select: 'name_english name_arabic' }],
  });
  const { patientsData } = useGetUSPatient(USData?._id, { select: 'name_english name_arabic' });

  const handleFilterInsurance = useCallback(
    (event) => {
      onFilters('insurance', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (event) => {
      onFilters('type', event.target.value);
    },
    [onFilters]
  );
  const handleFilterPatient = useCallback(
    (event) => {
      onFilters('patient', event.target.value);
    },
    [onFilters]
  );
  const handleFilterEmployee = useCallback(
    (event) => {
      onFilters('employee', event.target.value);
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

  const handleFilterMovement = debounce((event) => {
    onFilters('movement', event.target.value);
  }, 1000); // 1000 milliseconds = 1 second

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
            {patientsData?.map((option) => (
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
          <InputLabel>{t('employee')}</InputLabel>

          <Select
            onChange={handleFilterEmployee}
            input={<OutlinedInput label="employee" />}
            sx={{ textTransform: 'capitalize' }}
            value={filters.employee}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <Divider />
            {employeesData?.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {curLangAr ? option.employee.name_arabic : option.employee.name_english}
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
            input={<OutlinedInput label="type" />}
            sx={{ textTransform: 'capitalize' }}
            value={filters.service}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <Divider />
            {['installment', 'insurance', 'paid']?.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {t(option)}
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
          <InputLabel>{t('insurance')}</InputLabel>

          <Select
            onChange={handleFilterInsurance}
            input={<OutlinedInput label="insurance" />}
            sx={{ textTransform: 'capitalize' }}
            value={filters.service}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <Divider />
            {USData?.insurance?.map((option, idx) => (
              <MenuItem key={idx} value={option?._id}>
                {curLangAr ? option.name_arabic : option.name_english}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          onChange={handleFilterMovement}
          label={t('economic movement')}
          sx={{ textTransform: 'capitalize' }}
        />

        {/* <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack> */}
      </Stack>

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
          <Iconify icon="solar:import-bold" />
          {t('import')}
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

InvoiceTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  serviceOptions: PropTypes.array,
};
