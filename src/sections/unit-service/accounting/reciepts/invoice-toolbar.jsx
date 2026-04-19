import { useRef } from 'react';
import PropTypes from 'prop-types';
import { pdf, PDFViewer } from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';

// import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetIncomePaymentControl } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { generatePdfFromElement } from 'src/components/pdf/generate-pdf';

import InvoicePDF from './invoice-pdf';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice, currentStatus, invoiceRef  }) {
  // const router = useRouter();
  const view = useBoolean();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
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

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
          <Tooltip title={t('print')}>
            <IconButton
              color="primary"
              onClick={() =>
                generatePdfFromElement(
                  invoiceRef.current,
                  `invoice-${
                    curLangAr
                      ? invoice?.unit_service?.name_arabic
                      : invoice?.unit_service?.name_english
                  }-${invoice?.sequence_number}.pdf`
                )
              }
            >
              <Iconify icon="eva:cloud-download-fill" />
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
  invoiceRef: PropTypes.func,
};
