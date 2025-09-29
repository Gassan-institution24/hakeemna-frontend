// import { useRouter } from 'src/routes/hooks';
import QRCode from 'qrcode';
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

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import InvoicePDF from './invoice-pdf';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice, currentStatus, statusOptions, onChangeStatus }) {
  // const router = useRouter();
  const view = useBoolean();
  const qrString = invoice?.invoice_QR;
  const { t } = useTranslate();
  // eslint-disable-next-line consistent-return
  const generateQrDataUrl = async (text) => {
    try {
      const dataUrl = await QRCode.toDataURL(text);
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate QR:', err);
    }
  };
  const qrDataUrl = generateQrDataUrl(qrString);
  const printPdf = async () => {
    try {
      const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();

      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
      };
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };

  const fileName = `invoice-${invoice?.sequence_number || 'unknown'}-${fDate(
    new Date(invoice?.created_at || new Date()),
    'yyyyMMdd'
  )}.pdf`;

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
            document={<InvoicePDF invoice={invoice} qr={qrDataUrl} />}
            fileName={fileName}
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
        </Stack>
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
              <InvoicePDF invoice={invoice} currentStatus={currentStatus} />
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
