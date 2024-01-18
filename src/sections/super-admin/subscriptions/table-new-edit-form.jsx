import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetCountries, useGetCities, useGetSpecialties, useGetUSTypes } from 'src/api/tables';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';

import axios from 'axios';
import axiosHandler from 'src/utils/axios-handler';
import { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const { countriesData } = useGetCountries();
  const { unitserviceTypesData } = useGetUSTypes();
  const { tableData } = useGetCities();
  const { specialtiesData } = useGetSpecialties();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    US_type: Yup.string().nullable(),
    unit_service: Yup.string().nullable(),
    cost_in_usd: Yup.number(),
    package_appointment: Yup.boolean(),
    package_accounting: Yup.boolean(),
    package_docotor_report: Yup.boolean(),
    package_final_reporting: Yup.boolean(),
    package_old_files_Management: Yup.boolean(),
    package_TAX_Income_reporting: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      country: currentTable?.country?._id || null,
      city: currentTable?.city?._id || null,
      US_type: currentTable?.US_type?._id || null,
      unit_service: currentTable?.unit_service?._id || null,
      cost_in_usd: currentTable?.cost_in_usd || 0,
      package_appointment: currentTable?.package_appointment || false,
      package_accounting: currentTable?.package_accounting || false,
      package_docotor_report: currentTable?.package_docotor_report || false,
      package_final_reporting: currentTable?.package_final_reporting || false,
      package_old_files_Management: currentTable?.package_old_files_Management || false,
      package_TAX_Income_reporting: currentTable?.package_TAX_Income_reporting || false,
    }),
    [currentTable]
  );
  console.log('currrrent', currentTable);
  console.log(defaultValues);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

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
    const address = await axios.get('https://geolocation-db.com/json/');
    try {
      console.log('data', data);
      // const modifiedData = {
      //   ...data,
      //   package_appointment: Boolean(data.package_appointment),
      //   package_accounting: Boolean(data.package_accounting),
      //   package_docotor_report: Boolean(data.package_docotor_report),
      //   package_final_reporting: Boolean(data.package_final_reporting),
      //   package_old_files_Management: Boolean(data.package_old_files_Management),
      //   package_TAX_Income_reporting: Boolean(data.package_TAX_Income_reporting),
      // };
      // console.log("modifiedData",data)
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: endpoints.tables.subscription(currentTable._id),
          data: {
            modifications_nums: (currentTable.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        });
      } else {
        await axiosHandler({
          method: 'POST',
          path: endpoints.tables.subscriptions,
          data: { ip_address_user_creation: address.data.IPv4, user_creation: user._id, ...data },
        });
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      router.push(paths.superadmin.subscriptions.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
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
                lang="en"
                onChange={handleEnglishInputChange}
                name="name_english"
                label="name english"
              />
              <RHFTextField
                lang="ar"
                onChange={handleArabicInputChange}
                name="name_arabic"
                label="name arabic"
              />

              <RHFSelect name="country" label="Country">
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="city" label="city">
                {tableData.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="US_type" label="US_type">
                {unitserviceTypesData.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="unit_service" label="Unit Service">
                {specialtiesData.map((unit_service) => (
                  <MenuItem key={unit_service._id} value={unit_service._id}>
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
              <RHFTextField type="number" name="cost_in_usd" label="Cost in USD" />
            </Box>
            <Typography marginTop={{ xs: 1, sm: 3 }} variant="subtitle2">
              Packages
            </Typography>
            <Box
              rowGap={1}
              columnGap={1}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
              placeItems="center"
              paddingLeft={{ xs: 1, sm: 4 }}
              marginTop={{ sm: 1 }}
            >
              <FormControlLabel
                name="package_appointment"
                control={<Checkbox defaultChecked={defaultValues.package_appointment} />}
                onChange={(event) => methods.setValue('package_appointment', event.target.checked)}
                label="Appointments"
              />
              <FormControlLabel
                name="package_accounting"
                control={<Checkbox defaultChecked={defaultValues.package_accounting} />}
                onChange={(event) => methods.setValue('package_accounting', event.target.checked)}
                label="Accounting"
              />
              <FormControlLabel
                name="package_docotor_report"
                control={<Checkbox defaultChecked={defaultValues.package_docotor_report} />}
                onChange={(event) =>
                  methods.setValue('package_docotor_report', event.target.checked)
                }
                label="Docotor Report"
              />
              <FormControlLabel
                name="package_final_reporting"
                control={<Checkbox defaultChecked={defaultValues.package_final_reporting} />}
                onChange={(event) =>
                  methods.setValue('package_final_reporting', event.target.checked)
                }
                label="Final Reporting"
              />
              <FormControlLabel
                name="package_old_files_Management"
                control={<Checkbox defaultChecked={defaultValues.package_old_files_Management} />}
                onChange={(event) =>
                  methods.setValue('package_old_files_Management', event.target.checked)
                }
                label="Old Files Management"
              />
              <FormControlLabel
                name="package_TAX_Income_reporting"
                control={<Checkbox defaultChecked={defaultValues.package_TAX_Income_reporting} />}
                onChange={(event) =>
                  methods.setValue('package_TAX_Income_reporting', event.target.checked)
                }
                label="Package TAX Income Reporting"
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
