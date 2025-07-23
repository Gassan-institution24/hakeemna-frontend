import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
// import { Checkbox } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function MovementTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const {
    sequence_number,
    patient,
    unit_service_patient,
    stakeholder,
    // employee,
    Balance,
    Currency,
    status,

    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
    sent_to_the_envoicing_system,
    invoiceId,
  } = row;

  const { t } = useTranslate();
  const router = useRouter();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const DDL = usePopover();
  const popover = usePopover();

  let patientName;
  if (patient) {
    patientName = curLangAr ? patient?.name_arabic : patient?.name_english;
  } else if (unit_service_patient) {
    patientName = curLangAr
      ? unit_service_patient?.name_arabic
      : unit_service_patient?.name_english;
  }

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="center">{sequence_number}</TableCell>

        <TableCell align="center">{fDate(created_at)}</TableCell>

        <TableCell align="center">{patientName}</TableCell>

        <TableCell align="center">
          {curLangAr ? stakeholder?.name_arabic : stakeholder?.name_english}
        </TableCell>

        <TableCell align="center">
          {fCurrency(stakeholder ? -Balance : Balance, Currency?.symbol)}
        </TableCell>
        <TableCell align="center">{invoiceId}</TableCell>
        <TableCell align="center">
          {' '}
          <Typography color={sent_to_the_envoicing_system ? 'success.main' : 'error.main'}>
            {sent_to_the_envoicing_system ? t('yes') : t('no')}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'paid' && 'success') ||
              (status === 'installment' && 'warning') ||
              (status === 'insurance' && 'info') ||
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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          lang="ar"
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          {t('view')}
        </MenuItem>

        <MenuItem
          lang="ar"
          onClick={() => {
            router.push(
              `${
                paths.unitservice.accounting.paymentcontrol.root
              }?movement=${sequence_number}-${fDate(created_at, 'yyyy')}`
            );
            popover.onClose();
          }}
        >
          <Iconify icon="majesticons:checkbox-list-detail" />
          {t('payment control')}
        </MenuItem>
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

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

MovementTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
