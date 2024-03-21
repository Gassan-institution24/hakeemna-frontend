import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import BookManually from './book-appointment-manually';

// ----------------------------------------------------------------------

export default function AppointmentsTableRow({
  row,
  selected,
  onSelectRow,
  refetch,
  onViewRow,
  onDelayRow,
  onCancelRow,
  onUnCancelRow,
  onDeleteRow,
}) {
  const {
    // sequence_number,
    appoint_number,
    unit_service,
    work_group,
    note,
    appointment_type,
    patient,
    start_time,
    status,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const router = useRouter();

  const { t } = useTranslate();

  const checkAcl = useAclGuard();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();
  const confirmDelayOne = useBoolean();
  const Book = useBoolean();

  const [minToDelay, setMinToDelay] = useState(0);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell lang="ar" padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell lang="ar" align="center">
          <ListItemText
            primary={
              isValid(new Date(start_time)) &&
              new Date(start_time).toLocaleTimeString(t('en-US'), {
                timeZone: unit_service?.country?.time_zone,
                hour: '2-digit',
                minute: '2-digit',
              })
            }
            secondary={
              isValid(new Date(start_time)) &&
              new Date(start_time).toLocaleDateString(t('en-US'), {
                timeZone:
                  unit_service?.country?.time_zone ||
                  Intl.DateTimeFormat().resolvedOptions().timeZone,
              })
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell lang="ar" align="center">
          {appoint_number}
        </TableCell>
        <TableCell lang="ar" align="center">
          {curLangAr ? appointment_type?.name_arabic : appointment_type?.name_english}
        </TableCell>
        <TableCell
          lang="ar"
          align="center"
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={() => router.push(paths.employee.patients.info(patient._id))}
        >
          {patient?.first_name} {patient?.family_name}
        </TableCell>
        <TableCell lang="ar" align="center">
          {note}
        </TableCell>
        <TableCell lang="ar" align="center">
          {curLangAr ? work_group?.name_arabic : work_group?.name_english}
        </TableCell>
        {/* <TableCell lang="ar" align="center">
          {curLangAr ? work_shift?.name_arabic : work_shift?.name_english}
        </TableCell> */}

        <TableCell lang="ar" align="center">
          <Label
            lang="ar"
            variant="soft"
            color={
              (status === 'available' && 'secondary') ||
              (status === 'pending' && 'warning') ||
              (status === 'Processing' && 'info') ||
              (status === 'finished' && 'success') ||
              (status === 'canceled' && 'error') ||
              (status === 'not booked' && 'secondary') ||
              'default'
            }
          >
            {t(status)}
          </Label>
        </TableCell>

        <TableCell lang="ar" align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <BookManually refetch={refetch} appointment={row} open={Book.value} onClose={Book.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 155 }}
      >
        {status === 'available' &&
          checkAcl({ category: 'department', subcategory: 'appointments', acl: 'update' }) && (
            <MenuItem
              sx={{ color: 'success.main' }}
              onClick={() => {
                Book.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="mdi:register" />
              {t('book manually')}
            </MenuItem>
          )}
        {status === 'available' &&
          checkAcl({ category: 'department', subcategory: 'appointments', acl: 'delete' }) && (
            <MenuItem
              onClick={() => {
                onCancelRow();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="mdi:bell-cancel" />
              {t('cancel')}
            </MenuItem>
          )}
        {status === 'canceled' &&
          checkAcl({ category: 'department', subcategory: 'appointments', acl: 'update' }) && (
            <MenuItem
              onClick={() => {
                onUnCancelRow();
                popover.onClose();
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="material-symbols-light:notifications-active-rounded" />
              {t('uncancel')}
            </MenuItem>
          )}
        {checkAcl({ category: 'department', subcategory: 'appointments', acl: 'update' }) && (
          <MenuItem onClick={confirmDelayOne.onTrue}>
            <Iconify icon="mdi:timer-sync" />
            {t('delay')}
          </MenuItem>
        )}
        <MenuItem onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
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
            primary={format(new Date(created_at), 'dd MMM yyyy')}
            secondary={format(new Date(created_at), 'p')}
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
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
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
      <ConfirmDialog
        open={confirmDelayOne.value}
        onClose={confirmDelayOne.onFalse}
        title={t('delay')}
        content={
          <>
            {t('How many minutes do you want to delay?')}
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ fontSize: '0.8rem' }}>{t('min')}</Box>
                  </InputAdornment>
                ),
              }}
              type="number"
              sx={{ p: 2, width: '100%' }}
              size="small"
              onChange={(e) => setMinToDelay(e.target.value)}
            />
          </>
        }
        action={
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              confirmDelayOne.onFalse();
              onDelayRow(row, minToDelay);
            }}
          >
            {t('delay')}
          </Button>
        }
      />
    </>
  );
}

AppointmentsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDelayRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
