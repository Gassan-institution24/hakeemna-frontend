import PropTypes from 'prop-types';

import { Rating } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

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
  const { stakeholder, rate, count, read, notRead } = row;

  const popover = usePopover();

  const overAllRate = rate / count;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{stakeholder.code}</TableCell>
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
        <Rating size="small" readOnly value={overAllRate} precision={0.1} max={5} />
      </TableCell>

      <TableCell align="center">{count}</TableCell>
      <TableCell align="center">{read}</TableCell>
      <TableCell align="center">{notRead}</TableCell>

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
