import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';
import { useGetAnalyses, useGetCities } from 'src/api/tables';
import { useGetStackholder } from 'src/api/user';

// ----------------------------------------------------------------------

export default function TourFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const { stackholder } = useGetStackholder();
  const handleRemoveServices = (inputValue) => {
    const newValue = filters.stackholder.filter((item) => item._id !== inputValue._id);
    onFilters('stackholder', newValue);
  };

  const handleRemoveAvailable = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };


  const { tableData } = useGetCities();
  const handleRemoveDestination = (inputValue) => {
    const newValue = filters.cities.filter((item) => item._id !== inputValue._id);
    onFilters('cities', newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results.length}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.startDate && filters.endDate && (
          <Block label="Available:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveAvailable} />
          </Block>
        )}

      

        {!!filters.cities && (
          <Block label="Destination:">
            {tableData
              .filter((data) => filters.cities.includes(data._id))
              .map((item) => (
                <Chip
                  key={item._id}
                  label={item.name_english}
                  size="small"
                  onDelete={() => handleRemoveDestination(item.name_english)}
                />
              ))}
          </Block>
        )}

{!!filters.stackholder && (
          <Block label="stackholder:">
            {stackholder
              .filter((data) => filters.stackholder.includes(data._id))
              .map((item) => (
                <Chip
                  key={item._id}
                  label={item.stakeholder_name}
                  size="small"
                  onDelete={() => handleRemoveServices(item.stakeholder_name)}
                />
              ))}
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

TourFiltersResult.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
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
