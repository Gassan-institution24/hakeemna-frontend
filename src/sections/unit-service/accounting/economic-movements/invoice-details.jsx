import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import InvoiceToolbar from './invoice-toolbar';

// ----------------------------------------------------------------------

const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'installment', label: 'installment' },
  { value: 'insurance', label: 'insurance' },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoice, refetch }) {
  // const [currentStatus, setCurrentStatus] = useState(invoice.status);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const handleChangeStatus = useCallback(
    async (event) => {
      try {
        await axiosInstance.patch(endpoints.economec_movements.one(invoice._id), {
          status: event.target.value,
        });
        refetch();
      } catch (e) {
        // console.log(e)
      }
    },
    [invoice._id, refetch]
  );

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          {t('subtotal')}
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(invoice.Subtotal_Amount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t('discount')}</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-invoice.Total_discount_amount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t('deductions')}</TableCell>
        <TableCell width={120}>{fCurrency(invoice.Total_deduction_amount)}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>{t('taxes')}</TableCell>
        <TableCell width={120}>{fCurrency(invoice.Total_tax_Amount)}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>{t('total')}</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(invoice.Total_Amount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>{t('services')}</TableCell>

              <TableCell>{t('quantity')}</TableCell>

              <TableCell align="right">{t('price per unit')}</TableCell>

              <TableCell align="right">{t('total')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoice.Provided_services?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">
                      {curLangAr ? row.service_type?.name_arabic : row.service_type?.name_english}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {curLangAr
                        ? row.service_type?.description_arabic
                        : row.service_type?.description_english}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.quantity}</TableCell>

                <TableCell align="right">{fCurrency(row.price_per_unit)}</TableCell>

                <TableCell align="right">{fCurrency(row.income_amount)}</TableCell>
              </TableRow>
            ))}
            {invoice.provided_products?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">
                      {curLangAr ? row.product?.name_arabic : row.product?.name_english}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {curLangAr
                        ? row.product?.description_arabic
                        : row.product?.description_english}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.quantity}</TableCell>

                <TableCell align="right">{fCurrency(row.price_per_unit)}</TableCell>

                <TableCell align="right">{fCurrency(row.income_amount)}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={invoice.status || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      <Card sx={{ pt: 5, px: { xs: 2, sm: 4, md: 5 } }}>
        {/* الصف الأول: اللوجو + الستاتس */}
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
            src={
              invoice.unit_service?.company_logo
                ? invoice.unit_service?.company_logo
                : '/logo/doc.svg'
            }
            sx={{ width: 64, height: 64, mx: { xs: 'auto', sm: '0' } }} // بموبايل يكون بالنص
          />

          <Stack
            spacing={1}
            alignItems={{ xs: 'center', sm: 'flex-end' }} // بالموبايل بالنص
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

        {/* الصف الثاني: تفاصيل الفاتورة */}
        <Box
          mt={4}
          rowGap={3}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
        >
          {invoice?.stakeholder && (
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('from')}
              </Typography>
              {curLangAr ? invoice?.stakeholder?.name_arabic : invoice.stakeholder?.name_english}
              <br />
              {invoice.stakeholder?.address}
              <br />
              {t('phone')}: {invoice.stakeholder?.phone}
            </Stack>
          )}

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t(invoice?.stakeholder ? 'to' : 'from')}
            </Typography>
            {curLangAr ? invoice.unit_service.name_arabic : invoice.unit_service.name_english}
            <br />
            {invoice.unit_service.address}
            <br />
            {t('phone')}: {invoice.unit_service.phone}
          </Stack>

          {invoice?.patient && (
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('to')}
              </Typography>
              {curLangAr ? invoice?.patient?.name_arabic : invoice.patient?.name_english}
              <br />
              {invoice.patient?.address}
              <br />
              {t('phone')}: {invoice.patient?.mobile_num1}
            </Stack>
          )}

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('date')}
            </Typography>
            {fDate(invoice.created_at)}
          </Stack>

          {invoice.dueDate && (
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('due date')}
              </Typography>
              {fDate(invoice.dueDate)}
            </Stack>
          )}
          {invoice.invoiceId && (
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('envoicing system data')}
              </Typography>
              {t('invoice Id')}: {invoice.invoiceId}
            </Stack>
          )}
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
  refetch: PropTypes.func,
};
