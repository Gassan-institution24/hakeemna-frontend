import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Switch, Container, FormControlLabel } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import FormProvider from 'src/components/hook-form';

import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditAddress from './invoice-new-edit-address';

// ----------------------------------------------------------------------

const cleanData = (data) =>
  Object.fromEntries(
    Object.entries(data)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v && typeof v === 'object' && !Array.isArray(v) ? cleanData(v) : v])
  );

export default function InvoiceNewEditForm({ currentOffer }) {
  const router = useRouter();

  const { t } = useTranslate();

  const { user } = useAuthContext();

  const NewInvoiceSchema = Yup.object().shape({
    products: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          product: Yup.string().required(t('required field')),
          price: Yup.number(),
        })
      )
    ),

    stakeholder: Yup.string().required(t('required field')),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    unit_service_type: Yup.string().nullable(),
    speciality: Yup.string().nullable(),
    unit_service: Yup.string().nullable(),
    age: Yup.string().nullable(),
    gender: Yup.string().nullable(),

    name_english: Yup.string().required(t('required field')),
    name_arabic: Yup.string().required(t('required field')),
    description_english: Yup.string().required(t('required field')),
    description_arabic: Yup.string().required(t('required field')),

    currency: Yup.string().required(t('required field')),
    image: Yup.string().nullable(),
    status: Yup.string(),

    to_patients: Yup.bool(),
    to_unit_service: Yup.bool(),
  });

  const defaultValues = useMemo(
    () => ({
      stakeholder: currentOffer?.stakeholder || user?.stakeholder?._id,
      country: currentOffer?.country || null,
      city: currentOffer?.city || null,
      unit_service_type: currentOffer?.unit_service_type || null,
      speciality: currentOffer?.speciality || null,
      unit_service: currentOffer?.unit_service || null,
      age: currentOffer?.age || null,
      gender: currentOffer?.gender || null,
      name_english: currentOffer?.name_english || '',
      name_arabic: currentOffer?.name_arabic || '',
      description_english: currentOffer?.description_english || '',
      description_arabic: currentOffer?.description_arabic || '',
      currency: currentOffer?.currency || null,
      image: currentOffer?.image || null,
      status: currentOffer?.status || 'published',

      to_patients: currentOffer?.to_patients || false,
      to_unit_service: currentOffer?.to_unit_service || false,

      products: currentOffer?.products || [
        {
          product: null,
          price: 0,
        },
      ],
    }),
    [currentOffer, user]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleSaveAsDraft = handleSubmit(async (data) => {
    try {
      const cleanedData = cleanData(data);
      if (currentOffer) {
        await axiosInstance.patch(endpoints.offers.one(currentOffer._id), cleanedData);
      } else {
        await axiosInstance.post(endpoints.offers.all, { ...cleanedData, status: 'draft' });
      }
      reset();
      router.push(paths.stakeholder.offers.root);
    } catch (error) {
      console.error('errrrrrrrrrrrrrrrr', error);
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    const cleanedData = cleanData(data);
    try {
      await axiosInstance.post(endpoints.offers.all, { ...cleanedData, status: 'published' });
      reset();
      router.push(paths.stakeholder.offers.root);
    } catch (error) {
      console.error('errrrrrrrrrrrrrrrr', error);
    }
  });

  /* eslint-disable */
  useEffect(() => {
    reset({
      stakeholder: currentOffer?.stakeholder || user?.stakeholder?._id,
      country: currentOffer?.country || null,
      city: currentOffer?.city || null,
      unit_service_type: currentOffer?.unit_service_type || null,
      speciality: currentOffer?.speciality || null,
      unit_service: currentOffer?.unit_service || null,
      age: currentOffer?.age || null,
      gender: currentOffer?.gender || null,
      name_english: currentOffer?.name_english || '',
      name_arabic: currentOffer?.name_arabic || '',
      description_english: currentOffer?.description_english || '',
      description_arabic: currentOffer?.description_arabic || '',
      currency: currentOffer?.currency || null,
      image: currentOffer?.image || null,
      status: currentOffer?.status || 'published',

      to_patients: currentOffer?.to_patients || false,
      to_unit_service: currentOffer?.to_unit_service || false,

      products: currentOffer?.products || [
        {
          product: null,
          price: 0,
        },
      ],
    });
  }, [currentOffer]);
  /* eslint-enable */

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card>
          <InvoiceNewEditAddress />

          <InvoiceNewEditDetails />
        </Card>

        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={values.status === 'published'}
                onChange={() =>
                  setValue('status', values.status === 'published' ? 'draft' : 'published')
                }
                defaultChecked
              />
            }
            label="Publish"
            sx={{ flexGrow: 1, pl: 3 }}
          />
          {!currentOffer && (
            <LoadingButton
              color="inherit"
              size="large"
              variant="outlined"
              loading={isSubmitting}
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </LoadingButton>
          )}

          {currentOffer && (
            <LoadingButton
              color="inherit"
              size="large"
              variant="outlined"
              loading={isSubmitting}
              onClick={handleSaveAsDraft}
            >
              Save
            </LoadingButton>
          )}

          {!currentOffer && (
            <LoadingButton
              size="large"
              variant="contained"
              loading={isSubmitting}
              onClick={handleCreateAndSend}
            >
              {currentOffer ? 'Update' : 'Create'} & Send
            </LoadingButton>
          )}
        </Stack>
      </FormProvider>
    </Container>
  );
}

InvoiceNewEditForm.propTypes = {
  currentOffer: PropTypes.object,
};
