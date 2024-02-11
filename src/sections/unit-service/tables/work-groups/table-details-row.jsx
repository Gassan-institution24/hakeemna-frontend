import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function TableDetailsRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onInactivate,
  onActivate,
  filters,
  setFilters,
}) {
  const {
    code,
    name_english,
    name_arabic,
    employees,
    // general_info,
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

  const confirm = useBoolean();

  const popover = usePopover();
  const DDL = usePopover();
  const details = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell lang="ar" padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell lang="ar" align="center">
        <Box>{code}</Box>
      </TableCell>

      <TableCell lang="ar" align="center">
        {curLangAr ? name_arabic : name_english}
      </TableCell>
      <TableCell lang="ar" align="center">
        {employees
          .map((employee) => `${employee.employee.first_name} ${employee.employee.family_name}`)
          .join(', ')}
      </TableCell>
      <TableCell lang="ar" align="center">
        <Label
          lang="ar"
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {t(status)}
        </Label>
      </TableCell>

      <TableCell lang="ar" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}

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
          ? ACLGuard({ category: 'department', subcategory: 'work_groups', acl: 'delete' }) && (
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
          : ACLGuard({ category: 'department', subcategory: 'work_groups', acl: 'update' }) && (
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

        {ACLGuard({ category: 'department', subcategory: 'work_groups', acl: 'update' }) && (
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="fluent:edit-32-filled" />
            {t('edit')}
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
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(created_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('creator')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('creator IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(updated_at)}</Box>
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

TableDetailsRow.propTypes = {
  onInactivate: PropTypes.func,
  onActivate: PropTypes.func,
  onSelectRow: PropTypes.func,
  setFilters: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
  selected: PropTypes.bool,
};
