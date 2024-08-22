import PropTypes from 'prop-types';
import { isValid } from 'date-fns';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

// import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AppointmentsTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onCancelRow,
  onUnCancelRow,
  onDeleteRow,
}) {
  const {
    sequence_number,
    start_date,
    end_date,
    work_shift,
    work_group,
    status,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const { t } = useTranslate();

  // const checkAcl = useAclGuard();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell
          sx={{
            cursor: 'pointer',
            color: '#3F54EB',
          }}
          onClick={onViewRow}
          align="center"
        >
          {sequence_number}
        </TableCell>

        <TableCell onClick={onViewRow} align="center">
          <ListItemText
            primary={
              isValid(new Date(start_date)) && fDate(start_date, 'dd MMMMMMMM yyyy')
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>
        <TableCell onClick={onViewRow} align="center">
          <ListItemText
            primary={isValid(new Date(end_date)) && fDate(end_date, 'dd MMMMMMMM yyyy')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        </TableCell>

        <TableCell onClick={onViewRow} align="center">
          {curLangAr ? work_shift?.name_arabic : work_shift?.name_english}
        </TableCell>
        <TableCell onClick={onViewRow} align="center">
          {curLangAr ? work_group?.name_arabic : work_group?.name_english}
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* {status === 'available' &&
          checkAcl({ category: 'employee', subcategory: 'appointment_configs', acl: 'delete' }) && (
            <MenuItem lang="ar" 
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
          checkAcl({ category: 'employee', subcategory: 'appointment_configs', acl: 'update' }) && (
            <MenuItem lang="ar" 
              onClick={() => {
                onUnCancelRow();
                popover.onClose();
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="material-symbols-light:notifications-active-rounded" />
              {t('uncancel')}
            </MenuItem>
          )} */}
        <MenuItem lang="ar" onClick={onViewRow}>
          <Iconify icon="solar:eye-bold" />
          {t('view')}
        </MenuItem>
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
    </>
  );
}

AppointmentsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
