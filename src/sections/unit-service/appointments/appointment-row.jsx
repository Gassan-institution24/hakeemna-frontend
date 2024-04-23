import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { TextField, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';

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
  onBookAppoint,
}) {
  const {
    _id,
    appoint_number,
    unit_service,
    work_group,
    // sequence_number,
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
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center">
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
        <TableCell align="center">{appoint_number}</TableCell>
        <TableCell align="center">
          {curLangAr ? appointment_type?.name_arabic : appointment_type?.name_english}
        </TableCell>
        <TableCell
          align="center"
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={() => router.push(paths.employee.patients.info(patient._id))}
        >
          {curLangAr ? patient?.name_arabic : patient?.name_english}
        </TableCell>
        <TableCell align="center">{note}</TableCell>
        <TableCell align="center">
          {curLangAr ? work_group?.name_arabic : work_group?.name_english}
        </TableCell>
        {/* <TableCell  align="center">
          {curLangAr ? work_shift?.name_arabic : work_shift?.name_english}
        </TableCell> */}

        <TableCell align="center">
          <Label
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

        <TableCell align="right" sx={{ px: 1 }}>
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
        {checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'update' }) && (
          <MenuItem
            lang="ar"
            onClick={() => {
              router.push(paths.unitservice.appointments.edit(_id));
              popover.onClose();
            }}
          >
            <Iconify icon="fluent:edit-32-filled" />
            {t('edit')}
          </MenuItem>
        )}
        {status === 'available' &&
          checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'update' }) && (
            <MenuItem
              lang="ar"
              sx={{ color: 'success.main' }}
              onClick={() => {
                onBookAppoint();
                popover.onClose();
              }}
            >
              <Iconify icon="mdi:register" />
              {t('book manually')}
            </MenuItem>
          )}
        {status === 'available' &&
          checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'delete' }) && (
            <MenuItem
              lang="ar"
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
          checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'update' }) && (
            <MenuItem
              lang="ar"
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
        {checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'update' }) && (
          <MenuItem lang="ar" onClick={confirmDelayOne.onTrue}>
            <Iconify icon="mdi:timer-sync" />
            {t('delay')}
          </MenuItem>
        )}
        <MenuItem lang="ar" onClick={DDL.onOpen}>
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
              helperText={t('knowing that you can type a negative value to make it earlier')}
            />
            {minToDelay !== 0 && (
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'error.main' }}>
                {t('from')}&nbsp;
                {new Date(start_time).toLocaleTimeString(t('en-US'), {
                  timeZone: unit_service?.country?.time_zone,
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {/* {'     >>     '} */}
                &nbsp;{t('to')}&nbsp;
                {new Date(
                  new Date(start_time).getTime() + minToDelay * 60 * 1000
                ).toLocaleTimeString(t('en-US'), {
                  timeZone: unit_service?.country?.time_zone,
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            )}
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
            {t('delay')}{' '}
          </Button>
        }
      />
    </>
  );
}

AppointmentsTableRow.propTypes = {
  onBookAppoint: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDelayRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
