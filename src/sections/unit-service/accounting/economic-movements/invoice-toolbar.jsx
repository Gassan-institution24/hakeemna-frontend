import QRCode from 'qrcode';
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import { useMediaQuery } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { generatePdfFromElement } from 'src/components/pdf/generatePdf';

// ----------------------------------------------------------------------

export default function InvoiceToolbar({ invoice }) {
  const { t } = useTranslate();
  const invoiceRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    const generate = async () => {
      if (invoice?.invoice_QR) {
        const dataUrl = await QRCode.toDataURL(invoice.invoice_QR);
        setQrDataUrl(dataUrl);
      }
    };
    generate();
  }, [invoice?.invoice_QR]);

  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ mb: { xs: 2, md: 5 }, px: { xs: 1, sm: 3 } }}
    >
      <Card
        ref={invoiceRef}
        sx={{
          position: 'absolute',
          left: '-9999px',
          pointerEvents: 'none',
          width: '100%',
          maxWidth: 900,
          minHeight: '100vh', // 👈 يضمن إنه ياخذ ارتفاع الصفحة بالكامل
          p: { xs: 2, md: 4 },
          backgroundColor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          display: 'flex', // 👈 ضروري
          flexDirection: 'column', // 👈 ضروري
        }}
      >
        {/* Header */}
        <Box
          rowGap={3}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/doc.webp"
            sx={{
              width: 64,
              height: 64,
              mx: { xs: 'auto', sm: '0' },
            }}
          />

          <Stack
            spacing={1}
            alignItems={{ xs: 'center', sm: 'flex-end' }}
            textAlign={{ xs: 'center', sm: 'right' }}
          >
            <Label
              variant="soft"
              color={
                (invoice.status === 'paid' && 'success') ||
                (invoice.status === 'installment' && 'warning') ||
                (invoice.status === 'insurance' && 'info') ||
                'default'
              }
            >
              {t(invoice.status)}
            </Label>
            <Typography variant="h6">{invoice.sequence_number}</Typography>
          </Stack>
        </Box>

        {/* Info */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          mt={4}
          gap={2}
        >
          <Box flex={1} minWidth={250}>
            <Typography variant="body2">
              {t('date')}: {fDate(invoice?.created_at)}
            </Typography>

            {(invoice?.unit_service_patient || invoice?.patient) && (
              <>
                <Typography variant="body2" mt={2}>
                  {t('to')}:{' '}
                  {curLangAr
                    ? invoice?.unit_service_patient?.name_arabic || invoice?.patient?.name_arabic
                    : invoice?.unit_service_patient?.name_english || invoice?.patient?.name_english}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {t('address')}:{' '}
                  {invoice?.unit_service_patient?.address || invoice?.patient?.address}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {t('mobile number')}:{' '}
                  {invoice?.unit_service_patient?.mobile_num1 || invoice?.patient?.mobile_num1}
                </Typography>
              </>
            )}
          </Box>

          {qrDataUrl && (
            <Box
              component="img"
              src={qrDataUrl}
              alt="QR Code"
              sx={{
                width: 140,
                height: 140,
                mx: { xs: 'auto', sm: 0 },
                mt: { xs: 2, sm: 0 },
                objectFit: 'contain',
                border: '1px solid #eee',
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        {/* Table */}

        {/* Table / Card View */}
        <Box sx={{ mt: 4, width: '100%' }}>
          {isMobile ? (
            // 👇 عرض الموبايل (بطاقات)
            <Stack spacing={2}>
              {invoice?.Provided_services?.map((row, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: '#fafafa',
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('service')} #{index + 1}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body2">
                    <b>{t('name')}:</b>{' '}
                    {curLangAr ? row.service_type?.name_arabic : row.service_type?.name_english}
                  </Typography>
                  <Typography variant="body2">
                    <b>{t('quantity')}:</b> {row?.quantity || 0}
                  </Typography>
                  <Typography variant="body2">
                    <b>{t('price')}:</b> {fCurrency(row.service_type?.Price_per_unit || 0)}
                  </Typography>
                  <Typography variant="body2">
                    <b>{t('total')}:</b>{' '}
                    {fCurrency((row?.quantity || 1) * (row.service_type?.Price_per_unit || 0))}
                  </Typography>
                </Card>
              ))}
            </Stack>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>#</TableCell>
                    <TableCell>{t('services')}</TableCell>
                    <TableCell align="center">{t('quantity')}</TableCell>
                    <TableCell align="center">{t('price')}</TableCell>
                    <TableCell align="center">{t('total')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice?.Provided_services?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {curLangAr ? row.service_type?.name_arabic : row.service_type?.name_english}
                      </TableCell>
                      <TableCell align="center">{row?.quantity || 0}</TableCell>
                      <TableCell align="center">
                        {fCurrency(row.service_type?.Price_per_unit || 0)}
                      </TableCell>
                      <TableCell align="center">
                        {fCurrency((row?.quantity || 1) * (row.service_type?.Price_per_unit || 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Totals */}
        <Stack spacing={1} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          {invoice?.Subtotal_Amount && (
            <Typography>
              <b>{t('subtotal')}:</b> {fCurrency(invoice?.Subtotal_Amount)}
            </Typography>
          )}
          {invoice?.Total_discount_amount && (
            <Typography color="error">
              <b>{t('discount')}:</b> {fCurrency(-invoice.Total_discount_amount)}
            </Typography>
          )}
          {invoice?.Total_deduction_amount && (
            <Typography>
              <b>{t('deductions')}:</b> {fCurrency(invoice?.Total_deduction_amount)}
            </Typography>
          )}
          {invoice?.Total_tax_Amount > 0 && (
            <Typography>
              <b>{t('taxes')}:</b> {fCurrency(invoice?.Total_tax_Amount)}
            </Typography>
          )}
          {invoice?.Total_Amount && (
            <Typography variant="h6">
              <b>{t('total')}:</b> {fCurrency(invoice?.Total_Amount)}
            </Typography>
          )}
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            mt: 'auto',
            textAlign: 'center',
            pt: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('Powered by hakeemna360')}
          </Typography>
        </Box>
      </Card>

      {/* زر التحميل */}
      <Tooltip title={t('print')}>
        <IconButton
          color="primary"
          onClick={() =>
            generatePdfFromElement(
              invoiceRef.current,
              `invoice-${
                curLangAr ? invoice?.unit_service?.name_arabic : invoice?.unit_service?.name_english
              }-${invoice?.sequence_number}.pdf`
            )
          }
        >
          <Iconify icon="eva:cloud-download-fill" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

InvoiceToolbar.propTypes = {
  invoice: PropTypes.object,
};
