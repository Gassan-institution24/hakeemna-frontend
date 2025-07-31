import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import {
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function MovementTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  refetch,
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
    Provided_services,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
    sent_to_the_envoicing_system,
    invoiceId,
    concept,
  } = row;

  const { t } = useTranslate();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const DDL = usePopover();
  const popover = usePopover();
  const [openConceptDialog, setOpenConceptDialog] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  let patientName;
  if (patient) {
    patientName = curLangAr ? patient?.name_arabic : patient?.name_english;
  } else if (unit_service_patient) {
    patientName = curLangAr
      ? unit_service_patient?.name_arabic
      : unit_service_patient?.name_english;
  }

  const handleSendToInovicgSystem = () => {
    if (concept && concept.trim() !== '') {
      sendInvoice(concept);
    } else {
      setOpenConceptDialog(true);
    }
  };

  const firstServiceTypeId = Provided_services?.[0]?.service_type;
  const sendInvoice = useCallback(
    async (finalConcept) => {
      const payloadForOtherTable = {
        Secret_Key: row.unit_service?.Secret_Key,
        Activity_Number: row.unit_service?.Activity_Number,
        ClientId: row.unit_service?.ClientId,
        CompanyID: row.unit_service?.CompanyID,
        RegistrationName: row.unit_service?.RegistrationName,
        Buyer:
          row.patient?.name_arabic ||
          row.unit_service_patient?.name_arabic ||
          row.patient?.name_english ||
          row.unit_service_patient?.name_english,
        BuyerNum: (row.patient?.mobile_num1 || row.unit_service_patient?.mobile_num1 || '').replace(
          /\s+/g,
          ''
        ),
        BuyerIdNum: row.patient?.identification_num || row.unit_service_patient?.identification_num,
        BuyerCity: row.patient?.city?.name_arabic || row.unit_service_patient?.city?.name_arabic,
        service_type: firstServiceTypeId?.name_arabic,
        subtotal: row.Subtotal_Amount || 0,
        quantity: row.totalQuantity || 0,
        discount: row.Total_discount_amount || 0,
        total: row.Total_Amount || 0,
        concept: finalConcept ?? '',
        economicMovementId: row._id,
        date: row.created_at,
      };

      try {
        await axiosInstance.post('/api/invoice', payloadForOtherTable);
        refetch();
        enqueueSnackbar('تم إرسال الفاتورة للنظام الوطني بنجاح', { variant: 'success' });
      } catch (e) {
        console.error('خطأ أثناء إرسال الفاتورة للنظام الوطني:', e);
        enqueueSnackbar('خطأ أثناء إرسال الفاتورة للنظام الوطني', {
          variant: 'warning',
        });
      }
    },
    [row, enqueueSnackbar, firstServiceTypeId?.name_arabic, refetch]
  );

  const handleConfirmSend = () => {
    sendInvoice(newConcept);
    setOpenConceptDialog(false);
    setNewConcept('');
  };

  return (
    <>
      <TableRow hover selected={selected}>
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
      {/* here */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 260 }}
      >
        {!sent_to_the_envoicing_system && (
          <MenuItem
            lang="ar"
            onClick={() => {
              handleSendToInovicgSystem();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:forward-bold" />
            {t('send to jordanian envoicing system')}
          </MenuItem>
        )}

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
      {/* Dialog for entering concept */}
      <Dialog open={openConceptDialog} onClose={() => setOpenConceptDialog(false)}>
        <DialogTitle>
          {' '}
          {t('Notes (Notes are added to the National Jordanian Billing System)')}{' '}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={newConcept}
            onChange={(e) => setNewConcept(e.target.value)}
            label={t('Notes')}
            autoFocus
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConceptDialog(false)}>{t('Send without notes')}</Button>
          <Button variant="contained" onClick={handleConfirmSend} disabled={!newConcept.trim()}>
            {t('Send')}
          </Button>
        </DialogActions>
      </Dialog>
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
  refetch: PropTypes.func,
};
