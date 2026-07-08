import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Checkbox, MenuItem, Typography, FormControlLabel } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetUnitservices,
  useGetCountryCities,
  useGetActiveUSTypes,
} from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const FEATURE_OPTIONS = [
  { value: 'appointments', label: 'Appointments' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'doctor_reports', label: 'Doctor Reports' },
  { value: 'final_reports', label: 'Final Reports' },
  { value: 'old_files_management', label: 'Old Files Management' },
  { value: 'tax_income_reporting', label: 'Tax Income Reporting' },
  { value: 'claims', label: 'Claims' },
  { value: 'hr', label: 'HR' },
  { value: 'products', label: 'Products' },
  { value: 'quality_control', label: 'Quality Control' },
  { value: 'permissions', label: 'Permissions' },
  { value: 'blogs', label: 'Blogs' },
  { value: 'dental_chart', label: 'Dental Chart' },
];

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();

  const { countriesData } = useGetCountries({ select: 'name_english' });
  const { unitserviceTypesData } = useGetActiveUSTypes();
  const { unitservicesData } = useGetUnitservices();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    US_type: Yup.string().nullable(),
    sector_type: Yup.string().nullable(),
    unit_service: Yup.string().nullable(),
    price_in_usd: Yup.number(),
    features: Yup.array().of(Yup.string()),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      US_type: currentTable?.US_type?._id || null,
      sector_type: currentTable?.sector_type || null,
      unit_service: currentTable?.unit_service?._id || null,
      price_in_usd: currentTable?.price_in_usd || 0,
      period_in_months: currentTable?.period_in_months || 0,
      features: currentTable?.features || [],
    }),
    [currentTable]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { tableData } = useGetCountryCities(methods.watch().country, { select: 'name_english' });

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // const modifiedData = {
      //   ...data,
      //   package_appointment: Boolean(data.package_appointment),
      //   package_accounting: Boolean(data.package_accounting),
      //   package_docotor_report: Boolean(data.package_docotor_report),
      //   package_final_reporting: Boolean(data.package_final_reporting),
      //   package_old_files_Management: Boolean(data.package_old_files_Management),
      //   package_TAX_Income_reporting: Boolean(data.package_TAX_Income_reporting),
      // };
      if (currentTable) {
        await axiosInstance.patch(endpoints.subscriptions.one(currentTable._id), data);
      } else {
        await axiosInstance.post(endpoints.subscriptions.all, data);
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.subscriptions.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                onChange={handleEnglishInputChange}
                name="name_english"
                label="name english"
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label="name arabic"
              />

              <RHFSelect name="sector_type" label="Sector type">
                {['public', 'private', 'non profit organization'].map((type, idx) => (
                  <MenuItem lang="ar" key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="US_type" label="US_type">
                {unitserviceTypesData.map((type, idx) => (
                  <MenuItem lang="ar" key={idx} value={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="country" label={t('country')}>
                {countriesData.map((country, idx) => (
                  <MenuItem lang="ar" key={idx} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="city">
                {tableData.map((city, idx) => (
                  <MenuItem lang="ar" key={idx} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="unit_service" label="unit of service">
                {unitservicesData.map((unit_service, idx) => (
                  <MenuItem lang="ar" key={idx} value={unit_service._id}>
                    {unit_service.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* <DatePicker
                name="offer_date"
                label="offer date"
                onChange={(date) => methods.setValue('offer_date', date, { shouldValidate: true })}
                // Parse the UTC date string to a JavaScript Date object
                value={
                  methods.getValues('offer_date') ? new Date(methods.getValues('offer_date')) : null
                }
              /> */}
              <RHFTextField type="number" name="period_in_months" label="period in months" />
              <RHFTextField type="number" name="price_in_usd" label="Cost in USD" />
            </Box>
            <Typography marginTop={{ xs: 1, sm: 3 }} variant="subtitle2">
              {t('features')}
            </Typography>
            <Box
              rowGap={1}
              columnGap={1}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
              paddingLeft={{ xs: 1, sm: 4 }}
              marginTop={{ sm: 1 }}
            >
              {FEATURE_OPTIONS.map((feature) => {
                const selectedFeatures = methods.watch('features') || [];
                const checked = selectedFeatures.includes(feature.value);
                return (
                  <FormControlLabel
                    key={feature.value}
                    control={<Checkbox checked={checked} />}
                    onChange={(event) => {
                      const current = methods.getValues('features') || [];
                      const next = event.target.checked
                        ? [...current, feature.value]
                        : current.filter((f) => f !== feature.value);
                      methods.setValue('features', next, { shouldValidate: true });
                    }}
                    label={feature.label}
                  />
                );
              })}
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentTable ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
};
