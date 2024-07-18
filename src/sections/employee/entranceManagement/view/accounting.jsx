import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Button, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

// import { _addressBooks } from 'src/_mock';

import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFCheckbox } from 'src/components/hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import InvoiceNewEditAddress from '../invoice-new-edit-address';
import InvoiceNewEditDetails from '../invoice-new-edit-details';
import InvoiceNewEditStatusDate from '../invoice-new-edit-status-date';
import InvoiceNewEditTaxDetails from '../invoice-new-edit-tax-details';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const { t } = useTranslate()

  const { user } = useAuthContext()

  const confirm = useBoolean();
  const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const NewInvoiceSchema = Yup.object().shape({
    // invoiceNumber: Yup.string(),
    createDate: Yup.mixed().nullable().required('Create date is required'),
    patient: Yup.mixed().nullable().required('Invoice to is required'),
    unit_service: Yup.mixed(),
    employee: Yup.mixed(),
    dueDate: Yup.mixed().nullable(),
    detailedTaxes: Yup.bool(),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          service_type: Yup.string().required('Service is required'),
          activity: Yup.string(),
          deduction: Yup.number(),
          price_per_unit: Yup.number(),
          discount_amount: Yup.number(),
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
      // invoiceNumber: currentInvoice?.invoiceNumber || 'INV-1990',
      createDate: currentInvoice?.createDate || new Date(),
      unit_service: currentInvoice?.unit_service || user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id,
      employee: currentInvoice?.unit_service || user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
      patient: currentInvoice?.patient || null,
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
          service_type: null,
          activity: '',
          quantity: 1,
          price_per_unit: 0,
          subtotal: 0,
          discount_amount: 0,
          deduction: 0,
          tax: 0,
          total: 0,
        },
      ],
    }),
    [currentInvoice, user?.employee]
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
      await axiosInstance.post(endpoints.economec_movements.all, data)
      // reset();
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
      await axiosInstance.post(endpoints.economec_movements.all, data)
      // reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <>
      <Container maxWidth="xl">
        <FormProvider methods={methods}>
          <Card>
            <InvoiceNewEditAddress />

            <InvoiceNewEditStatusDate />
            <Stack direction='row' justifyContent='flex-end' px={5} pt={3} pb={0}>
              <RHFCheckbox
                name='detailedTaxes'
                label={t('detailed taxes and deductions')}
                onChange={confirm.onTrue}
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t("confirm changing display option")}
        content={t('you will loose the all details items data')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setValue('items', defaultValues.items)
              setValue('detailedTaxes', !watch().detailedTaxes)
              confirm.onFalse();
            }}
          >
            {t('confirm')}
          </Button>
        }
      />
    </>
  );
}

InvoiceNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
