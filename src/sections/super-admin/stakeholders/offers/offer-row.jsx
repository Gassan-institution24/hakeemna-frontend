import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ListItemText, Rating } from '@mui/material';
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

export default function OffersTableRow({
  row,
  onView,
  onActivate,
  onInactivate,
  onSelectRow,
  selected,
  setFilters,
  filters,
}) {
  const {
    code,
    name_english,
    comment,
    quantity,
    price,
    currency,
    start_date,
    end_date,
    services,
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

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="center">{code}</TableCell>
      <TableCell align="center">{name_english}</TableCell>
      <TableCell align="center">{comment}</TableCell>
      <TableCell align="center">{quantity}</TableCell>
      <TableCell align="center">
        {currency?.symbol}
        {price}
      </TableCell>
      <TableCell align="center">
        <ListItemText
          primary={isValid(new Date(start_date)) && format(new Date(start_date), 'dd MMM yyyy')}
          secondary={isValid(new Date(start_date)) && format(new Date(start_date), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell align="center">
        <ListItemText
          primary={isValid(new Date(end_date)) && format(new Date(end_date), 'dd MMM yyyy')}
          secondary={isValid(new Date(end_date)) && format(new Date(end_date), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell align="center">{services?.length}</TableCell>
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
              popover.onClose();
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
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="bi:play-fill" />
            activate
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            onView();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
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
    </>
  );
}

OffersTableRow.propTypes = {
  setFilters: PropTypes.func,
  onView: PropTypes.func,
  onInactivate: PropTypes.func,
  onActivate: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
};
