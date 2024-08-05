
import PropTypes from 'prop-types';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Tooltip, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import UnitServiceInvoicePDF from '../unit-service/accounting/economic-movements/invoice-pdf';
import StakeholderInvoicePDF from '../stakeholder/accounting/economic-movements/invoice-pdf';

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
    stakeholder,
    unit_service,
    Balance,
    Currency,
    status,

    created_at,
  } = row;

  const { t } = useTranslate();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const printPdf = async () => {
    // eslint-disable-next-line
    const blob = await pdf(stakeholder ? <StakeholderInvoicePDF invoice={row} currentStatus={status} /> : <UnitServiceInvoicePDF invoice={row} currentStatus={status} />).toBlob();
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

      <TableCell align="center" sx={{
        cursor: 'pointer',
        color: '#3F54EB',
      }}
        onClick={onViewRow}>{sequence_number}</TableCell>

      <TableCell align="center" sx={{
        cursor: 'pointer',
        color: '#3F54EB',
      }}
        onClick={onViewRow}>{fDate(created_at)}</TableCell>

      <TableCell align="center">
        {curLangAr ? unit_service?.name_arabic : unit_service?.name_english}
      </TableCell>

      <TableCell align="center">
        {curLangAr ? stakeholder?.name_arabic : stakeholder?.name_english}
      </TableCell>

      <TableCell align="center" sx={{
        cursor: 'pointer',
        color: '#3F54EB',
      }}
        onClick={onViewRow}>{fCurrency(Balance, Currency?.symbol)}</TableCell>

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
      <TableCell align='right'>
        <PDFDownloadLink
          // eslint-disable-next-line
          document={stakeholder ? <StakeholderInvoicePDF invoice={row} currentStatus={status} /> : <UnitServiceInvoicePDF invoice={row} currentStatus={status} />}
          fileName={`${fDate(new Date(row.created_at), 'yyyy')} - ${row.sequence_number}`}
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
    </TableRow >
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
