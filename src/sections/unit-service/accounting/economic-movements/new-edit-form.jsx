import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  Container,
  TextField,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetServiceType,
  useGetUnitservice,
  useGetOneUSPatient,
  useGetOneEntranceManagement,
} from 'src/api';

import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFCheckbox, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

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
  const { Entrance } = useGetOneEntranceManagement(entrance);
  const [entranceInfo, setEntranceInfo] = useState();
  const { data: PatientData } = useGetPatient(Entrance?.patient);
  const { data: unitData } = useGetUnitservice(Entrance?.service_unit);
  const { usPatientData } = useGetOneUSPatient(Entrance?.unit_service_patient);
  const [appointmentInfo, setAppointmentInfo] = useState();
  const [invoicing, setInvoicing] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const { user } = useAuthContext();
  const dialog = useBoolean(false);
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [formData, setFormData] = useState({
    Secret_Key: unitData?.Secret_Key || '',
    Activity_Number: unitData?.Activity_Number || '',
    ClientId: unitData?.ClientId || '',
    CompanyID: unitData?.CompanyID || '',
    RegistrationName: unitData?.RegistrationName || '',
    invoicing_system: unitData?.invoicing_system || true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const NewInvoiceSchema = Yup.object().shape({
    createDate: Yup.mixed().nullable().required(t('required field')),
    patient: Yup.mixed().nullable(),
    unit_service: Yup.mixed(),
    appointment: Yup.mixed().nullable(),
    entrance: Yup.mixed().nullable(),
    employee: Yup.mixed(),
    dueDate: Yup.mixed().nullable(),
    detailedTaxes: Yup.bool(),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          service_type: Yup.string().required(t('required field')),
          activity: Yup.string().nullable(),
          price_per_unit: Yup.number(),
          discount_amount: Yup.number(),
          subtotal: Yup.number(),
          tax: Yup.number(),
          total: Yup.number(),
          quantity: Yup.number().required(t('required field')),
        })
      )
    ),
    status: Yup.string(),
    taxes_type: Yup.string().nullable(),
    taxes: Yup.number(),
    discount: Yup.number(),
    work_shift: Yup.string().nullable(),
    subtotal: Yup.number(),
    totalAmount: Yup.number(),
    concept: Yup.string().required(t('required field')),
  });
  const defaultValues = useMemo(
    () => ({
      createDate: currentInvoice?.created_at || new Date(),
      unit_service:
        currentInvoice?.unit_service?._id ||
        currentInvoice?.unit_service ||
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id,
      employee:
        currentInvoice?.employee?._id ||
        currentInvoice?.employee ||
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id,
      patient:
        currentInvoice?.patient?._id ||
        currentInvoice?.patient ||
        entranceInfo?.patient ||
        appointmentInfo?.patient ||
        null,
      unit_service_patient:
        currentInvoice?.unit_service_patient?._id ||
        currentInvoice?.unit_service_patient ||
        entranceInfo?.unit_service_patient ||
        appointmentInfo?.unit_service_patient ||
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
      status: currentInvoice?.status || 'paid',
      discount: currentInvoice?.Total_discount_amount || 0,
      subtotal: currentInvoice?.Subtotal_Amount || 0,
      totalAmount: currentInvoice?.totalAmount || 0,
      items: currentInvoice?.Provided_services ||
        (entranceInfo?.Service_types?.length > 0 &&
          entranceInfo?.Service_types?.map((one) => ({
            service_type: one._id || null,
            activity: null,
            quantity: 1,
            price_per_unit: Number(one.Price_per_unit) || 0,
            subtotal: Number(one.Price_per_unit) || 0,
            discount_amount: 0,
            tax: 0,
            total: Number(one.Price_per_unit) || 0,
          }))) || [
          {
            service_type: null,
            activity: null,
            quantity: 1,
            price_per_unit: 0,
            subtotal: 0,
            discount_amount: 0,
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
    formState: { isSubmitting },
  } = methods;
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  const values = watch();
  const firstServiceTypeId = values?.items?.[0]?.service_type;
  const { data: ServiceTypeData } = useGetServiceType(firstServiceTypeId);
  const totalQuantity = values?.items?.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  const confirm = useBoolean();
  const insurance = useBoolean();
  const installment = useBoolean();

  const loadingSend = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (entrance) {
          const { data } = await axiosInstance.get(endpoints.entranceManagement.one(entrance), {
            params: {
              select: 'Service_types patient unit_service_patient work_shift appointment',
              populate: [
                { path: 'Service_types', select: 'name_english name_arabic Price_per_unit' },
              ],
            },
          });
          setEntranceInfo(data);
        } else if (appointment) {
          const { data } = await axiosInstance.get(endpoints.appointments.one(appointment), {
            params: { select: 'patient unit_service_patient work_shift' },
          });
          setAppointmentInfo(data);
        }
      } catch (e) {
        console.log('entranceData', e);
      }
    };
    fetchData();
  }, [appointment, entrance]);
  const handleInvoicingChange = async (checked) => {
    setIsCheckboxChecked(checked);
    // If user is unchecking, simply close dialog and disable invoicing
    if (!checked) {
      setInvoicing(false);
      dialog.onFalse();
      return;
    }
    // Check if any required field is missing
    const missing =
      !unitData.Secret_Key ||
      !unitData.Activity_Number ||
      !unitData.ClientId ||
      !unitData.CompanyID ||
      !unitData.RegistrationName;

    if (missing) {
      setInvoicing(false);
      dialog.onTrue(); // show dialog to fill in data
    } else {
      setInvoicing(true); // all data exists; just check box
      dialog.onFalse();
    }
  };

  const handleDialogClose = () => {
    dialog.onFalse();
    setIsCheckboxChecked(false);
  };
  const handleUpdateData = async () => {
    try {
      await axiosInstance.patch(endpoints.unit_services.one(unitData._id), formData);
      enqueueSnackbar(t('Data updated successfully'), { variant: 'success' });
      dialog.onFalse();
      setIsCheckboxChecked(true); // keep box checked after successful update
      setInvoicing(true);
    } catch (err) {
      enqueueSnackbar(err.message || err, { variant: 'error' });
    }
  };

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    try {
      const invoice = await axiosInstance.post(endpoints.economec_movements.all, data);
      const subtotal = data.subtotal || 0;
      const quantity = totalQuantity;
      const concept = data.concept ?? '';
      const total = data.totalAmount || 0;
      const discount = data.discount || 0;
      const payloadForOtherTable = {
        Secret_Key: unitData.Secret_Key,
        Activity_Number: unitData.Activity_Number,
        ClientId: unitData.ClientId,
        CompanyID: unitData.CompanyID,
        RegistrationName: unitData.RegistrationName,
        Buyer:
          PatientData?.name_arabic ||
          usPatientData?.name_arabic ||
          PatientData?.name_english ||
          usPatientData?.name_english,
        BuyerNum: PatientData?.mobile_num1 || usPatientData?.mobile_num1,
        BuyerIdNum: PatientData?.identification_num || usPatientData?.identification_num,
        BuyerCity: PatientData?.city?.name_arabic || usPatientData?.city?.name_arabic,
        service_type: ServiceTypeData?.name_arabic,
        subtotal,
        quantity,
        discount,
        total,
        concept,
      };
      if (invoicing) {
        try {
          await axiosInstance.post('/api/invoice', payloadForOtherTable);
        } catch (e) {
          console.error('خطأ أثناء إرسال الفاتورة للنظام الوطني:', e);
          enqueueSnackbar('خطأ أثناء إرسال الفاتورة للنظام الوطني', {
            variant: 'warning',
          });
        }
      }
      reset();
      enqueueSnackbar(t('created successfully'));

      if (invoice?.data?.receiptPayment?._id) {
        window.open(
          paths.unitservice.accounting.reciepts.info(invoice?.data?.receiptPayment?._id),
          '_blank'
        );
      }

      await router.push(
        paths.unitservice.accounting.economicmovements.info(invoice?.data?.movement._id)
      );
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        { variant: 'error' }
      );
    } finally {
      loadingSend.onFalse();
    }
  });

  return (
    <>
      <Container maxWidth="xl">
        <FormProvider methods={methods}>
          <Card>
            <InvoiceNewEditAddress />

            {watch().detailedTaxes ? <InvoiceNewEditTaxDetails /> : <InvoiceNewEditDetails />}
            <InvoiceNewEditStatusDate />

            {watch().status === 'paid' && (
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
              <RHFTextField
                name="concept"
                label={t('concept (Notes are added to the National Jordanian Billing System)')}
              />
            </Stack>
            <Stack sx={{ my: 2, px: 2 }}>
              <RHFCheckbox
                name=""
                checked={isCheckboxChecked}
                onChange={(e) => handleInvoicingChange(e.target.checked)}
                label={t(
                  'Do you want to register the invoice in the national Jordanian billing system?'
                )}
              />
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
              loading={loadingSend.value}
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
      {/* billing system information dialog */}
      {dialog.value && (
        <Dialog fullWidth maxWidth="sm" open={dialog.value} onClose={handleDialogClose}>
          <DialogTitle>{t('Add your national Jordanian billing system information')}</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                label={t('Registration Name')}
                name="RegistrationName"
                fullWidth
                value={formData.RegistrationName || unitData.RegistrationName}
                onChange={handleInputChange}
              />
              <TextField
                label={t('Company ID')}
                name="CompanyID"
                fullWidth
                value={formData.CompanyID || unitData.CompanyID}
                onChange={handleInputChange}
              />
              <TextField
                label={t('Activity Number')}
                name="Activity_Number"
                fullWidth
                value={formData.Activity_Number || unitData.Activity_Number}
                onChange={handleInputChange}
              />
              <TextField
                label={t('Client Id')}
                name="ClientId"
                fullWidth
                value={formData.ClientId || unitData.ClientId}
                onChange={handleInputChange}
              />
              <TextField
                label={t('Secret Key')}
                name="Secret_Key"
                fullWidth
                value={formData.Secret_Key || unitData.Secret_Key}
                onChange={handleInputChange}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={handleDialogClose}>
              {t('Cancel')}
            </Button>

            <LoadingButton variant="contained" onClick={handleUpdateData}>
              {t('Update my data')}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

InvoiceNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
