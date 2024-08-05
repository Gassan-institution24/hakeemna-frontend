import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { NumberToText } from 'src/utils/number-to-words';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetIncomePaymentControl } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import InvoiceToolbar from './invoice-toolbar';

// ----------------------------------------------------------------------

const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'installment', label: 'installment' },
  { value: 'insurance', label: 'insurance' },
];

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoice, refetch }) {
  // const [currentStatus, setCurrentStatus] = useState(invoice.status);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { incomePaymentData } = useGetIncomePaymentControl({
    economic_movement: invoice.economic_movement?._id,
    recieved: true,
    select: 'balance',
  });

  const paidAmount = incomePaymentData.reduce((acc, one) => {
    if (typeof one.balance === 'number') {
      return acc - one.balance;
    }
    return acc;
  }, 0);

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

  const renderList = (
    <Stack gap={3} my={5}>
      {/* <Typography variant='h5'>{t('details')}:</Typography> */}
      <Stack direction="row" gap={2}>
        <Typography variant="body1">{t('we have recieved from mr./m/s')}:</Typography>
        <Typography
          sx={{ borderBottom: '1px dashed', flex: 1, textAlign: 'center' }}
          variant="subtitle1"
        >
          {curLangAr ? invoice?.patient?.name_arabic || invoice?.unit_service?.name_arabic : invoice?.patient?.name_english || invoice?.unit_service?.name_english}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2}>
        <Typography variant="body1">{t('the sum of')}:</Typography>
        <Typography
          sx={{ borderBottom: '1px dashed', flex: 1, textAlign: 'center' }}
          variant="subtitle1"
        >
          {fCurrency(invoice?.payment_amount)} {NumberToText(invoice?.payment_amount)}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2}>
        <Typography variant="body1">{t('for the economic movement number')}:</Typography>
        <Typography
          sx={{ borderBottom: '1px dashed', flex: 1, textAlign: 'center' }}
          variant="subtitle1"
        >
          {invoice?.economic_movement?.sequence_number}-{fDate(invoice?.created_at, 'yyyy')}
        </Typography>
      </Stack>
      {/* <Stack direction='row' justifyContent='space-between'> */}
      {/* </Stack> */}
      <Stack direction="row" mt={5}>
        <Stack direction="row" gap={2} flex={1}>
          <Typography variant="body1">{t('total economic movement amount')}:</Typography>
          <Typography
            sx={{ borderBottom: '1px dashed', flex: 1, textAlign: 'center' }}
            variant="subtitle1"
          >
            {fCurrency(invoice?.economic_movement?.Total_Amount)}
          </Typography>
        </Stack>
        <Stack direction="row" gap={2} flex={1}>
          <Typography variant="body1">{t('total paid amount')}:</Typography>
          <Typography
            sx={{ borderBottom: '1px dashed', flex: 1, textAlign: 'center' }}
            variant="subtitle1"
          >
            {fCurrency(paidAmount)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" gap={2}>
        <Typography variant="body1">{t('remaind amount')}:</Typography>
        <Typography
          sx={{ borderBottom: '1px dashed', flex: 1, textAlign: 'center' }}
          variant="subtitle1"
        >
          {fCurrency(invoice.economic_movement.Total_Amount - paidAmount)}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      <InvoiceToolbar
        invoice={invoice}
        currentStatus={invoice.status || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Typography textAlign="center" variant="h3">
          {t('receipt voucher')}
        </Typography>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
          mb={2}
        >
          <Box
            component="img"
            alt="logo"
            src={
              invoice.stakeholder?.company_logo
                ? invoice.stakeholder?.company_logo
                : '/logo/logo_single.svg'
            }
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            {/* <Label
              variant="soft"
              color={
                (invoice.status === 'paid' && 'success') ||
                (invoice.status === 'installment' && 'warning') ||
                (invoice.status === 'insurance' && 'info') ||
                'default'
              }
            >
              {t(invoice.status)}
            </Label> */}

            <Typography variant="h6">{invoice.sequence_number}</Typography>
            <Box mt={4} p={1.5} border="1px solid">
              <Typography variant="h6">{fCurrency(invoice?.payment_amount)}</Typography>
            </Box>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('date')}
            </Typography>
            {fDate(invoice.created_at)}
          </Stack>
          <Box />
          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('to')}
            </Typography>
            {curLangAr ? invoice.stakeholder.name_arabic : invoice.stakeholder.name_english}
            <br />
            {invoice.stakeholder.address}
            <br />
            {t('phone')}: {invoice.stakeholder.phone}
            <br />
          </Stack>

          {invoice.unit_service && <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('from')}
            </Typography>
            {curLangAr ? invoice.unit_service.name_arabic : invoice.unit_service.name_english}
            <br />
            {invoice.unit_service.address}
            <br />
            {t('phone')}: {invoice.unit_service.phone}
            <br />
          </Stack>}

          {invoice.patient && <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('from')}
            </Typography>
            {curLangAr ? invoice.patient.name_arabic : invoice.patient.name_english}
            <br />
            {invoice.patient.address}
            <br />
            {t('phone')}: {invoice.patient.mobile_num1}
            <br />
          </Stack>}

          {invoice.dueDate && (
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('due date')}
              </Typography>
              {fDate(invoice.dueDate)}
            </Stack>
          )}
        </Box>
        {/* <Divider /> */}
        {renderList}
        {/* <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
        <Stack alignItems='flex-end' p={2}>
          <Typography variant='caption'>{t('printed by')}:{user.email}</Typography>
        </Stack> */}
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
  refetch: PropTypes.func,
};
