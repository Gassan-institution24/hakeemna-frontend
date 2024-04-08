import * as Yup from 'yup';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useFindPatient,
  useGetCountries,
  useGetCountryCities,
  useGetEmployeeAppointments,
} from 'src/api';
// import { useAclGuard } from 'src/auth/guard/acl-guard';

// import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
// import UploadOldPatient from '../upload-old-patient';
import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, MenuItem } from '@mui/material';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { AddToGoogleCalendar, AddToIPhoneCalendar } from 'src/utils/calender';

// // import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField, RHFDatePicker, RHFPhoneNumber } from 'src/components/hook-form';

import UploadedOldPatients from '../uploaded-old-patients';
import BookingCustomerReviews from '../booking-customer-reviews';
// ----------------------------------------------------------------------

export default function TableCreateView() {
  // // const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { countriesData } = useGetCountries();

  const router = useRouter();

  const searchParams = useSearchParams();
  const appointment = searchParams.get('appointment');
  const day = searchParams.get('day');

  const [selectedDate, setSelectedDate] = useState(day ? new Date(day) : new Date());
  const [selected, setSelected] = useState(appointment);

  const { appointmentsData, AppointDates, loading } = useGetEmployeeAppointments({
    id: user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
    filters: { startDate: new Date(selectedDate), status: 'available' },
  });

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    sequence_number: Yup.string(),
    name_english: Yup.string(),
    name_arabic: Yup.string(),
    email: Yup.string(),
    identification_num: Yup.string(),
    birth_date: Yup.mixed().nullable(),
    marital_status: Yup.string().nullable(),
    nationality: Yup.string().nullable(),
    country: Yup.string(),
    city: Yup.string(),
    mobile_num1: Yup.string(),
    mobile_num2: Yup.string(),
    gender: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      sequence_number: '',
      name_english: '',
      name_arabic: '',
      email: '',
      identification_num: '',
      birth_date: null,
      marital_status: '',
      nationality: '',
      country: '',
      city: '',
      mobile_num1: '',
      mobile_num2: '',
      gender: '',
    }),
    []
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const { tableData } = useGetCountryCities(values.country);

  const { existPatients } = useFindPatient({
    sequence_number: values.sequence_number,
    name_english: values.name_english,
    name_arabic: values.name_arabic,
    email: values.email.toLowerCase(),
    identification_num: values.identification_num,
    mobile_num1: values.mobile_num1,
    mobile_num2: values.mobile_num2,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axiosInstance.patch(
        endpoints.appointments.patient.createPatientAndBookAppoint(selected),
        data
      );
      const SelectedAppointment = appointmentsData.find((appoint) => appoint._id === selected);
      AddToGoogleCalendar(SelectedAppointment);
      AddToIPhoneCalendar(SelectedAppointment);
      enqueueSnackbar(t('created successfully!'));
      reset();
      router.back();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };
  const sequenceChangeHandler = (event) => {
    const { value } = event.target;
    const newValue = value.replace(/\D/g, '');
    if (newValue.length <= 3) {
      setValue(event.target.name, newValue);
    } else if (newValue.length === 4 && newValue.charAt(3) === '-') {
      setValue(event.target.name, newValue.slice(0, 3));
    } else if (newValue.length === 4 && newValue.charAt(3) !== '-') {
      setValue(event.target.name, `${newValue.slice(0, 3)}-${newValue.slice(3)}`);
    } else {
      setValue(event.target.name, newValue);
    }
  };

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('Book Appointment')}
        links={[
          {
            name: t('dashboard'),
            href: paths.employee.root,
          },
          {
            name: t('appointments'),
            href: paths.employee.appointments.root,
          },
          { name: t('book') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ px: 3, pb: 3 }}>
          {!loading && (
            <BookingCustomerReviews
              selected={selected}
              AppointDates={AppointDates}
              loading={loading}
              setSelected={setSelected}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              list={appointmentsData}
              // sx={{ mt: SPACING }}
            />
          )}
          <Typography
            sx={{ py: 2, fontWeight: 700 }}
            variant="caption"
            color="text.secondary"
            textTransform="uppercase"
          >
            {t('patient information')}
          </Typography>
          <br />
          <br />
          <RHFTextField
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { textAlign: 'center' } }}
            sx={{ width: '200px', mb: 3, textAlign: 'center' }}
            size="small"
            name="sequence_number"
            onChange={sequenceChangeHandler}
            placeholder="001-22"
            label={t('patient-code')}
          />
          <Box
            sx={{ mb: 3 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
          >
            <RHFTextField
              onChange={handleEnglishInputChange}
              name="name_english"
              label={t('patient name in english')}
            />
            <RHFTextField
              onChange={handleArabicInputChange}
              name="name_arabic"
              label={t('patient name in arabic')}
            />
            <RHFTextField type="email" name="email" label={t('email address')} />
            <RHFTextField
              onChange={handleEnglishInputChange}
              name="identification_num"
              label={t('ID number')}
            />
            <RHFPhoneNumber name="mobile_num1" label={t('mobile number')} />
            <RHFPhoneNumber name="mobile_num2" label={t('alternative mobile number')} />
            <RHFDatePicker name="birth_date" label={t('birth date')} />
            <RHFSelect name="nationality" label={t('nationality')}>
              {countriesData.map((option, idx) => (
                <MenuItem lang="ar" key={idx} value={option._id}>
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="country" label={t('country of residence')}>
              {countriesData.map((option, idx) => (
                <MenuItem lang="ar" key={idx} value={option._id}>
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect name="city" label={t('city of residence')}>
              {tableData.map((option, idx) => (
                <MenuItem lang="ar" key={idx} value={option._id}>
                  {curLangAr ? option?.name_arabic : option?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="marital_status" label={t('marital status')}>
              <MenuItem lang="ar" value="single">
                {t('single')}
              </MenuItem>
              <MenuItem lang="ar" value="married">
                {t('married')}
              </MenuItem>
              <MenuItem lang="ar" value="widowed">
                {t('widowed')}
              </MenuItem>
              <MenuItem lang="ar" value="separated">
                {t('separated')}
              </MenuItem>
              <MenuItem lang="ar" value="divorced">
                {t('divorced')}
              </MenuItem>
            </RHFSelect>
            <RHFSelect name="gender" label={t('gender')}>
              <MenuItem lang="ar" value="male">
                {t('male')}
              </MenuItem>
              <MenuItem lang="ar" value="female">
                {t('female')}
              </MenuItem>
            </RHFSelect>
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
              {t('create new patient and book')}
            </LoadingButton>
          </Stack>
          {existPatients.length > 0 && (
            <UploadedOldPatients
              SelectedAppointment={appointmentsData.find((appoint) => appoint._id === selected)}
              selected={selected}
              reset={reset}
              oldPatients={existPatients}
            />
          )}
        </Card>
      </FormProvider>
    </Container>
  );
}
