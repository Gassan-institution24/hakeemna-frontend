import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, InputLabel, FormControl, OutlinedInput } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OrderTableToolbar({
  filters,
  onFilters,
  onPrint,
  onDownload,
  //
  canReset,
  onResetFilters,
}) {
  const popover = usePopover();

  const { t } = useTranslate();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );
  const handleFilterRole = useCallback(
    (event) => {
      onFilters('role', event.target.value);
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
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Role</InputLabel>

          <Select
            value={filters.role}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Role" />}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            <MenuItem lang="ar" value="admin">
              admin
            </MenuItem>
            <MenuItem lang="ar" value="superadmin">
              superadmin
            </MenuItem>
            <MenuItem lang="ar" value="employee">
              employee
            </MenuItem>
            <MenuItem lang="ar" value="patient">
              patient
            </MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
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

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          lang="ar"
          onClick={() => {
            onPrint();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          lang="ar"
          onClick={() => {
            onDownload();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        {/* <MenuItem lang="ar" 
          onClick={() => {
            onDownload()
            popover.onClose();

          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem> */}
      </CustomPopover>
    </>
  );
}

OrderTableToolbar.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  onPrint: PropTypes.func,
  onDownload: PropTypes.func,
};
