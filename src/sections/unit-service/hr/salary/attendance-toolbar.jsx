import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import CreateMonthlyReport from './create-monthly-report';

// ----------------------------------------------------------------------

export default function AttendanceToolbar({
  filters,
  onFilters,
  onAdd,
  hours,
  length,
  annual,
  sick,
  unpaid,
  publicHolidays,
  other,
  refetch,
  monthly,
  //
  dateError,
  ids,
}) {
  const { t } = useTranslate();
  const [error, setError] = useState('');

  const popover = usePopover();
  const report = useBoolean();

  const handleFilterStartDate = useCallback(
    (newValue) => {
      if (error) setError('');
      onFilters('startDate', newValue);
    },
    [onFilters, error]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      if (error) setError('');
      onFilters('endDate', newValue);
    },
    [onFilters, error]
  );

  const reportHandler = useCallback(() => {
    if (!filters.startDate || !filters.endDate) {
      setError(true);
      return;
    }
    report.onTrue();
  }, [filters.startDate, filters.endDate, report]);

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
          <Stack justifyContent="flex-start">
            <DatePicker
              label={t('start date')}
              value={filters.startDate}
              onChange={handleFilterStartDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: error ? 'error.main' : '' },
                    },
                  },
                },
              }}
              sx={{
                width: { xs: 1, md: 200 },
              }}
            />
            {error && (
              <Typography variant="caption" color="error">
                {t('please select start and end date')}
              </Typography>
            )}
          </Stack>

          <Stack justifyContent="flex-start">
            <DatePicker
              label={t('end date')}
              value={filters.endDate}
              onChange={handleFilterEndDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: error ? 'error.main' : '' },
                    },
                  },
                },
              }}
              sx={{
                width: { xs: 1, md: 200 },
              }}
            />
            {error && (
              <Typography variant="caption" color="error">
                {t('please select start and end date')}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack justifyContent="center" mx={3}>
          <Button variant="contained" color="primary" onClick={reportHandler}>
            {monthly ? t('make yearly report') : t('make monthly report')}
          </Button>
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
      {report.value && (
        <CreateMonthlyReport
          start_date={filters.startDate}
          end_date={filters.endDate}
          hours={hours}
          annual={annual}
          sick={sick}
          unpaid={unpaid}
          publicHolidays={publicHolidays}
          other={other}
          open={report.value}
          onClose={report.onFalse}
          ids={ids}
          refetch={refetch}
          monthly={monthly}
          length={length}
        />
      )}
    </>
  );
}

AttendanceToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  refetch: PropTypes.func,
  onAdd: PropTypes.func,
  hours: PropTypes.number,
  annual: PropTypes.number,
  length: PropTypes.number,
  sick: PropTypes.number,
  unpaid: PropTypes.number,
  publicHolidays: PropTypes.number,
  other: PropTypes.number,
  ids: PropTypes.array,
  monthly: PropTypes.bool,
};
