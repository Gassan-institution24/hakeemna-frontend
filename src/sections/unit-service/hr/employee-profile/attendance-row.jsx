import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Button, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { getAddressFromCoordinatesOSM } from 'src/utils/location';
import { fDate, fHourMin, useFDateTimeUnit } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import AttendanceEdit from './attendance-edit';

// ----------------------------------------------------------------------

export default function AttendanceRow({
  row,
  selected,
  refetch,
  onSelectRow,
  onViewRow,
  onCancelRow,
  onDeleteRow,
  showUnattendance = false,
  isMissingAttendance = false,
}) {
  const {
    date,
    check_in_time,
    check_out_time,
    // leave_start,
    // leave_end,
    // leave,
    work_type,
    note,
    leaveTime,
    workTime,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
    task,
  } = row;
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const checkAcl = useAclGuard();
  const MAX_CHARS = 6;
  const isLong = task && task.length > MAX_CHARS;
  const shortTask = isLong ? `${task.slice(0, MAX_CHARS)}...` : task;

  const { fTimeUnit } = useFDateTimeUnit();

  const popover = usePopover();
  const DDL = usePopover();
  const deleting = usePopover();
  const [checkInLocation, setCheckInLocation] = useState('Loading...');
  const [checkOutLocation, setCheckOutLocation] = useState('Loading...');
  const [expanded, setExpanded] = useState(false);

  function shortenAddress(fullAddress) {
    if (!fullAddress) return 'Unknown';
    const parts = fullAddress.split(',').map((p) => p.trim());
    return parts.slice(1, 4).join(', ');
  }
  useEffect(() => {
    if (row.check_in_coordinates?.coordinates?.length === 2) {
      const [lng, lat] = row.check_in_coordinates.coordinates;
      getAddressFromCoordinatesOSM(lat, lng).then((full) =>
        setCheckInLocation(shortenAddress(full))
      );
    } else {
      setCheckInLocation('Unknown');
    }

    if (row.check_out_coordinates?.coordinates?.length === 2) {
      const [lng, lat] = row.check_out_coordinates.coordinates;
      getAddressFromCoordinatesOSM(lat, lng).then((full) =>
        setCheckOutLocation(shortenAddress(full))
      );
    } else {
      setCheckOutLocation('Unknown');
    }
  }, [row]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{fTimeUnit(date, 'EEE dd MMM', true)}</TableCell>

        {!showUnattendance && (
          <>
            <TableCell align="center">{fTimeUnit(check_in_time, 'p', true)}</TableCell>
            <TableCell align="center">{fTimeUnit(check_out_time, 'p', true)}</TableCell>
            <TableCell align="center">{fHourMin(leaveTime)}</TableCell>
            <TableCell align="center">{fHourMin(workTime)}</TableCell>
            <TableCell align="center">{t(work_type)}</TableCell>
            {/* <TableCell align="center">{t(leave)}</TableCell> */}
          </>
        )}

        <TableCell align="center">{t(note)}</TableCell>
        <TableCell align="center" sx={{ maxWidth: 220 }}>
          {task ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {expanded ? task : shortTask}
              </Typography>

              {typeof row.time_doing_the_task === 'number' && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                  }}
                >
                  {row.time_doing_the_task} {t('hours')}
                </Typography>
              )}

              {isLong && (
                <Typography
                  variant="caption"
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    display: 'block',
                    mt: 0.5,
                  }}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? t('View less') : t('View')}
                </Typography>
              )}
            </>
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
        </MenuItem>
        {checkAcl({
          category: 'unit_service',
          subcategory: 'hr',
          acl: 'update',
        }) && (
          <MenuItem lang="ar" onClick={() => setOpen(true)}>
            <Iconify icon="fluent:edit-32-filled" />
            {t('Edit')}
          </MenuItem>
        )}
        {checkAcl({
          category: 'unit_service',
          subcategory: 'hr',
          acl: 'delete',
        }) && (
          <MenuItem sx={{ color: 'error.main' }} lang="ar" onClick={deleting.onOpen}>
            <Iconify icon="mdi:trash" />
            {t('Delete')}
          </MenuItem>
        )}
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('login location')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{checkInLocation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('logout location')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{checkOutLocation}</Box>
        <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(created_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(created_at, 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(updated_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(updated_at, 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_modification?.email}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>
          {t('modifications no')}: {modifications_nums}
        </Box>
      </CustomPopover>

      {open && (
        <AttendanceEdit
          row={row}
          open={open}
          refetch={refetch}
          onClose={() => setOpen(false)}
          isMissingAttendance={isMissingAttendance}
        />
      )}
      <ConfirmDialog
        open={deleting.open}
        onClose={deleting.onClose}
        title={t('Deleting Attendence')}
        content={t('Are you sure to delete this?')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              popover.onClose();
              deleting.onClose();
              onDeleteRow(row._id);
            }}
          >
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}

AttendanceRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  showUnattendance: PropTypes.bool,
  isMissingAttendance: PropTypes.bool,
};
