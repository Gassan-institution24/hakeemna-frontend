import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
// import { usePopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

export default function AppointmentSearch({
  filters,
  onSearch,
  onPrint,
  onDownload,
  //
  canReset,
  onResetFilters,
}) {
  const { t } = useTranslate();
  const handleFilterName = useCallback(
    (event) => {
      onSearch(event.target.value);
    },
    [onSearch]
  );
  // const [value, setValue] = useState('');
  return (
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
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          // value={filters?.name}
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
      </Stack>

      {/* {canReset && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      )} */}
    </Stack>
  );
}

AppointmentSearch.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onSearch: PropTypes.func,
  onResetFilters: PropTypes.func,
  onPrint: PropTypes.func,
  onDownload: PropTypes.func,
};
