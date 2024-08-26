import PropTypes from 'prop-types';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useGetIncomePaymentControl } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import StakeholderInvoicePDF from '../stakeholder/accounting/reciepts/invoice-pdf';
import UnitServiceInvoicePDF from '../unit-service/accounting/reciepts/invoice-pdf';

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
    unit_service,
    stakeholder,
    required_amount,
    Currency,
    balance,
    due_date,
    insurance,
    is_it_installment,
    receipt_voucher_num,
  } = row;

  const { incomePaymentData } = useGetIncomePaymentControl({
    economic_movement: receipt_voucher_num?.economic_movement?._id,
    recieved: true,
    select: 'balance',
  });

  const paidAmount = incomePaymentData.reduce((acc, one) => {
    if (typeof one.balance === 'number') {
      return acc - one.balance;
    }
    return acc;
  }, 0);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  let type;
  if (insurance) {
    type = 'insurance';
  } else if (is_it_installment) {
    type = 'installment';
  } else type = 'paid';

  const printPdf = async () => {
    const blob = await pdf(
      stakeholder ? (
        <StakeholderInvoicePDF invoice={receipt_voucher_num} paidAmount={paidAmount} />
      ) : (
        <UnitServiceInvoicePDF invoice={receipt_voucher_num} paidAmount={paidAmount} />
      )
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

      <TableCell align="center">{sequence_number}</TableCell>

      <TableCell align="center">{fDate(due_date)}</TableCell>
      <TableCell align="center">{type}</TableCell>

      <TableCell align="center">
        {curLangAr ? unit_service?.name_arabic : unit_service?.name_english}
      </TableCell>
      <TableCell align="center">
        {curLangAr ? stakeholder?.name_arabic : stakeholder?.name_english}
      </TableCell>

      <TableCell align="center">{fCurrency(required_amount, Currency?.symbol)}</TableCell>
      <TableCell align="center">{fCurrency(-balance, Currency?.symbol)}</TableCell>
      {receipt_voucher_num && (
        <TableCell align="right">
          <PDFDownloadLink
            document={
              stakeholder ? (
                <StakeholderInvoicePDF invoice={receipt_voucher_num} paidAmount={paidAmount} />
              ) : (
                <UnitServiceInvoicePDF invoice={receipt_voucher_num} paidAmount={paidAmount} />
              )
            }
            fileName={`${fDate(new Date(receipt_voucher_num?.created_at), 'yyyy')} - ${
              receipt_voucher_num?.sequence_number
            }`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title={t('download')}>
                <IconButton>
                  <Iconify icon="eva:cloud-download-fill" />
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>
          <Tooltip title={t('print')}>
            <IconButton onClick={printPdf}>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      )}
    </TableRow>
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
