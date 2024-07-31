import PropTypes from 'prop-types';
import { pdf, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

// import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetIncomePaymentControl } from 'src/api';

import Iconify from 'src/components/iconify';

import InvoicePDF from './invoice-pdf';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice, currentStatus, statusOptions, onChangeStatus }) {
  // const router = useRouter();
  const view = useBoolean();

  const { t } = useTranslate();

  const { incomePaymentData } = useGetIncomePaymentControl({
    economic_movement: invoice.economic_movement?._id,
    recieved: true,
    select: 'balance',
  });

  const paidAmount = incomePaymentData.reduce((acc, one) => {
    if (typeof one.balance === 'number') {
      return acc + one.balance;
    }
    return acc;
  }, 0);

  // const handleEdit = useCallback(() => {
  //   router.push(paths.stakeholder.accounting.economicmovements.edit(invoice.id));
  // }, [invoice.id, router]);

  const printPdf = async () => {
    const blob = await pdf(
      <InvoicePDF invoice={invoice} currentStatus={currentStatus} paidAmount={paidAmount} />
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
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          {/* <Tooltip title={t("edit")}>
            <IconButton onClick={handleEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip> */}

          <Tooltip title={t('view')}>
            <IconButton onClick={view.onTrue}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={
              <InvoicePDF invoice={invoice} currentStatus={currentStatus} paidAmount={paidAmount} />
            }
            fileName={`${fDate(new Date(invoice.created_at), 'yyyy')} - ${invoice.sequence_number}`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title={t('download')}>
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Iconify icon="eva:cloud-download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <Tooltip title={t('print')}>
            <IconButton onClick={printPdf}>
              <Iconify icon="solar:printer-minimalistic-bold" />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Send">
            <IconButton>
              <Iconify icon="iconamoon:send-fill" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <Iconify icon="solar:share-bold" />
            </IconButton>
          </Tooltip> */}
        </Stack>

        {/* <TextField
          fullWidth
          select
          label={t('status')}
          value={currentStatus}
          onChange={onChangeStatus}
          sx={{
            maxWidth: 160,
          }}
        >
          {statusOptions.map((option) => (
            <MenuItem lang="ar" key={option.value} value={option.value}>
              {t(option.value)}
            </MenuItem>
          ))}
        </TextField> */}
      </Stack>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              {t('close')}
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF invoice={invoice} currentStatus={currentStatus} paidAmount={paidAmount} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

InvoiceToolbar.propTypes = {
  currentStatus: PropTypes.string,
  invoice: PropTypes.object,
  onChangeStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};
