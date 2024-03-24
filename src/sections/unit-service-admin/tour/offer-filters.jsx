import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useGetCities, useGetStakeholder } from 'src/api';
// import { useGetStakeholder } from 'src/api/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function TourFilters({
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
  citiesOptions,
  tourGuideOptions,
  serviceOptions,
  //
  dateError,
}) {
  const { tableData } = useGetCities();
  const { stakeholder } = useGetStakeholder();

  const handleFilterStack = useCallback(
    (newValue) => {
      const checked = filters.stakeholder.includes(newValue)
        ? filters.stakeholder.filter((value) => value !== newValue)
        : [...filters.stakeholder, newValue];
      onFilters('stakeholder', checked);
    },
    [filters.stakeholder, onFilters]
  );
  const handleFilterCities = useCallback(
    (newValue) => {
      const checked = filters.cities.includes(newValue)
        ? filters.cities.filter((value) => value !== newValue)
        : [...filters.cities, newValue];
      onFilters('cities', checked);
    },
    [filters.cities, onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('Offer_start_date', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('Offer_end_date', newValue);
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

  const renderDateRange = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Durations
      </Typography>
      <Stack spacing={2.5}>
        <DatePicker
          label="Start date"
          value={filters.start_date}
          onChange={handleFilterStartDate}
        />

        <DatePicker
          label="End date"
          value={filters.end_date}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
            },
          }}
        />
      </Stack>
    </Stack>
  );

  const rendercities = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        cities
      </Typography>
      {tableData.map((option, idx) => (
        <FormControlLabel
          key={idx}
          control={
            <Checkbox
              checked={filters.cities.includes(option._id)}
              onClick={() => handleFilterCities(option._id)}
            />
          }
          label={option?.name_english}
        />
      ))}
    </Stack>
  );

  // const renderTourGuide = (
  //   // <Stack>
  //   //   <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
  //   //     Tour Guide
  //   //   </Typography>

  //   //   <Autocomplete
  //   //     multiple
  //   //     disableCloseOnSelect
  //   //     options={tourGuideOptions}
  //   //     value={filters.tourGuides}
  //   //     onChange={(event, newValue) => handleFilterTourGuide(newValue)}
  //   //     getOptionLabel={(option) => option.name}
  //   //     renderInput={(params) => <TextField placeholder="Select Tour Guides" {...params} />}
  //   //     renderOption={(props, tourGuide) => (
  //   //       <li {...props} key={idx}>
  //   //         <Avatar
  //   //           key={idx}
  //   //           alt={tourGuide.avatarUrl}
  //   //           src={tourGuide.avatarUrl}
  //   //           sx={{ width: 24, height: 24, flexShrink: 0, mr: 1 }}
  //   //         />

  //   //         {tourGuide.name}
  //   //       </li>
  //   //     )}
  //   //     renderTags={(selected, getTagProps) =>
  //   //       selected.map((tourGuide, index, idx)  => (
  //   //         <Chip
  //   //           {...getTagProps({ index })}
  //   //           key={idx}
  //   //           size="small"
  //   //           variant="soft"
  //   //           label={tourGuide.name}
  //   //           avatar={<Avatar alt={tourGuide.name} src={tourGuide.avatarUrl} />}
  //   //         />
  //   //       ))
  //   //     }
  //   //   />
  //   // </Stack>
  //   <></>
  // );

  const renderServices = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        stakeholder
      </Typography>
      {stakeholder.map((option, idx) => (
        <FormControlLabel
          key={idx}
          control={
            <Checkbox
              checked={filters.stakeholder.includes(option._id)}
              onClick={() => handleFilterStack(option._id)}
            />
          }
          label={option?.stakeholder_name}
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
            {renderDateRange}

            {rendercities}

            {/* {renderTourGuide} */}

            {renderServices}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

TourFilters.propTypes = {
  canReset: PropTypes.bool,
  dateError: PropTypes.bool,
  citiesOptions: PropTypes.array,
  filters: PropTypes.object,
  onClose: PropTypes.func,
  onFilters: PropTypes.func,
  onOpen: PropTypes.func,
  onResetFilters: PropTypes.func,
  open: PropTypes.bool,
  serviceOptions: PropTypes.array,
  tourGuideOptions: PropTypes.array,
};
