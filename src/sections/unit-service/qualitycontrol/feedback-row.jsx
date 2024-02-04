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
import { Rating } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function FeedbackRow({ row, onEditRow, setFilters, filters }) {
  const {
    code,
    department,
    appointment,
    employee,
    status,
    title,
    Body,
    Rate,
    created_at,
    user_creation,
    ip_address_user_creation,
  } = row;

  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();

  const renderPrimary = (
    <TableRow hover>
      <TableCell lang="ar" align="center">{code}</TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: department?.name_english })}
      >
        {curLangAr ? department?.name_arabic: department?.name_english}
      </TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: appointment?.name_english })}
      >
        {appointment?.code}
      </TableCell>
      <TableCell
        align="center"
        onClick={() => setFilters({ ...filters, name: employee?.name_english })}
      >
        {curLangAr ? employee?.name_arabic: employee?.name_english}
      </TableCell>
      <TableCell lang="ar" align="center">{title}</TableCell>
      <TableCell lang="ar" align="center">
        <Label
                    lang="ar"
          variant="soft"
          color={(status === 'read' && 'success') || (status === 'unread' && 'error') || 'default'}
        >
          {t(status)}
        </Label>
      </TableCell>
      <TableCell lang="ar" align="center">{Body}</TableCell>
      <TableCell>
        <Rating size="small" readOnly value={Rate} precision={0.1} max={5} />
      </TableCell>
      <TableCell lang="ar" align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
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
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Creator IP:</Box>
        <Box sx={{ pb: 1 }}>{ip_address_user_creation}</Box>
      </CustomPopover>
    </>
  );
}

FeedbackRow.propTypes = {
  setFilters: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  filters: PropTypes.object,
};
