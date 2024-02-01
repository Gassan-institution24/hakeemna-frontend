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

import { useLocales, useTranslate } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function UnitServiceEmployeesRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onActivate,
  onInactivate,
  setFilters,
  filters,
  onViewRow,
}) {
  const {
    code,
    employee,
    Adjust_schedule,
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

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={onViewRow}
        align="center"
      >
        {code}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={onViewRow}
        align="center"
      >
        {employee.first_name} {employee.family_name}
      </TableCell>
      <TableCell align="center">{curLangAr ? employee.employee_type?.name_arabic: employee.employee_type?.name_english}</TableCell>
      <TableCell align="center">{employee.email}</TableCell>
      <TableCell align="center">{curLangAr ? employee.nationality?.name_arabic: employee.nationality?.name_english}</TableCell>
      <TableCell align="center">
        <Iconify
          icon={employee.validatd_identity ? 'eva:checkmark-fill' : 'mingcute:close-line'}
          width={16}
        />
      </TableCell>
      <TableCell align="center">
        <Iconify icon={Adjust_schedule ? 'eva:checkmark-fill' : 'mingcute:close-line'} width={16} />
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
        {status === 'active'
          ? ACLGuard({ category: 'unit_service', subcategory: 'employees', acl: 'delete' }) && (
              <MenuItem
                onClick={() => {
                  onInactivate();
                  popover.onClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="ic:baseline-pause" />
                {t('inactivate')}
              </MenuItem>
            )
          : ACLGuard({ category: 'unit_service', subcategory: 'employees', acl: 'update' }) && (
              <MenuItem
                onClick={() => {
                  onActivate();
                  popover.onClose();
                }}
                sx={{ color: 'success.main' }}
              >
                <Iconify icon="bi:play-fill" />
                {t('activate')}
              </MenuItem>
            )}
        <MenuItem onClick={onViewRow}>
          <Iconify icon="solar:eye-bold" />
          {t('view')}
        </MenuItem>
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
        <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(created_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.employee.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(updated_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          {user_modification?.employee.email}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {modifications_nums}</Box>
      </CustomPopover>
    </>
  );
}

UnitServiceEmployeesRow.propTypes = {
  onSelectRow: PropTypes.func,
  setFilters: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  filters: PropTypes.object,
};
