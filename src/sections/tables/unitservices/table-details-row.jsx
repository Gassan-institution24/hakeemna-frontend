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

export default function CountriesTableRow({ row, selected, onEditRow,onSelectRow,onActivate,onInactivate,setFilters,filters }) {
  const {
    code,
    name_english,
    country,
    city,
    sector_type,
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
      <TableCell>{name_english}</TableCell>
      <TableCell onClick={()=>setFilters({...filters,name:country?.name_english})}>{country?.name_english}</TableCell>
      <TableCell onClick={()=>setFilters({...filters,name:city?.name_english})}>{city?.name_english}</TableCell>
      <TableCell onClick={()=>setFilters({...filters,name:sector_type})}>
        <Label
          variant="soft"
          color={
            (sector_type === 'active' && 'success') || (sector_type === 'inactive' && 'error') || 'default'
          }
        >
          {sector_type}
        </Label>
      </TableCell>
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

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
      <Label
          variant="soft"
          color="default"
          sx={{
            cursor: 'pointer',
          }}
          onClick={DDL.onOpen}
        >
          DDL
        </Label>
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
          {/* <Iconify icon="fluent:edit-32-filled" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            modal.onTrue();
            popover.onClose();
          }}
        > */}
          <Iconify icon="mdi:show" />
          Details
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No:</Box>
        <Box>{modifications_nums}</Box>
      </CustomPopover>
    </>
  );
}

CountriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  setFilters: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  filters: PropTypes.object,
};
