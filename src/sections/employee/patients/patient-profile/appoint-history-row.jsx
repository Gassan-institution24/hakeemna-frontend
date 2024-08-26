import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import useUSTypeGuard from 'src/auth/guard/USType-guard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import UploadAnalysis from '../upload-analysis';

// ----------------------------------------------------------------------

export default function AppointHistoryRow({
  row,
  selected,
  refetch,
  onSelectRow,
  onViewRow,
  onCancelRow,
  onDeleteRow,
}) {
  const {
    _id,
    sequence_number,
    appointment_type,
    work_group,
    patient,
    note,
    start_time,
    medicalAnalysis,
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
  const { isMedLab } = useUSTypeGuard();

  const popover = usePopover();
  const DDL = usePopover();
  const uploadAnalysis = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">
          <ListItemText
            primary={
              isValid(new Date(start_time)) && format(new Date(start_time), 'dd MMMMMMMM yyyy')
            }
            secondary={isValid(new Date(start_time)) && format(new Date(start_time), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell align="center">{sequence_number}</TableCell>
        <TableCell align="center">
          {curLangAr ? appointment_type?.name_arabic : appointment_type?.name_english}
        </TableCell>
        <TableCell align="center">
          {curLangAr ? work_group?.name_arabic : work_group?.name_english}
        </TableCell>
        <TableCell align="center">{note}</TableCell>
        {isMedLab && (
          <TableCell align="center">
            <Iconify
              icon={medicalAnalysis ? 'eva:checkmark-fill' : 'mingcute:close-line'}
              width={16}
            />
          </TableCell>
        )}

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'processing' && 'info') ||
              (status === 'arrived' && 'success') ||
              (status === 'late' && 'warning') ||
              (status === 'booked' && 'info') ||
              (status === 'finished' && 'success') ||
              (status === 'not arrived' && 'error') ||
              (status === 'canceled' && 'warning') ||
              (status === 'available' && 'secondary') ||
              (status === 'not booked' && 'secondary') ||
              'default'
            }
          >
            {t(status)}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          {isMedLab && !medicalAnalysis && (
            <IconButton lang="ar" onClick={uploadAnalysis.onTrue}>
              <Iconify icon="octicon:upload-16" />
            </IconButton>
          )}
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        // sx={{ width: 140 }}
      >
        {status === 'available' && (
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
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
        </MenuItem>
        {isMedLab && !medicalAnalysis && (
          <MenuItem lang="ar" onClick={uploadAnalysis.onTrue}>
            <Iconify icon="octicon:upload-16" />
            {t('upload analysis')}
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
      <UploadAnalysis
        open={uploadAnalysis.value}
        onClose={uploadAnalysis.onFalse}
        analysisData={{ patient: patient?._id || patient, appointment: _id }}
        refetch={refetch}
      />
    </>
  );
}

AppointHistoryRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
