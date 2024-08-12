import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField, InputAdornment } from '@mui/material';

import { useGetTicketCategories } from 'src/api';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TicketsToolbar({ filters, onFilters }) {
  const { ticketCategoriesData } = useGetTicketCategories({ select: 'name_english _id' });

  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );
  const handleFilterPriority = useCallback(
    (event) => {
      onFilters('priority', event.target.value);
    },
    [onFilters]
  );
  const handleFilterCategory = useCallback(
    (event) => {
      onFilters('category', event.target.value);
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
            width: { xs: 1, md: 300 },
          }}
        >
          <InputLabel>category</InputLabel>

          <Select
            value={filters.category}
            onChange={handleFilterCategory}
            input={<OutlinedInput label="category" />}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {ticketCategoriesData.map((option, idx) => (
              <MenuItem sx={{ textTransform: 'capitalize' }} lang="ar" key={idx} value={option._id}>
                {option?.name_english}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            width: { xs: 1, md: 300 },
          }}
        >
          <InputLabel>priority</InputLabel>

          <Select
            value={filters.priority}
            onChange={handleFilterPriority}
            input={<OutlinedInput label="priority" />}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
          >
            {['very urgent', 'urgent', 'normal'].map((option, idx) => (
              <MenuItem sx={{ textTransform: 'capitalize' }} lang="ar" key={idx} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search name or number..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row">
          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
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
          print
        </MenuItem>

        <MenuItem
          lang="ar"
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

TicketsToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
