import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function MovementTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const { stakeholder, start_date, end_date, count, payments, user_no, status } = row;
  const popover = usePopover();

  return (
    <TableRow hover selected={selected}>
      <TableCell>{stakeholder?.code}</TableCell>

      <TableCell align="center">
        <ListItemText
          primary={stakeholder?.name_english}
          secondary={stakeholder?.city}
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
          primary={(isValid(new Date(end_date)) && format(new Date(end_date), 'dd MMM yyyy')) || ''}
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
