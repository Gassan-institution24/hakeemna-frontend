import PropTypes from 'prop-types';
import { Box, Stack, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function TableDetailFilters({
  uniqueUnitServiceTypes,
  uniqueCities,
  uniqueSectors,
  uniqueProvince,
  filters,
  onFilters,
  onReset,
}) {
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    onFilters(field, value === '' ? undefined : value);
  };




  return (
    <Box sx={{ p: 3, bgcolor: 'background.white', borderRadius: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
        }}
      >

        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel>Unit Service Type</InputLabel>
            <Select
              value={filters.USType || ''}
              label="Unit Service Type"
              onChange={handleChange('USType')}
              displayEmpty
              renderValue={(selected) => selected || ''}
            >
              <MenuItem value="">
                <p> </p>
              </MenuItem>
              {uniqueUnitServiceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>


        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel>City</InputLabel>
            <Select
              value={filters.city || ''}
              label="City"
              onChange={handleChange('city')}
              displayEmpty
              renderValue={(selected) => selected || ''}
            >
              <MenuItem value="">
                <p> </p>
              </MenuItem>
              {uniqueCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>


        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel>Sector</InputLabel>
            <Select
              value={filters.sector || ''}
              label="Sector"
              onChange={handleChange('sector')}
              displayEmpty
              renderValue={(selected) => selected || ''}
            >
              <MenuItem value="">
                <p> </p>
              </MenuItem>
              {uniqueSectors.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {sector}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Province */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' } }}>
          <FormControl fullWidth size="small">
            <InputLabel>Province</InputLabel>
            <Select
              value={filters.province || ''}
              label="Province"
              onChange={handleChange('province')}
              displayEmpty
              renderValue={(selected) => selected || ''}
            >
              <MenuItem value="">
                <p> </p>
              </MenuItem>
              {uniqueProvince.map((province) => (
                <MenuItem key={province} value={province}>
                  {province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>


        <Box
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 20%', md: '0 0 auto' },
            display: 'flex',
            justifyContent: 'flex-end',
            minWidth: '100px',
            textAlign: 'right',
          }}
        >
          <Button
            variant="contained"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} height={16} />}
            onClick={onReset}
            size="small"
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              fontSize: '0.75rem',
              padding: '4px 8px',
              '&:hover': {
                bgcolor: '#d32f2f',
                boxShadow: 'none',
              },
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

TableDetailFilters.propTypes = {
  uniqueUnitServiceTypes: PropTypes.array.isRequired,
  uniqueCities: PropTypes.array.isRequired,
  uniqueSectors: PropTypes.array.isRequired,
  uniqueProvince: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  onFilters: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};
