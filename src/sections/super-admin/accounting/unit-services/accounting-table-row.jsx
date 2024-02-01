import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function MovementTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  console.log('row', row);
  const { unit_service, start_date, end_date, count, payments, user_no, status } = row;

  const confirm = useBoolean();

  const DDL = usePopover();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{unit_service?.code}</TableCell>

        <TableCell align="center">
          <ListItemText
            primary={unit_service?.name_english}
            secondary={unit_service?.city}
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
            primary={
              (isValid(new Date(start_date)) && format(new Date(start_date), 'dd MMM yyyy')) || ''
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell align="center">
          <ListItemText
            primary={
              (isValid(new Date(end_date)) && format(new Date(end_date), 'dd MMM yyyy')) || ''
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
        <TableCell align="center">{count}</TableCell>
        <TableCell align="center">JOD {payments}</TableCell>
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
        <TableCell align="center">{user_no} users</TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={onViewRow}>
            <Iconify icon="mdi:files" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
}

MovementTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
