import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField, IconButton, InputAdornment } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TrainingToolbar({
  filters,
  onFilters,
  onAdd,
  //
  dateError,
  options,
}) {
  const { t } = useTranslate();

  const popover = usePopover();

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
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
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{`${t('status')}`}</InputLabel>

          <Select
            value={filters.status}
            onChange={handleFilterStatus}
            input={<OutlinedInput label={t('status')} />}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            <MenuItem lang="ar" value="underreview">
              {t('underreview')}
            </MenuItem>
            <MenuItem lang="ar" value="accepted">
              {t('accepted')}
            </MenuItem>
            <MenuItem lang="ar" value="processing">
              {t('processing')}
            </MenuItem>
            <MenuItem lang="ar" value="finished">
              {t('finished')}
            </MenuItem>
            <MenuItem lang="ar" value="rejected">
              {t('rejected')}
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

        {/* <Stack direction="row">
           <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> 
        {ACLGuard({ category: 'employee', subcategory: 'appointments', acl: 'create' }) && (
          <IconButton color="error" onClick={onAdd}>
            <Iconify icon="zondicons:add-outline" />
          </IconButton>
        )}
      </Stack> */}
      </Stack >
      {/* </Stack> */}

      < CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }
        }
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
      </CustomPopover >
    </>
  );
}

TrainingToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onAdd: PropTypes.func,
  options: PropTypes.array,
};
