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
  Alert,
  Button,
  Dialog,
  MenuItem,
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
import { createPriceResolver } from 'src/utils/entrance-service-prices';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatient,
  useGetServiceType,
  useGetUnitservice,
  useGetOneUSPatient,
  useGetUSActiveWorkGroups,
  useGetOneEntranceManagement,
} from 'src/api';

import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, {
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
} from 'src/components/hook-form';

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
  // Opened from Invoicing → "New invoice": a standalone invoice with no appointment
  // or entrance, which must still name the work group allowed to see it.
  const standalone = searchParams.get('manual') === '1' && !appointment && !entrance;
  const { user } = useAuthContext();
  const userUnitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { Entrance } = useGetOneEntranceManagement(entrance);
  const [entranceInfo, setEntranceInfo] = useState();
  const { data: PatientData } = useGetPatient(Entrance?.patient);
  // Without an entrance the invoice belongs to the user's own clinic.
  const { data: unitData } = useGetUnitservice(
    Entrance?.service_unit || (!entrance ? userUnitServiceId : undefined)
  );
  const { usPatientData } = useGetOneUSPatient(Entrance?.unit_service_patient);
  const [appointmentInfo, setAppointmentInfo] = useState();
  const [invoicing, setInvoicing] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  // Owners and admins may file into any group of the clinic; everyone else only into
  // the groups they belong to (the server enforces the same rule, isScopeBypassed).
  const canUseAnyGroup =
    ['superadmin', 'admin'].includes(user?.role) ||
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.is_owner === true;
  const { workGroupsData: clinicGroups } = useGetUSActiveWorkGroups(
    canUseAnyGroup ? userUnitServiceId : undefined
  );
  const groupOptions = canUseAnyGroup && clinicGroups?.length ? clinicGroups : user?.workGroups || [];
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
    work_group: standalone
      ? Yup.mixed().required(t('required field'))
      : Yup.mixed().nullable(),
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
    concept: Yup.string(),
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
      // Decides who can see this invoice afterwards (utils/queryScope.js on the server).
      // The server re-derives it from the appointment or entrance and ignores whatever is sent
      // when one of those is present, so this only ever matters for a manual invoice.
      work_group:
        currentInvoice?.work_group?._id ||
        currentInvoice?.work_group ||
        entranceInfo?.work_group ||
        appointmentInfo?.work_group ||
        (user?.workGroupIds?.length === 1 ? user.workGroupIds[0] : null),
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
          (() => {
            // A price recorded during the visit wins over the catalogue's. A dental treatment
            // added at a price the clinician typed used to be re-priced from the catalogue here,
            // so the figure they entered never reached the bill. Built once per pass because the
            // resolver consumes overrides in order.
            const priceFor = createPriceResolver(entranceInfo?.Service_prices);

            return entranceInfo.Service_types.map((one) => {
              const price = priceFor(one);
              return {
                service_type: one._id || null,
                activity: null,
                quantity: 1,
                price_per_unit: price,
                subtotal: price,
                discount_amount: 0,
                tax: 0,
                total: price,
              };
            });
          })()) || [
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
    [
      currentInvoice,
      user?.employee,
      user?.workGroupIds,
      entrance,
      appointment,
      appointmentInfo,
      entranceInfo,
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
              select: 'Service_types Service_prices patient unit_service_patient work_shift appointment',
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
      const invoice = await axiosInstance.post(
        endpoints.economec_movements.all,
        standalone ? { ...data, require_work_group: true } : data
      );
      const movementId = invoice?.data?.movement?._id;
      const subtotal = data.subtotal || 0;
      const quantity = totalQuantity;
      const concept = data?.concept;
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
        BuyerNum: (PatientData?.mobile_num1 || usPatientData?.mobile_num1 || '').replace(
          /\s+/g,
          ''
        ),
        BuyerIdNum: PatientData?.identification_num || usPatientData?.identification_num,
        BuyerCity: PatientData?.city?.name_arabic || usPatientData?.city?.name_arabic,
        service_type: ServiceTypeData?.name_arabic,
        subtotal,
        quantity,
        discount,
        total,
        concept,
        economicMovementId: movementId,
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

            {/* Only worth asking when the answer is ambiguous. With one group the server defaults
                to it, and with an appointment the server takes the group from there and ignores
                this — but a multi-group accountant raising a manual invoice has to choose, or the
                invoice lands with no owner and disappears from their own list. */}
            {standalone && groupOptions.length === 0 && (
              <Alert severity="warning" sx={{ mx: 3, my: 2 }}>
                {t(
                  'You do not belong to any work group, so you cannot create an invoice. Ask an admin to add you to a work group.'
                )}
              </Alert>
            )}

            {/* A standalone invoice always shows it: the chosen group is who can see it. */}
            {!watch().appointment &&
              !watch().entrance &&
              (standalone ? groupOptions.length > 0 : user?.workGroups?.length > 1) && (
              <Stack sx={{ px: 3, py: 2 }}>
                <RHFSelect name="work_group" label={t('work group')}>
                  {(standalone ? groupOptions : user.workGroups).map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {curLangAr ? group.name_arabic : group.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            )}

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
                    { label: t('Accounts Receivable Invoice'), value: 'accounts_receivable' },
                  ]}
                />
              </Stack>
            )}

            <Stack sx={{ my: 2, px: 2 }}>
              <RHFTextField
                name="concept"
                label={t('Notes (Notes are added to the National Jordanian Billing System)')}
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
