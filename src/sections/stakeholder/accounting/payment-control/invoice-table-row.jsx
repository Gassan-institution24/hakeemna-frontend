import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
// import { Checkbox } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import PaymentDialog from './payment-dialog';

// ----------------------------------------------------------------------

export default function MovementTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  refetch,
}) {
  const {
    sequence_number,
    patient,
    unit_service,
    required_amount,
    balance,
    Currency,
    economic_movement,
    recieved,
    insurance,
    is_it_installment,
    due_date,

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

  const DDL = usePopover();
  const popover = usePopover();
  const payment = useBoolean();

  let type;
  if (insurance) {
    type = 'insurance';
  } else if (is_it_installment) {
    type = 'installment';
  } else type = 'paid';

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="center">{sequence_number}</TableCell>

        <TableCell align="center">{fDate(due_date)}</TableCell>
        <TableCell align="center">{t(type)}</TableCell>
        <TableCell align="center">
          {curLangAr ? insurance?.name_arabic : insurance?.name_english}
        </TableCell>

        <TableCell align="center">
          {curLangAr ? patient?.name_arabic : patient?.name_english}
        </TableCell>

        <TableCell align="center">
          {curLangAr ? unit_service?.name_arabic : unit_service?.name_english}
        </TableCell>

        <TableCell align="center">{fCurrency(required_amount, Currency?.symbol)}</TableCell>
        <TableCell align="center">{fCurrency(-balance, Currency?.symbol)}</TableCell>

        {/* <TableCell align="center">
          <Label
            variant="soft"
            color={
              recieved ? 'success' : 'warning'
            }
          >
            {t(recieved ? 'paid' : 'pending')}
          </Label>
        </TableCell> */}
        <TableCell align="center">
          {economic_movement?.sequence_number}-{fDate(created_at, 'yyyy')}
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
        sx={{ width: 160 }}
      >
        {/* <MenuItem
          lang="ar"
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('view')}
        </MenuItem> */}

        {!recieved && (
          <MenuItem
            lang="ar"
            onClick={() => {
              payment.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="game-icons:money-stack" />
            {t('pay')}
          </MenuItem>
        )}
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
        </MenuItem>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />
        
        <MenuItem lang="ar" 
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
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

      <PaymentDialog open={payment.value} onClose={payment.onFalse} row={row} refetch={refetch} />
    </>
  );
}

MovementTableRow.propTypes = {
  refetch: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
