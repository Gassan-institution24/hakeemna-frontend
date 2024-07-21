import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CountriesTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onActivate,
  onInactivate,
  onShow,
  showActivities,
  showAppointmentConfig,
  showAppointments,
  showEmployees,
  showQualityControl,
  showRooms,
  showWorkGroups,
}) {
  const {
    sequence_number,
    name_english,
    name_arabic,
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

  const checkAcl = useAclGuard();

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
        onClick={onShow}
        align="center"
      >
        {sequence_number}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={onShow}
        align="center"
      >
        {curLangAr ? name_arabic : name_english}
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
      {/* <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
          // textDecoration: 'underline',
        }}
        onClick={onShow}
      >
        {economecMovementsCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showAppointmentConfig}
      >
        {appointmentConfigCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showAppointments}
      >
        {appointmentsCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showActivities}
      >
        {activitiesCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showEmployees}
      >
        {employeesCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showQualityControl}
      >
        {feedbackCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showRooms}
      >
        {roomsCount}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={showWorkGroups}
      >
        {roomsCount}
      </TableCell> */}
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
          ? checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'delete' }) && (
            <MenuItem
              lang="ar"
              onClick={() => {
                onInactivate();
                // popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="ic:baseline-pause" />
              {t('inactivate')}
            </MenuItem>
          )
          : checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'update' }) && (
            <MenuItem
              lang="ar"
              onClick={() => {
                onActivate();
                // popover.onClose();
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="bi:play-fill" />
              {t('activate')}
            </MenuItem>
          )}
        {checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'update' }) && (
          <MenuItem
            lang="ar"
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="fluent:edit-32-filled" />
            {t('edit')}
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
            primary={format(new Date(created_at), 'dd MMMMMMMM yyyy')}
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
            primary={format(new Date(updated_at), 'dd MMMMMMMM yyyy')}
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
    </>
  );
}

CountriesTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  onActivate: PropTypes.func,
  onInactivate: PropTypes.func,
  onEditRow: PropTypes.func,
  onShow: PropTypes.func,
  showActivities: PropTypes.func,
  showAppointmentConfig: PropTypes.func,
  showAppointments: PropTypes.func,
  showEmployees: PropTypes.func,
  showQualityControl: PropTypes.func,
  showRooms: PropTypes.func,
  showWorkGroups: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
