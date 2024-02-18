import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

export default function AppointmentSearch({   filters,
  onSearch,
  onPrint,
  onDownload,
  //
  canReset,
  onResetFilters, }) {
    const popover = usePopover();

    const { t } = useTranslate();
    const handleFilterName = useCallback(
      (event) => {
        onSearch(event.target.value);
      },
      [onSearch]
    );
  // const [value, setValue] = useState('');
  return (
    // <Input
    //   sx={{
    //     border: 1,
    //     borderRadius: '8px',
    //     borderColor: 'grey.400',
    //     padding: '7px',
    //     '&::placeholder': {
    //       color: 'red', 
    //     },
    //   }}
    //   placeholder="Search..."
    //   startAdornment={
    //     <InputAdornment position="start">
    //       <Iconify icon="iconamoon:search" sx={{ color: 'text.disabled' }} />
    //     </InputAdornment>
    //   }
    //   value={value}
    //   onChange={(e) => setValue(e.target.value)}
    //   disableUnderline
    // />
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

      <IconButton onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>

    {canReset && (
      <Button
        color="error"
        sx={{ flexShrink: 0 }}
        onClick={onResetFilters}
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
      >
        Clear
      </Button>
    )}
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
