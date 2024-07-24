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
  const appointment = searchParams.get('appointment');
  const entrance = searchParams.get('entrance');

  const [entranceInfo, setEntranceInfo] = useState();
  const [appointmentInfo, setAppointmentInfo] = useState();

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
    createDate: Yup.mixed().nullable().required('Create date is required'),
    patient: Yup.mixed().nullable().required('Invoice to is required'),
    unit_service: Yup.mixed(),
    appointment: Yup.mixed().nullable(),
    entrance: Yup.mixed().nullable(),
    employee: Yup.mixed(),
    dueDate: Yup.mixed().nullable(),
    detailedTaxes: Yup.bool(),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          service_type: Yup.string().required('Service is required'),
          activity: Yup.string().nullable(),
          // deduction: Yup.number(),
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
    // deduction_type: Yup.string().nullable(),
    // deduction: Yup.number(),
    discount: Yup.number(),
    work_shift: Yup.string().nullable(),
    subtotal: Yup.number(),
    totalAmount: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      createDate: currentInvoice?.created_at || new Date(),
      unit_service:
        currentInvoice?.unit_service?._id ||
        currentInvoice?.unit_service ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id,
      employee:
        currentInvoice?.employee?._id ||
        currentInvoice?.employee ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
      patient:
        currentInvoice?.patient?._id ||
        currentInvoice?.patient ||
        entranceInfo?.patient ||
        appointmentInfo?.patient ||
        null,
      work_shift:
        currentInvoice?.work_shift?._id ||
        currentInvoice?.work_shift ||
        entranceInfo?.work_shift ||
        appointmentInfo?.work_shift ||
        null,
      dueDate: currentInvoice?.dueDate || null,
      entrance: currentInvoice?.entrance || entrance || null,
      appointment: currentInvoice?.appointment || appointment || entranceInfo?.appointment || null,
      detailedTaxes: currentInvoice?.detailedTaxes || false,
      taxes: currentInvoice?.taxes || 0,
      // deduction: currentInvoice?.Total_deduction_amount || 0,
      status: currentInvoice?.status || 'paid',
      discount: currentInvoice?.Total_discount_amount || 0,
      subtotal: currentInvoice?.Subtotal_Amount || 0,
      totalAmount: currentInvoice?.totalAmount || 0,
      items: currentInvoice?.Provided_services ||
        entranceInfo?.Service_types?.map((one) => ({
          service_type: one._id || null,
          activity: null,
          quantity: 1,
          price_per_unit: Number(one.Price_per_unit) || 0,
          subtotal: Number(one.Price_per_unit) || 0,
          discount_amount: 0,
          // deduction: 0,
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
            // deduction: 0,
            tax: 0,
            total: 0,
          },
        ],
      payment_details: currentInvoice?.payment_details || [],
    }),
    [currentInvoice, user?.employee, entrance, appointment, appointmentInfo, entranceInfo]
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
    formState: { isSubmitting, errors },
  } = methods;
  console.log('errors', errors);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (entrance) {
          const { data } = await axiosInstance.get(endpoints.entranceManagement.one(entrance), {
            params: {
              select: 'Service_types patient work_shift appointment',
              populate: [
                { path: 'Service_types', select: 'name_english name_arabic Price_per_unit' },
              ],
            },
          });
          setEntranceInfo(data);
        } else if (appointment) {
          const { data } = await axiosInstance.get(endpoints.appointments.one(appointment), {
            params: { select: 'patient work_shift' },
          });
          setAppointmentInfo(data);
        }
      } catch (e) {
        console.log('entranceData', e);
      }
    };
    fetchData();
  }, [appointment, entrance]);

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    try {
      const invoice = await axiosInstance.post(endpoints.economec_movements.all, data);
      reset();
      enqueueSnackbar(t('created successfully'));
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
            {/* 
            <Stack direction="row" justifyContent="flex-end" px={5} pt={3} pb={0}>
              <RHFCheckbox
                name="detailedTaxes"
                label={t('detailed taxes')}
                onChange={confirm.onTrue}
              />
            </Stack> */}
            {watch().detailedTaxes ? <InvoiceNewEditTaxDetails /> : <InvoiceNewEditDetails />}
            <InvoiceNewEditStatusDate />

            {watch().status === 'paid' && (
              <Stack sx={{ px: 3, py: 1 }}>
                <RHFRadioGroup
                  row
                  name="payment_method"
                  label={t('payment method')}
                  options={[
                    { label: 'cash', value: 'cash' },
                    { label: 'credit card', value: 'credit_card' },
                    { label: 'bank transfer', value: 'bank_transfer' },
                    { label: 'instant bank transfer', value: 'instant_transfere' },
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
              loading={loadingSend.value && isSubmitting}
              onClick={() => {
                if (watch().status === 'installment') {
                  installment.onTrue();
                } else if (watch().status === 'insurance') {
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
              setValue('detailedTaxes', !watch().detailedTaxes);
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
