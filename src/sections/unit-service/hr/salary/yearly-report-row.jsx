import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Button, ListItemText } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fHourMin } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function YearlyReportRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onViewRow,
  hideEmployee,
}) {
  const {
    code,
    employee_engagement,
    start_date,
    end_date,
    working_time,
    annual,
    sick,
    unpaid,
    public: publicOff,
    other,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const { t } = useTranslate();
  const checkAcl = useAclGuard();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();
  const deleting = useBoolean();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell
        // sx={{
        //   cursor: 'pointer',
        //   color: '#3F54EB',
        // }}
        // onClick={onViewRow}
        align="center"
      >
        {code}
      </TableCell>
      {!hideEmployee && (
        <TableCell
          // sx={{
          //   cursor: 'pointer',
          //   color: '#3F54EB',
          // }}
          // onClick={onViewRow}
          align="center"
        >
          {curLangAr
            ? employee_engagement?.employee?.name_arabic
            : employee_engagement?.employee?.name_english}
        </TableCell>
      )}
      <TableCell align="center">{fDate(start_date)}</TableCell>
      <TableCell align="center">{fDate(end_date)}</TableCell>
      <TableCell align="center">{fHourMin(working_time)}</TableCell>
      <TableCell align="center">{annual}</TableCell>
      <TableCell align="center">{sick}</TableCell>
      <TableCell align="center">{unpaid}</TableCell>
      <TableCell align="center">{publicOff}</TableCell>
      <TableCell align="center">{other}</TableCell>

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
        {/* <MenuItem lang="ar" onClick={onViewRow}>
          <Iconify icon="solar:eye-bold" />
          {t('view')}
        </MenuItem> */}
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
        </MenuItem>
        {checkAcl({
          category: 'unit_service',
          subcategory: 'hr',
          acl: 'delete',
        }) && (
          <MenuItem sx={{ color: 'error.main' }} lang="ar" onClick={deleting.onTrue}>
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

      <ConfirmDialog
        open={deleting.value}
        onClose={deleting.onFalse}
        title={t('Deleting Report')}
        content={t('Are you sure to delete this?')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              popover.onClose();
              deleting.onFalse();
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

YearlyReportRow.propTypes = {
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  hideEmployee: PropTypes.bool,
};
