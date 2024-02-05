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
import { Controller, useFormContext } from 'react-hook-form';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import { MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Rating from '@mui/material/Rating';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function AppointmentsFilters({
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
  insuranseCosData,
  paymentMethodsOptions,
  departmentsData,
  countriesOptions,
  citiesOptions,
  unitServicesOptions,
  appointmentTypeOptions,
  dateError,
}) {


  const handleFilterAppointtypes = useCallback(
    (e) => {
      onFilters('appointtypes', e.target.value);
    },
    [onFilters]
  );
  const handleFilterCountries = useCallback(
    (e) => {
      onFilters('countries', e.target.value);
    },
    [onFilters]
  );
  const handleFiltedInsurance = useCallback(
    (e) => {
      onFilters('insurance', e.target.value);
    },
    [onFilters]
  );
  const handleFilterUnitServices = useCallback(
    (e) => {
      onFilters('unitServices', e.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (e) => {
      onFilters('start_date', e.target.value);
    },
    [onFilters]
  );
  const handleFilterEndDate = useCallback(
    (e) => {
      onFilters('end_date', e.target.value);
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

  const renderappointtypes = (
    // <Stack>
    //   <Typography variant="subtitle2" sx={{ mb: 1 }}>
    //     Appointment Types
    //   </Typography>
    //   {appointmentTypeOptions.map((option) => (
    //     <FormControlLabel
    //       key={option._id}
    //       control={
    //         <Radio
    //           checked={option._id === filters.appointtypes}
    //           onClick={() => handleFilterAppointtypes(option._id)}
    //         />
    //       }
    //       label={option.name_english}
    //       sx={{
    //         ...(option === 'all' && {
    //           textTransform: 'capitalize',
    //         }),
    //       }}
    //     />
    //   ))}
    // </Stack>
    <FormControl>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Appointment Types
      </Typography>
      <Select onChange={handleFilterAppointtypes} name="appointment_type">
        {appointmentTypeOptions.map((option) => (
          <MenuItem key={option._id} value={option._id}>
            {option?.name_english}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderCountries = (
    <FormControl>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Countries
      </Typography>
      <Select onChange={handleFilterCountries} name="country">
        {countriesOptions.map((option) => (
          <MenuItem key={option._id} value={option._id}>
            {option?.name_english}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  const renderInsurance = (
    <FormControl>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        insurance
      </Typography>
      <Select onChange={handleFiltedInsurance} name="insurance">
        {insuranseCosData.map((option) => (
          <MenuItem key={option._id} value={option._id}>
            {option?.name_english}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
  const renderRate = (
    <FormControl>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Rate
      </Typography>
      <Select onChange={handleFiltedInsurance} name="insurance" >
        {/* {insuranseCosData.map((option) => ( key={option._id} value={option._id}   ))} */}
      
          <Rating name="read-only" size="small"/>
       
      </Select>
    </FormControl>
  );
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
            {renderappointtypes}

            {/* {renderUnitServices} */}

            {renderCountries}

            {renderInsurance}
            {renderRate}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

AppointmentsFilters.propTypes = {
  citiesOptions: PropTypes.array,
  appointmentTypeOptions: PropTypes.array,
  unitServicesOptions: PropTypes.array,
  countriesOptions: PropTypes.array,
  paymentMethodsOptions: PropTypes.array,
  insuranseCosData: PropTypes.array,
  departmentsData: PropTypes.array,
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onClose: PropTypes.func,
  onFilters: PropTypes.func,
  onOpen: PropTypes.func,
  onResetFilters: PropTypes.func,
  open: PropTypes.bool,
  dateError: PropTypes.bool,
};
