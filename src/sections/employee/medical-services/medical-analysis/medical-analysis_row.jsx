import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function MedicalAnalysisTableRow({ row, onEditRow, onViewRow }) {
  const {
    code,
    favorite_name,
    favorite_name_ar,
    medical_analyses,
    note,
    created_at,
    updated_at,
    modifications_nums,
    ip_address_user_modification,
    user_modification,
    ip_address_user_creation,
    user_creation,
  } = row;

  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();

  const renderPrimary = (
    <TableRow hover>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onViewRow}
      >
        {code}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onViewRow}
      >
        {favorite_name}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={onViewRow}
      >
        {favorite_name_ar}
      </TableCell>
      <TableCell align="center">
        {medical_analyses?.map((i) => (curLangAr ? i.name_arabic : i.name_english)).join(', ')}
      </TableCell>
      <TableCell align="center">{note}</TableCell>
      <TableCell align="center">
        <IconButton onClick={popover.onOpen}>
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
        <MenuItem
          lang="ar"
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          {t('view')}
        </MenuItem>
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

MedicalAnalysisTableRow.propTypes = {
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
};
