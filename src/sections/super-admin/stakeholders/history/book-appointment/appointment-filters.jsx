import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { RHFSelect } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function JobFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  paymentMethodsOptions,
  countriesOptions,
  citiesOptions,
  unitServicesOptions,
  appointmentTypeOptions,
  dateError,
}) {
  const [selectedCountry, setSelectedCountry] = useState('');

  const [cities, setCities] = useState([]);

  const handleFilterAppointtypes = useCallback(
    (newValue) => {
      onFilters('appointtypes', newValue);
    },
    [onFilters]
  );
  const handleFilterPaymentMethod = useCallback(
    (newValue) => {
      onFilters('payment_methods', newValue);
    },
    [onFilters]
  );
  const handleFilterCountries = useCallback(
    (newValue) => {
      setSelectedCountry(newValue);
      onFilters('countries', newValue);
    },
    [onFilters]
  );
  const handleFilterUnitServices = useCallback(
    (newValue) => {
      onFilters('unitServices', newValue);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('start_date', newValue);
    },
    [onFilters]
  );
  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('end_date', newValue);
    },
    [onFilters]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderDate = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Time
      </Typography>
      <Stack spacing={2.5}>
        <DatePicker label="From" value={filters.start_date} onChange={handleFilterStartDate} />

        <DatePicker
          label="To"
          value={filters.end_date}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && 'To time must be later than start date',
            },
          }}
        />
      </Stack>
    </Stack>
  );

  const renderappointmentPaymentMethods = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Payment Methods
      </Typography>
      {paymentMethodsOptions.map((option) => (
        <FormControlLabel
          key={option._id}
          control={
            <Radio
              checked={option._id === filters.payment_methods}
              onClick={() => handleFilterPaymentMethod(option._id)}
            />
          }
          label={option.name_english}
          sx={{
            ...(option === 'all' && {
              textTransform: 'capitalize',
            }),
          }}
        />
      ))}
    </Stack>
  );

  const renderappointtypes = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Appointment Types
      </Typography>
      {appointmentTypeOptions.map((option) => (
        <FormControlLabel
          key={option._id}
          control={
            <Radio
              checked={option._id === filters.appointtypes}
              onClick={() => handleFilterAppointtypes(option._id)}
            />
          }
          label={option.name_english}
          sx={{
            ...(option === 'all' && {
              textTransform: 'capitalize',
            }),
          }}
        />
      ))}
    </Stack>
  );

  // const renderCountries = (
  //   <Stack>
  //     <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //       Countries
  //     </Typography>
  //     <RHFSelect native onChange={handleFilterCountries} name="country" label="Country">
  //           <MenuItem>{null}</MenuItem>
  //           {countriesOptions.map((country) => (
  //             <MenuItem key={country._id} value={country._id}>
  //               {country.name_english}
  //             </MenuItem>
  //           ))}
  //         </RHFSelect>
  //   </Stack>
  // );

  const renderUnitServices = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Unit services
      </Typography>
      {unitServicesOptions.map((option) => (
        <FormControlLabel
          key={option._id}
          control={
            <Radio
              checked={option._id === filters.unitServices}
              onClick={() => handleFilterUnitServices(option._id)}
            />
          }
          label={option.name_english}
          sx={{
            ...(option === 'all' && {
              textTransform: 'capitalize',
            }),
          }}
        />
      ))}
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderDate}

            {renderUnitServices}

            {/* {renderCountries} */}

            {renderappointtypes}

            {renderappointmentPaymentMethods}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

JobFilters.propTypes = {
  citiesOptions: PropTypes.array,
  appointmentTypeOptions: PropTypes.array,
  unitServicesOptions: PropTypes.array,
  countriesOptions: PropTypes.array,
  paymentMethodsOptions: PropTypes.array,
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onClose: PropTypes.func,
  onFilters: PropTypes.func,
  onOpen: PropTypes.func,
  onResetFilters: PropTypes.func,
  open: PropTypes.bool,
  dateError: PropTypes.bool,
};
