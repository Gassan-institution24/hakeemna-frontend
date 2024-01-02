import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CountriesTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onActivate,
  onInactivate,
  setFilters,
  filters,
}) {
  const {
    code,
    name_english,
    country,
    city,
    identification_num,
    email,
    US_type,
    sector_type,
    status,
    speciality,
    period_months,
    tax,
    address,
    web_page,
    phone,
    mobile_num,
    ip_address,
    introduction_letter,
    other_information,
    users_num,
    subscriptions,
    insurance,
    last_internet_connection,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;
  const popover = usePopover();
  const DDL = usePopover();
  const details = usePopover();
  const collapse = useBoolean();
  const modal = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="center">{code}</TableCell>
      <TableCell align="center">{name_english}</TableCell>
      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align="center">{identification_num}</TableCell>
      <TableCell align="center">{email}</TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={() => setFilters({ ...filters, name: country?.name_english })}
      >
        {country?.name_english}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={() => setFilters({ ...filters, name: city?.name_english })}
      >
        {city?.name_english}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={() => setFilters({ ...filters, name: US_type?.name_english })}
      >
        {US_type?.name_english}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={() => setFilters({ ...filters, name: sector_type })}
      >
        <Label
          variant="soft"
          color={
            (sector_type === 'active' && 'success') ||
            (sector_type === 'inactive' && 'error') ||
            'default'
          }
        >
          {sector_type}
        </Label>
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={() => setFilters({ ...filters, name: speciality?.name_english })}
      >
        {speciality?.name_english}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {/* <DetailsModal row={row} open={modal.value} onClose={modal.onFalse} /> */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {status === 'active' ? (
          <MenuItem
            onClick={() => {
              onInactivate();
              // popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="ic:baseline-pause" />
            Inactivate
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              onActivate();
              // popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="bi:play-fill" />
            activate
          </MenuItem>
        )}
        <MenuItem onClick={details.onOpen}>
          <Iconify icon="gg:details-more" />
          Details
        </MenuItem>
        <MenuItem onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          DDL
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={DDL.open}
        onClose={DDL.onClose}
        arrow="right-top"
        sx={{
          padding: 2,
          fontSize: '14px',
        }}
      >
        <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(created_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(updated_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_modification?.email}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {modifications_nums}</Box>
      </CustomPopover>

      <CustomPopover
        open={details.open}
        onClose={details.onClose}
        arrow="right-top"
        sx={{
          padding: 2,
          fontSize: '14px',
        }}
      >
        <Box sx={{ fontWeight: 600 }}>subscriptions Period:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{period_months} months</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Tax:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{tax}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>Address:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{address}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Web Page:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{web_page}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Phone no:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{phone}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Mobile no:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{mobile_num}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>IP Address:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Users no:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{users_num}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>subscriptions:</Box>
        {subscriptions.map((one) => (
          <Box sx={{ pb: 1 }}>{one?.name_english}</Box>
        ))}
        <Box sx={{ pt: 1, fontWeight: 600 }}>Insurance:</Box>
        {insurance.map((one) => (
          <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{one?.name_english}</Box>
        ))}

        <Box sx={{ pt: 1, fontWeight: 600 }}>Last Internet Connection:</Box>
        <Box>{last_internet_connection}</Box>
      </CustomPopover>
    </>
  );
}

CountriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  setFilters: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  filters: PropTypes.object,
};
