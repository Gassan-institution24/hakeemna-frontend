import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Button, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAppointment, useGetOneEntranceManagement } from 'src/api';

import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFCheckbox } from 'src/components/hook-form';

import InvoiceNewEditAddress from './invoice-new-edit-address';
import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';
import InvoiceNewEditTaxDetails from './invoice-new-edit-tax-details';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointment = searchParams.get('appointment');
  const entrance = searchParams.get('entrance');

  const { Entrance } = useGetOneEntranceManagement(entrance, {
    select: 'Service_types patient',
    populate: [{ path: 'Service_types', select: 'name_english name_arabic Price_per_unit' }]
  })
  const { data: appointmentData } = useGetAppointment(appointment, { select: 'patient' })
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext()

  const confirm = useBoolean();
  // const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const { enqueueSnackbar } = useSnackbar()

  const NewInvoiceSchema = Yup.object().shape({
    // invoiceNumber: Yup.string(),
    createDate: Yup.mixed().nullable().required('Create date is required'),
    patient: Yup.mixed().nullable().required('Invoice to is required'),
    unit_service: Yup.mixed(),
    appointment: Yup.mixed(),
    entrance: Yup.mixed(),
    employee: Yup.mixed(),
    dueDate: Yup.mixed().nullable(),
    detailedTaxes: Yup.bool(),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          service_type: Yup.string().required('Service is required'),
          activity: Yup.string().nullable(),
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
    status: Yup.string(),
    taxes_type: Yup.string().nullable(),
    taxes: Yup.number(),
    deduction_type: Yup.string().nullable(),
    deduction: Yup.number(),
    discount: Yup.number(),
    subtotal: Yup.number(),
    totalAmount: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      // invoiceNumber: currentInvoice?.invoiceNumber || 'INV-1990',
      createDate: currentInvoice?.created_at || new Date(),
      unit_service: currentInvoice?.unit_service?._id || currentInvoice?.unit_service || user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id,
      employee: currentInvoice?.employee?._id || currentInvoice?.employee || user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
      patient: currentInvoice?.patient?._id || currentInvoice?.patient || appointmentData?.patient || Entrance?.patient || null,
      dueDate: currentInvoice?.dueDate || null,
      entrance: currentInvoice?.entrance || entrance || null,
      appointment: currentInvoice?.appointment || appointment || null,
      detailedTaxes: currentInvoice?.detailedTaxes || false,
      taxes: currentInvoice?.taxes || 0,
      deduction: currentInvoice?.Total_deduction_amount || 0,
      status: currentInvoice?.status || 'draft',
      discount: currentInvoice?.Total_discount_amount || 0,
      subtotal: currentInvoice?.Subtotal_Amount || 0,
      totalAmount: currentInvoice?.totalAmount || 0,
      items: currentInvoice?.Provided_services || Entrance?.Service_types?.map((one) => (
        {
          service_type: one._id || null,
          activity: null,
          quantity: 1,
          price_per_unit: Number(one.Price_per_unit) || 0,
          subtotal: Number(one.Price_per_unit) || 0,
          discount_amount: 0,
          deduction: 0,
          tax: 0,
          total: Number(one.Price_per_unit) || 0,
        })) || [
          {
            service_type: null,
            activity: null,
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
    [currentInvoice, user?.employee, entrance, appointment, appointmentData, Entrance]
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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // const handleSaveAsDraft = handleSubmit(async (data) => {
  //   loadingSave.onTrue();
  //   try {
  //     await axiosInstance.post(endpoints.economec_movements.all, data)
  //     // reset();
  //     loadingSave.onFalse();
  //     router.push(paths.dashboard.invoice.root);
  //     console.info('DATA', JSON.stringify(data, null, 2));
  //   } catch (error) {
  //     console.error(error);
  //     loadingSave.onFalse();
  //   }
  // });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      const invoice = await axiosInstance.post(endpoints.economec_movements.all, data)
      reset();
      enqueueSnackbar(t('created successfully'))
      loadingSend.onFalse();
      router.push(paths.unitservice.accounting.economicmovements.info(invoice?.data?._id));
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
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
            {/* <LoadingButton
              color="inherit"
              size="large"
              variant="outlined"
              loading={loadingSave.value && isSubmitting}
              onClick={handleSaveAsDraft}
            >
              {t('save as draft')}
            </LoadingButton> */}

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
