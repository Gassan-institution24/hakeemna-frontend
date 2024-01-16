import { useState } from 'react';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import BookManually from './book-appointment-manually';

// ----------------------------------------------------------------------

export default function AppointmentsTableRow({
  row,
  selected,
  onSelectRow,
  refetch,
  onViewRow,
  onDelayRow,
  onCancelRow,
  onUnCancelRow,
  onDeleteRow,
}) {
  const {
    _id,
    code,
    name_english,
    unit_service,
    work_group,
    work_shift,
    appointment_type,
    payment_method,
    date,
    price,
    currency,
    patient,
    start_time,
    end_time,
    status,
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
  const confirmDelayOne = useBoolean();
  const Book = useBoolean();

  const [minToDelay, setMinToDelay] = useState(0);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center">{code}</TableCell>
        <TableCell align="center">{appointment_type?.name_english}</TableCell>
        <TableCell align="center">{work_group?.name_english}</TableCell>
        <TableCell align="center">{work_shift?.name_english}</TableCell>
        <TableCell align="center">{patient?.first_name} {patient?.last_name}</TableCell>

        <TableCell align="center">
          <ListItemText
            primary={isValid(new Date(start_time)) && format(new Date(start_time), 'p')}
            secondary={isValid(new Date(start_time)) && format(new Date(start_time), 'dd MMM yyyy')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'available' && 'secondary') ||
              (status === 'pending' && 'warning') ||
              (status === 'Processing' && 'info') ||
              (status === 'finished' && 'success') ||
              (status === 'canceled' && 'error') ||
              (status === 'not booked' && 'secondary') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <BookManually
        refetch={refetch}
        appointment_id={_id}
        open={Book.value}
        onClose={Book.onFalse}
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 155 }}
      >
        {status === 'available' && (
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => {
              Book.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:register" />
            Book Manually
          </MenuItem>
        )}
        {status !== 'canceled' && (
          <MenuItem
            onClick={() => {
              onCancelRow();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="mdi:bell-cancel" />
            Cancel
          </MenuItem>
        )}
        {status === 'canceled' && (
          <MenuItem
            onClick={() => {
              onUnCancelRow();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="material-symbols-light:notifications-active-rounded" />
            uncancel
          </MenuItem>
        )}
        <MenuItem onClick={confirmDelayOne.onTrue}>
          <Iconify icon="mdi:timer-sync" />
          Delay
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
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={format(new Date(created_at), 'dd MMM yyyy')}
            secondary={format(new Date(created_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_modification?.email}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {modifications_nums}</Box>
      </CustomPopover>
      <ConfirmDialog
        open={confirmDelayOne.value}
        onClose={confirmDelayOne.onFalse}
        title="Delay"
        content={
          <>
            How many minutes do you want to delay?
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ fontSize: '0.8rem' }}>min</Box>
                  </InputAdornment>
                ),
              }}
              type="number"
              sx={{ p: 2, width: '100%' }}
              size="small"
              onChange={(e) => setMinToDelay(e.target.value)}
            />
          </>
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              confirmDelayOne.onFalse();
              onDelayRow(_id, minToDelay);
            }}
          >
            Delay
          </Button>
        }
      />
    </>
  );
}

AppointmentsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDelayRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
