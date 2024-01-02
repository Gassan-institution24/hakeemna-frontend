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
import {
  useGetDepartmentAppointmentConfigsCount,
  useGetDepartmentActivitiesCount,
  useGetDepartmentAppointmentsCount,
  useGetDepartmentEconomicMovementsCount,
  useGetDepartmentEmployeesCount,
  useGetDepartmentFeedbackesCount,
  useGetDepartmentRoomsCount,
} from 'src/api/tables';

// ----------------------------------------------------------------------

export default function CountriesTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onActivate,
  onInactivate,
  showAccounting,
  showActivities,
  showAppointmentConfig,
  showAppointments,
  showEmployees,
  showQualityControl,
  showRooms,
}) {
  const {
    code,
    name_english,
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
  const { appointmentConfigCount } = useGetDepartmentAppointmentConfigsCount(row._id);
  const { activitiesCount } = useGetDepartmentActivitiesCount(row._id);
  const { appointmentsCount } = useGetDepartmentAppointmentsCount(row._id);
  const { economecMovementsCount } = useGetDepartmentEconomicMovementsCount(row._id);
  const { employeesCount } = useGetDepartmentEmployeesCount(row._id);
  const { feedbackCount } = useGetDepartmentFeedbackesCount(row._id);
  const { roomsCount } = useGetDepartmentRoomsCount(row._id);

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell>{code}</TableCell>
      <TableCell>{name_english}</TableCell>
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
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={showAccounting}
      >
        {economecMovementsCount}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showAppointmentConfig}
      >
        {appointmentConfigCount}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showAppointments}
      >
        {appointmentsCount}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showActivities}
      >
        {activitiesCount}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showEmployees}
      >
        {employeesCount}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showQualityControl}
      >
        {feedbackCount}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showRooms}
      >
        {roomsCount}
      </TableCell>
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
        {status === 'active' ? (
          <MenuItem
            onClick={() => {
              onInactivate();
              // popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="ic:baseline-pause" />
            Inactivate
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              onActivate();
              // popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="bi:play-fill" />
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
        <MenuItem onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          DDL
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {modifications_nums}</Box>
      </CustomPopover>
    </>
  );
}

CountriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  onEditRow: PropTypes.func,
  showAccounting: PropTypes.func,
  showActivities: PropTypes.func,
  showAppointmentConfig: PropTypes.func,
  showAppointments: PropTypes.func,
  showEmployees: PropTypes.func,
  showQualityControl: PropTypes.func,
  showRooms: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
