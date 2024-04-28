import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { MenuItem } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useTranslate } from 'src/locales';

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
  dataFiltered,
  insuranseCosData,
  countriesOptions,
  appointmentTypeOptions,
  dateError,
}) {
  const { t } = useTranslate();
  // const handleFilterAppointtypes = useCallback(
  //   (e) => {
  //     onFilters('appointtypes', e.target.value);
  //   },
  //   [onFilters]
  // );
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

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('Filters')}
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

  // const renderappointtypes = (
  //   <FormControl>
  //     <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //       {t('Appointment Types')}
  //     </Typography>
  //     <Select onChange={handleFilterAppointtypes} name="appointment_type">
  //       {appointmentTypeOptions?.map((option, idx) => (
  //         <MenuItem lang="ar" key={idx} value={option._id}>
  //           {option?.name_english}
  //         </MenuItem>
  //       ))}
  //     </Select>
  //   </FormControl>
  // );
  const renderCountries = (
    <FormControl>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('Countries')}
      </Typography>
      <Select onChange={handleFilterCountries} name="country">
        {countriesOptions?.map((option, idx) => (
          <MenuItem lang="ar" key={idx} value={option._id}>
            {option?.name_english}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderInsurance = (
    <FormControl>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {t('insurance')}
      </Typography>
      <Select onChange={handleFiltedInsurance} name="insurance">
        {insuranseCosData?.map((option, idx) => (
          <MenuItem lang="ar" key={idx} value={option._id}>
            {option?.name_english}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
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
        {t('Filters')}
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
            {/* {renderDate} */}

            {renderCountries}

            {renderInsurance}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

AppointmentsFilters.propTypes = {
  appointmentTypeOptions: PropTypes.array,
  countriesOptions: PropTypes.array,
  dataFiltered: PropTypes.array,
  insuranseCosData: PropTypes.array,
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onClose: PropTypes.func,
  onFilters: PropTypes.func,
  onOpen: PropTypes.func,
  onResetFilters: PropTypes.func,
  open: PropTypes.bool,
  dateError: PropTypes.bool,
};
