import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

// import { _addressBooks } from 'src/_mock';

import FormProvider, { RHFCheckbox } from 'src/components/hook-form';

import InvoiceNewEditAddress from '../invoice-new-edit-address';
import InvoiceNewEditStatusDate from '../invoice-new-edit-status-date';
import InvoiceNewEditDetails from '../invoice-new-edit-details';
import InvoiceNewEditTaxDetails from '../invoice-new-edit-tax-details';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const { t } = useTranslate()

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const NewInvoiceSchema = Yup.object().shape({
    invoiceNumber: Yup.string(),
    createDate: Yup.mixed().nullable().required('Create date is required'),
    invoiceTo: Yup.mixed().nullable().required('Invoice to is required'),
    invoiceFrom: Yup.mixed(),
    dueDate: Yup.mixed(),
    detailedTaxes: Yup.bool(),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          service: Yup.string().required('Service is required'),
          activity: Yup.string(),
          deduction: Yup.number(),
          discount: Yup.number(),
          subtotal: Yup.number(),
          tax: Yup.number(),
          total: Yup.number(),
          quantity: Yup.number()
            .required('Quantity is required')
            .min(1, 'Quantity must be more than 0'),
        })
      )
    ),
    // not required
    taxes: Yup.number(),
    deduction: Yup.number(),
    status: Yup.string(),
    discount: Yup.number(),
    shipping: Yup.number(),
    subtotal: Yup.number(),
    totalAmount: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: currentInvoice?.invoiceNumber || 'INV-1990',
      createDate: currentInvoice?.createDate || new Date(),
      invoiceFrom: currentInvoice?.invoiceFrom || '',
      invoiceTo: currentInvoice?.invoiceTo || null,
      dueDate: currentInvoice?.dueDate || null,
      detailedTaxes: currentInvoice?.detailedTaxes || false,
      taxes: currentInvoice?.taxes || 0,
      deduction: currentInvoice?.deduction || 0,
      shipping: currentInvoice?.shipping || 0,
      status: currentInvoice?.status || 'draft',
      discount: currentInvoice?.discount || 0,
      subtotal: currentInvoice?.subtotal || 0,
      totalAmount: currentInvoice?.totalAmount || 0,
      items: currentInvoice?.items || [
        {
          service: null,
          activity: '',
          quantity: 1,
          price: 0,
          subtotal: 0,
          discount: 0,
          deduction: 0,
          tax: 0,
          total: 0,
        },
      ],
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card>
          <InvoiceNewEditAddress />

          <InvoiceNewEditStatusDate />
          <Stack direction='row' justifyContent='flex-end' px={5} pt={3} pb={0}>
            <RHFCheckbox
              name='detailedTaxes'
              label={t('detailed taxes and deductions')}
              onChange={() => setValue('detailedTaxes', !watch().detailedTaxes)}
            />
          </Stack>
          {watch().detailedTaxes ? <InvoiceNewEditTaxDetails /> : <InvoiceNewEditDetails />}

        </Card>

        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            color="inherit"
            size="large"
            variant="outlined"
            loading={loadingSave.value && isSubmitting}
            onClick={handleSaveAsDraft}
          >
            {t('save as draft')}
          </LoadingButton>

          <LoadingButton
            size="large"
            variant="contained"
            loading={loadingSend.value && isSubmitting}
            onClick={handleCreateAndSend}
          >
            {currentInvoice ? t('update') : t('create')} & {t('send')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}

InvoiceNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
