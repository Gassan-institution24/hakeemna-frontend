import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TableDetailsRow({ row, selected, onEditRow, onSelectRow }) {
  const {
    code,
    symbol,
    name_english,
    relation_to_dollar,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>

      <TableCell>
        <Box>{code}</Box>
      </TableCell>

      <TableCell>{symbol}</TableCell>

      <TableCell>

          {name_english}
      </TableCell>
      <TableCell>

          {relation_to_dollar}
      </TableCell>
      <TableCell>{fDateTime(created_at)}</TableCell>
      <TableCell>{user_creation?.email}</TableCell>
      <TableCell>{ip_address_user_creation}</TableCell>
      <TableCell>{fDateTime(updated_at)}</TableCell>
      <TableCell>{user_modification?.email}</TableCell>
      <TableCell>{ip_address_user_modification}</TableCell>

      <TableCell> {modifications_nums} </TableCell>

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
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="fluent:edit-32-filled" />
          Edit
        </MenuItem>
      </CustomPopover>

    </>
  );
}

TableDetailsRow.propTypes = {
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
