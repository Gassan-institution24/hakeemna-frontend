import PropTypes from 'prop-types';
import {isValid,format} from 'date-fns';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {ListItemText,Rating} from '@mui/material';
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

export default function OffersTableRow({ row, onEditRow, setFilters, filters }) {
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
  } = row;
  const popover = usePopover();
  const DDL = usePopover();

  const renderPrimary = (
    <TableRow hover>
      <TableCell>{code}</TableCell>
      <TableCell>{name_english}</TableCell>
      <TableCell>{comment}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>
        {currency} {price}
      </TableCell>
      <TableCell><ListItemText
            primary={isValid(new Date(start_date)) && format(new Date(start_date), 'dd MMM yyyy')}
            secondary={isValid(new Date(start_date)) && format(new Date(start_date), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          /></TableCell>
      <TableCell><ListItemText
            primary={isValid(new Date(end_date)) && format(new Date(end_date), 'dd MMM yyyy')}
            secondary={isValid(new Date(end_date)) && format(new Date(end_date), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
            /></TableCell>
            <TableCell>{services?.length}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={(status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'}
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
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
        <Box sx={{ pb: 1 }}>{ip_address_user_creation}</Box>
      </CustomPopover>
    </>
  );
}

OffersTableRow.propTypes = {
  setFilters: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
};
