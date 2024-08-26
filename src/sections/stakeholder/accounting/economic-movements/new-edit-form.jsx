import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Button, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
// import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

import InvoiceNewEditAddress from './invoice-new-edit-address';
import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditInsurance from './invoice-new-edit-insurance';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';
import InvoiceNewEditTaxDetails from './invoice-new-edit-tax-details';
import InvoiceNewEditInstallment from './invoice-new-edit-installment';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order = searchParams.get('order');

  const [orderInfo, setOrderInfo] = useState();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const confirm = useBoolean();
  const insurance = useBoolean();
  const installment = useBoolean();
  // const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const NewInvoiceSchema = Yup.object().shape({
    createDate: Yup.mixed().nullable().required(t('required field')),
    patient: Yup.mixed().nullable(),
    unit_service: Yup.mixed().nullable(),
    appointment: Yup.mixed().nullable(),
    entrance: Yup.mixed().nullable(),
    employee: Yup.mixed().nullable(),
    dueDate: Yup.mixed().nullable(),
    detailedTaxes: Yup.bool(),
    products: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          product: Yup.string().required(t('required field')),
          deduction: Yup.number(),
          price_per_unit: Yup.number(),
          discount_amount: Yup.number(),
          subtotal: Yup.number(),
          tax: Yup.number(),
          total: Yup.number(),
          quantity: Yup.number().required(t('required field')),
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
    work_shift: Yup.string().nullable(),
    subtotal: Yup.number(),
    totalAmount: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      createDate: currentInvoice?.created_at || new Date(),
      stakeholder:
        currentInvoice?.unit_service?._id ||
        currentInvoice?.unit_service ||
        user?.stakeholder._id ||
        null,
      unit_service:
        currentInvoice?.unit_service?._id ||
        currentInvoice?.unit_service ||
        orderInfo?.unit_service?._id ||
        null,
      employee: currentInvoice?.employee?._id || currentInvoice?.employee || null,
      patient:
        currentInvoice?.patient?._id || currentInvoice?.patient?._id || orderInfo?.patient || null,
      dueDate: currentInvoice?.dueDate || null,
      order: currentInvoice?.order || order,
      detailedTaxes: currentInvoice?.detailedTaxes || true,
      taxes: currentInvoice?.taxes || 0,
      deduction: currentInvoice?.Total_deduction_amount || 0,
      status: currentInvoice?.status || 'paid',
      discount: currentInvoice?.Total_discount_amount || 0,
      subtotal: currentInvoice?.Subtotal_Amount || 0,
      totalAmount: currentInvoice?.totalAmount || 0,
      products: currentInvoice?.products ||
        orderInfo?.products.map((one) => {
          const subtotal = one.real_delieverd_quantity * one.price;
          const deduction = one.product?.deduction?.percentage
            ? one.product?.deduction?.percentage
            : 0;
          const tax = one.product?.tax?.percentage ? one.product?.tax?.percentage : 0;
          return {
            product: one.product?._id,
            quantity: one.real_delieverd_quantity || 1,
            price_per_unit: one.price || 0,
            subtotal: subtotal || 0,
            discount_amount: 0,
            deduction: deduction || 0,
            tax: tax || 0,
            total: subtotal + (deduction / 100) * subtotal + (tax / 100) * subtotal || 0,
          };
        }) || [
          {
            product: null,
            quantity: 1,
            price_per_unit: 0,
            subtotal: 0,
            discount_amount: 0,
            deduction: 0,
            tax: 0,
            total: 0,
          },
        ],
      payment_details: currentInvoice?.payment_details || [],
    }),
    [
      currentInvoice,
      user?.stakeholder,
      orderInfo?.unit_service,
      orderInfo?.patient,
      orderInfo?.products,
      order,
    ]
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
  const values = watch();
  console.log('valuessss', values.products);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    try {
      const invoice = await axiosInstance.post(endpoints.economec_movements.all, data);
      reset();
      enqueueSnackbar(t('created successfully'));
      loadingSend.onFalse();
      router.push(paths.stakeholder.accounting.economicmovements.info(invoice?.data?.movement._id));
      if (invoice?.data?.receiptPayment?._id) {
        window.open(
          paths.stakeholder.accounting.reciepts.info(invoice?.data?.receiptPayment?._id),
          '_blank'
        );
      }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (order) {
          const { data } = await axiosInstance.get(endpoints.orders.one(order), {
            params: {
              select: 'Service_types patient work_shift appointment',
              populate: [
                { path: 'Service_types', select: 'name_english name_arabic Price_per_unit' },
              ],
            },
          });
          setOrderInfo(data);
        }
      } catch (e) {
        console.log('entranceData', e);
      }
    };
    fetchData();
  }, [order]);

  return (
    <>
      <Container maxWidth="xl">
        <FormProvider methods={methods}>
          <Card>
            <InvoiceNewEditAddress />
            {/* 
            <Stack direction="row" justifyContent="flex-end" px={5} pt={3} pb={0}>
              <RHFCheckbox
                name="detailedTaxes"
                label={t('detailed taxes')}
                onChange={confirm.onTrue}
              />
            </Stack> */}
            {values.detailedTaxes ? <InvoiceNewEditTaxDetails /> : <InvoiceNewEditDetails />}
            <InvoiceNewEditStatusDate />

            {values.status === 'paid' && (
              <Stack sx={{ px: 3, py: 1 }}>
                <RHFRadioGroup
                  row
                  name="payment_method"
                  label={t('payment method')}
                  options={[
                    { label: t('cash'), value: 'cash' },
                    { label: t('credit card'), value: 'credit_card' },
                    { label: t('bank transfer'), value: 'bank_transfer' },
                    { label: t('instant bank transfer'), value: 'instant_transfer' },
                  ]}
                />
              </Stack>
            )}

            <Stack sx={{ my: 2, px: 2 }}>
              <RHFTextField name="concept" label={t('concept')} />
            </Stack>

            <InvoiceNewEditInstallment
              open={installment.value}
              onClose={installment.onFalse}
              onSubmit={handleCreateAndSend}
            />

            <InvoiceNewEditInsurance
              open={insurance.value}
              onClose={insurance.onFalse}
              onSubmit={handleCreateAndSend}
            />
          </Card>

          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton
              size="large"
              variant="contained"
              disabled={!values.unit_service && !values.patient}
              loading={loadingSend.value && isSubmitting}
              onClick={() => {
                if (values.status === 'installment') {
                  installment.onTrue();
                } else if (values.status === 'insurance') {
                  insurance.onTrue();
                } else handleCreateAndSend();
              }}
            >
              {currentInvoice ? t('update') : t('create')} & {t('print')}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('confirm changing display option')}
        content={t('you will loose the all details items data')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setValue('items', defaultValues.items);
              setValue('detailedTaxes', !values.detailedTaxes);
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
