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
import { Rating } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function FeedbackRow({ row, onEditRow, setFilters, filters }) {
  const {
    code,
    appointment,
    employee,
    status,
    title,
    Body,
    Rate,
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

  const renderPrimary = (
    <TableRow hover>
      <TableCell align="center">{code}</TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: appointment?.name_english })}
      >
        {appointment?.name_english}
      </TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: employee?.name_english })}
      >
        {employee?.name_english}
      </TableCell>
      <TableCell align="center">{title}</TableCell>
      <TableCell align="center">
        <Label
          variant="soft"
          color={(status === 'read' && 'success') || (status === 'unread' && 'error') || 'default'}
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align="center">{Body}</TableCell>
      <TableCell>
        <Rating size="small" readOnly value={Rate} precision={0.1} max={5} />
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
      </CustomPopover>
    </>
  );
}

FeedbackRow.propTypes = {
  setFilters: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
};
