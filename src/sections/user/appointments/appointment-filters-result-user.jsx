import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export default function JobFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  paymentMethodsOptions,
  countriesOptions,
  citiesOptions,
  unitServicesOptions,
  appointmentTypeOptions,
  ...other
}) {
  const shortLabel = shortDateLabel(filters.start_date, filters.end_date);

  const handleRemoveTime = () => {
    onFilters('start_date', null);
    onFilters('end_date', null);
  };

  // const handleRemoveAppointmentTypes = () => {
  //   onFilters('appointtypes', 'all');
  // };

  const handleRemovePaymentMethod = () => {
    onFilters('payment_methods', 'all');
  };
  const handleRemoveCountries = () => {
    onFilters('countries', 'all');
  };
  const handleRemoveUnitServices = () => {
    onFilters('unitServices', 'all');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.start_date && filters.end_date && (
          <Block label="Time:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveTime} />
          </Block>
        )}

        {/* {filters.appointtypes !== 'all' && (
          <Block label="Appointment Types:">
            <Chip
              size="small"
              label={
                appointmentTypeOptions.filter((type) => type._id === filters.appointtypes)[0]
                  .name_english
              }
              onDelete={handleRemoveAppointmentTypes}
            />
          </Block>
        )} */}

        {filters.payment_methods !== 'all' && (
          <Block label="Payment Methods:">
            <Chip
              size="small"
              label={
                paymentMethodsOptions.filter((type) => type._id === filters.payment_methods)[0]
                  .name_english
              }
              onDelete={handleRemovePaymentMethod}
            />
          </Block>
        )}
        {filters.countries !== 'all' && (
          <Block label="Countries:">
            <Chip
              size="small"
              label={
                countriesOptions.filter((type) => type._id === filters.countries)[0].name_english
              }
              onDelete={handleRemoveCountries}
            />
          </Block>
        )}
        {filters.unitServices !== 'all' && (
          <Block label="units of service:">
            <Chip
              size="small"
              label={
                unitServicesOptions.filter((type) => type._id === filters.unitServices)[0]
                  .name_english
              }
              onDelete={handleRemoveUnitServices}
            />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

JobFiltersResult.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
  citiesOptions: PropTypes.array,
  appointmentTypeOptions: PropTypes.array,
  unitServicesOptions: PropTypes.array,
  countriesOptions: PropTypes.array,
  paymentMethodsOptions: PropTypes.array,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
