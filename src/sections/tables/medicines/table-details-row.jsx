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
import DetailsModal from './table-show-modal';

// ----------------------------------------------------------------------

export default function CountriesTableRow({ row, selected, onEditRow,onSelectRow,onActivate,onInactivate }) {
  const {
    code,
    scientific_name,
    trade_name,
    ATCCODE,
    barcode,
    family,
    status,
    symptoms,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;
  const popover = usePopover();
  const collapse = useBoolean();
  const modal = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell>
        {code}
      </TableCell>
      <TableCell>{scientific_name}</TableCell>
      <TableCell>{trade_name}</TableCell>
      <TableCell>{family?.name_english}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {status}
        </Label>
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

      <DetailsModal row={row} open={modal.value} onClose={modal.onFalse} />
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
            <Iconify icon="solar:pause-bold" />
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
            <Iconify icon="ph:play-fill" />
            activate
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="fluent:edit-32-filled" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            modal.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:show" />
          Details
        </MenuItem>
      </CustomPopover>
    </>
  );
}

CountriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
