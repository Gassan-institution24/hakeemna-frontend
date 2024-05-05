import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';

import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { MobileTimePicker } from '@mui/x-date-pickers';
import OutlinedInput from '@mui/material/OutlinedInput';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useFindPatient,
  useGetCountries,
  useGetCountryCities,
  useGetUSAppointments,
  useGetEmployeeActiveWorkGroups,
} from 'src/api';
// import { useAclGuard } from 'src/auth/guard/acl-guard';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import UploadOldPatient from '../upload-old-patient';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, MenuItem, IconButton } from '@mui/material';

import { useSearchParams } from 'src/routes/hooks';

import { addToCalendar } from 'src/utils/calender';
import { useUnitTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
// import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'src/components/snackbar';
// // import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField, RHFDatePicker, RHFPhoneNumber } from 'src/components/hook-form';

import BookDetails from '../book-details';
import PatientsFound from '../patients-found';
// ----------------------------------------------------------------------
const defaultFilters = {
  status: 'available',
  work_group: null,
  startTime: null,
  endTime: null,
};
export default function TableCreateView() {
  // // const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { countriesData } = useGetCountries();

  const { myunitTime } = useUnitTime();

  // const router = useRouter();

  const [filters, setFilters] = useState(defaultFilters);

  const canReset = !isEqual(filters, defaultFilters);

  const searchParams = useSearchParams();
  const appointment = searchParams.get('appointment');
  const day = searchParams.get('day');

  const [selectedDate, setSelectedDate] = useState(day ? new Date(day) : new Date());

  const { appointmentsData, AppointDates, loading, refetch } = useGetUSAppointments({
    id: user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id,
    filters: { ...filters, startDate: selectedDate },
  });

  useEffect(() => {
    if (!loading && !appointmentsData.length && AppointDates.length) {
      setSelectedDate(AppointDates[0]);
    }
  }, [loading, appointmentsData.length, AppointDates]);

  const [selected, setSelected] = useState(appointment);

  const { workGroupsData } = useGetEmployeeActiveWorkGroups(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    sequence_number: Yup.string(),
    name_english: Yup.string(),
    name_arabic: Yup.string(),
    email: Yup.string(),
    identification_num: Yup.string(),
    birth_date: Yup.mixed().nullable(),
    marital_status: Yup.string().nullable(),
    nationality: Yup.string().required(t('required field')),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    mobile_num1: Yup.string(),
    mobile_num2: Yup.string(),
    gender: Yup.string(),
    note: Yup.string(),
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
      nationality: null,
      country: null,
      city: null,
      mobile_num1: '',
      mobile_num2: '',
      gender: '',
      note: '',
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
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

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
      await addToCalendar(SelectedAppointment);
      enqueueSnackbar(t('created successfully!'));
      reset();
      // router.back();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      refetch();
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
    } else if (newValue.length >= 4 && newValue.charAt(3) === '-') {
      setValue(event.target.name, newValue.slice(0, 3));
    } else if (newValue.length >= 4 && newValue.charAt(3) !== '-') {
      setValue(event.target.name, `${newValue.slice(0, 3)}-${newValue.slice(3)}`);
    } else {
      setValue(event.target.name, newValue);
    }
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

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
          <Box
            sx={{ m: 3 }}
            rowGap={3}
            columnGap={2}
            display="flex"
          // gridTemplateColumns={{
          //   xs: 'repeat(1, 1fr)',
          //   sm: 'repeat(3, 1fr)',
          // }}
          >
            <FormControl
              sx={{
                width: { xs: 1, md: 200 },
              }}
            >
              <InputLabel shrink>{`${t('work group')}`}</InputLabel>

              <Select
                value={filters.group}
                onChange={(event) => setFilters((prev) => ({ ...prev, group: event.target.value }))}
                size="small"
                input={<OutlinedInput label={t('work group')} />}
              // renderValue={(selected) =>
              //   selected
              // }
              // MenuProps={{
              //   PaperProps: {
              //     sx: { maxHeight: 240 },
              //   },
              // }}
              >
                {workGroupsData.map((option, idx) => (
                  <MenuItem lang="ar" key={idx} value={option._id}>
                    {curLangAr ? option?.name_arabic : option?.name_english}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <MobileTimePicker
              // ampmInClock
              closeOnSelect
              slots={{
                // toolbar:false,
                actionBar: 'cancel'
              }}
              minutesStep="5"
              label={t('from time')}
              value={myunitTime(filters.startTime)}
              onChange={(newValue) => {
                const selectedTime = myunitTime(newValue);
                setFilters((prev) => ({ ...prev, startTime: selectedTime }));
              }}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              sx={{
                width: { xs: 1, md: 200 },
              }}
            />

            <MobileTimePicker
              // ampmInClock
              closeOnSelect
              slots={{
                // toolbar:false,
                actionBar: 'cancel'
              }}
              minutesStep="5"
              label={t('to time')}
              value={myunitTime(filters.endTime)}
              onChange={(newValue) => {
                const selectedTime = myunitTime(newValue);
                setFilters((prev) => ({ ...prev, endTime: selectedTime }));
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                },
              }}
              sx={{
                width: { xs: 1, md: 200 },
              }}
            />

            {canReset && (
              <IconButton sx={{ color: 'error.main' }} onClick={handleResetFilters}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            )}
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {!loading && (
            <BookDetails
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
          <RHFTextField multiline rows={2} name="note" label={t('note')} />

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
              {t('create new patient and book')}
            </LoadingButton>
          </Stack>
          {existPatients.length > 0 && (
            <PatientsFound
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
