import { format,isValid } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Rating } from '@mui/material';
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
  const {
    stakeholder,
    rate,
    count,
    read,
    notRead,
  } = row;

  const confirm = useBoolean();

  const DDL = usePopover();
  const popover = usePopover();

  const overAllRate = rate/count

  return (
    <>
      <TableRow hover selected={selected}>

        <TableCell >
          {stakeholder.code}
        </TableCell>
        <TableCell>
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

        <TableCell>
        <Rating size="small" readOnly value={overAllRate} precision={0.1} max={5} />
        </TableCell>

        <TableCell>
          {count}
        </TableCell>
        <TableCell>
          {read}
        </TableCell>
        <TableCell>
          {notRead}
        </TableCell>

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
