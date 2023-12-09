import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TableDetailsRow({ row, selected, onEditRow, onSelectRow, onInactivate,onActivate,filters,setFilters }) {
  const {
    code,
    name_english,
    unit_service,
    service,
    description,
    status,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Box>{code}</Box>
      </TableCell>

      <TableCell>{name_english}</TableCell>

      <TableCell onClick={()=>setFilters({...filters,name:unit_service.name_english})}>{unit_service?.name_english}</TableCell>
      <TableCell onClick={()=>setFilters({...filters,name:service.name_english})}>{service?.name_english}</TableCell>
      <TableCell>{description}</TableCell>
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
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

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
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onInactivate}>
            Delete
          </Button>
        }
      />
    </>
  );
}

TableDetailsRow.propTypes = {
  onInactivate: PropTypes.func,
  onActivate: PropTypes.func,
  onSelectRow: PropTypes.func,
  setFilters: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
  selected: PropTypes.bool,
};
