import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function InsuranceRow({ row, onDeleteRow, setFilters, filters }) {
  const {
    code,
    name_english,
    type,
    status,
    webpage,
    phone,
    address,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const { t } = useTranslate();

  const popover = usePopover();
  const DDL = usePopover();

  const renderPrimary = (
    <TableRow hover>
      <TableCell align="center">{code}</TableCell>
      <TableCell>{name_english}</TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: type?.name_english })}
      >
        {type?.name_english}
      </TableCell>
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
      <TableCell align="center">{webpage}</TableCell>
      <TableCell align="center">{phone}</TableCell>
      <TableCell align="center">{address}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton sx={{ color: 'error.main' }} onClick={onDeleteRow}>
          <Iconify icon="mi:delete" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          DDL
        </MenuItem>
        <MenuItem onClick={onDeleteRow} sx={{ color: 'error.main' }}>
          <Iconify icon="mi:delete" />
          Delete
        </MenuItem>
      </CustomPopover> */}

      {/* <CustomPopover
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
      </CustomPopover> */}
    </>
  );
}

InsuranceRow.propTypes = {
  setFilters: PropTypes.func,
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
};
