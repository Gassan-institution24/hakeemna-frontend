import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime, fHourMin } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import AttendanceEdit from '../employee-profile/attendance-edit';

// import UploadAnalysis from '../upload-analysis';

// ----------------------------------------------------------------------

export default function AttendanceRow({
  row,
  selected,
  refetch,
  onSelectRow,
  onViewRow,
  onCancelRow,
  onDeleteRow,
}) {
  const {
    date,
    check_in_time,
    check_out_time,
    leave,
    work_type,
    leaveTime,
    workTime,
    note,
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
  const deleting = usePopover();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{fDate(date, 'EEEE, dd MMMMMMMM yyyy')}</TableCell>
        <TableCell align="center">{fTime(check_in_time)}</TableCell>
        <TableCell align="center">{fTime(check_out_time)}</TableCell>
        <TableCell align="center">{fHourMin(leaveTime)}</TableCell>
        <TableCell align="center">{fHourMin(workTime)}</TableCell>
        <TableCell align="center">{t(work_type)}</TableCell>
        <TableCell align="center">{t(leave)}</TableCell>
        <TableCell align="center">{note}</TableCell>

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
        <MenuItem lang="ar" onClick={() => setOpen(true)}>
          <Iconify icon="fluent:edit-32-filled" />
          {t('Edit')}
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} lang="ar" onClick={deleting.onOpen}>
          <Iconify icon="mdi:trash" />
          {t('Delete')}
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
        <AttendanceEdit row={row} open={open} refetch={refetch} onClose={() => setOpen(false)} />
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
};
