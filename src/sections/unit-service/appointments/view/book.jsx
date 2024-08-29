import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';

import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TimePicker, renderTimeViewClock } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useFindPatient,
  useGetCountries,
  useFindUSPatient,
  useGetUSAppointments,
  useGetEmployeeActiveWorkGroups,
} from 'src/api';
// import { useAclGuard } from 'src/auth/guard/acl-guard';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import UploadOldPatient from '../upload-old-patient';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Button, MenuItem, IconButton } from '@mui/material';

import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { addToCalendar } from 'src/utils/calender';
import { useUnitTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAclGuard } from 'src/auth/guard/acl-guard';
// import useUSTypeGuard from 'src/auth/guard/USType-guard';

import { useDebounce } from 'src/hooks/use-debounce';

import Iconify from 'src/components/iconify';
// import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'src/components/snackbar';
// // import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField, RHFRadioGroup, RHFPhoneNumber } from 'src/components/hook-form';

import BookDetails from '../book-details';
import PatientsFound from '../patients-found';
import AddEmegencyAppointment from '../add-emergency-appointment';

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
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  const { myunitTime } = useUnitTime();
  const addModal = useBoolean();
  const checkAcl = useAclGuard();
  // const { isMedLab } = useUSTypeGuard();

  const [filters, setFilters] = useState(defaultFilters);

  const canReset = !isEqual(filters, defaultFilters);

  const searchParams = useSearchParams();
  const appointment = searchParams.get('appointment');
  const day = searchParams.get('day');

  const [selectedDate, setSelectedDate] = useState(day ? new Date(day) : new Date());

  const { appointmentsData, AppointDates, loading, refetch } = useGetUSAppointments(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id,
    {
      ...filters,
      startDate: selectedDate,
      select: 'start_time',
    }
  );

  useEffect(() => {
    if (!loading && !appointmentsData.length && AppointDates.length) {
      setSelectedDate(AppointDates[0]);
    }
  }, [loading, appointmentsData.length, AppointDates]);

  const [selected, setSelected] = useState(appointment);

  const { workGroupsData } = useGetEmployeeActiveWorkGroups(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    sequence_number: Yup.string(),
    name_english: Yup.string(),
    name_arabic: Yup.string(),
    // email: Yup.string(),
    // identification_num: Yup.string(),
    // birth_date: Yup.mixed().nullable(),
    // marital_status: Yup.string().nullable(),
    nationality: Yup.string().required(t('required field')),
    // country: Yup.string().nullable(),
    // city: Yup.string().nullable(),
    mobile_num1: Yup.string().required(t('required field')),
    mobile_num2: Yup.string(),
    // gender: Yup.string().nullable(),
    note: Yup.string(),
    patientExist: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      sequence_number: '',
      name_english: '',
      name_arabic: '',
      // email: '',
      // identification_num: '',
      // birth_date: null,
      // marital_status: null,
      nationality: null,
      // country: null,
      // city: null,
      mobile_num1: '',
      mobile_num2: '',
      // gender: null,
      note: '',
      patientExist: 'my_patients',
      work_group: workGroupsData?.[0]?._id,
      unit_service:
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id,
    }),
    [user?.employee, workGroupsData]
  );

  const methods = useForm({
    mode: 'all',
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
  // const { tableData } = useGetCountryCities(values.country, { select: 'name_english name_arabic' });

  const debouncedQuery = useDebounce({
    sequence_number: values.sequence_number,
    name_english: values.name_english,
    name_arabic: values.name_arabic,
    // email: values.email.toLowerCase(),
    // identification_num: values.identification_num,
    mobile_num1: values.mobile_num1,
    mobile_num2: values.mobile_num2,
  });

  const { existPatients } = useFindPatient({
    ...debouncedQuery,
    select:
      'code name_english name_arabic mobile_num1 mobile_num2 identification_num nationality birth_date',
  });

  const { foundPatients } = useFindUSPatient({
    ...debouncedQuery,
    select:
      'code name_english name_arabic mobile_num1 mobile_num2 identification_num nationality birth_date',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      delete data.sequence_number;
      await axiosInstance.patch(
        endpoints.appointments.patient.createPatientAndBookAppoint(selected),
        { ...data, lang: curLangAr }
      );
      const SelectedAppointment = appointmentsData.find((appoint) => appoint._id === selected);
      enqueueSnackbar(t('created successfully!'));
      await addToCalendar(SelectedAppointment);
      router.back();
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
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/;

    if (arabicRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;

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

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
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
          action={
            checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'create' }) && (
              <Button
                component={RouterLink}
                onClick={() => addModal.onTrue()}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{
                  bgcolor: 'error.dark',
                  '&:hover': {
                    bgcolor: 'error.main',
                  },
                }}
              >
                {t('new appointment')}
              </Button>
            )
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Card sx={{ px: 3, pb: 3, pt: 2 }}>
            <Typography variant="subtitle2">{t('filters')}:</Typography>
            <Box
              sx={{ mb: 3, mx: 3, mt: 2 }}
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
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, group: event.target.value }))
                  }
                  size="small"
                  input={<OutlinedInput label={t('work group')} />}
                >
                  {workGroupsData.map((option, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TimePicker
                // ampmInClock
                closeOnSelect
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                slots={{
                  actionBar: 'cancel',
                }}
                minutesStep={5}
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

              <TimePicker
                closeOnSelect
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                slots={{
                  actionBar: 'cancel',
                }}
                minutesStep={5}
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
              />
            )}
            {selected && (
              <>
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
                <RHFRadioGroup
                  row
                  name="patientExist"
                  options={[
                    { label: t('my patient'), value: 'my_patients' },
                    // { label: t('hakeemna patient'), value: 'exist' },
                    { label: t('new patient'), value: 'new' },
                  ]}
                />
                <br />
                <br />
                {values.patientExist === 'my_patients' && (
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
                  </Box>
                )}
                {values.patientExist === 'exist' && (
                  <>
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
                    </Box>
                  </>
                )}
                {values.patientExist === 'new' && (
                  <>
                    <Typography sx={{ mb: 2 }} variant="subtitle2" color="info.dark">
                      {t(
                        'if the patient did not exist in our system you are required to add name (arabic or english), nationality and mobile number'
                      )}
                    </Typography>
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
                      {/* <RHFTextField type="email" name="email" label={t('email address')} /> */}
                      {/* <RHFTextField
                        onChange={handleEnglishInputChange}
                        name="identification_num"
                        label={t('ID number')}
                      /> */}
                      <RHFPhoneNumber name="mobile_num1" label={t('mobile number')} />
                      <RHFPhoneNumber name="mobile_num2" label={t('alternative mobile number')} />
                      {/* <RHFDatePicker name="birth_date" label={t('birth date')} /> */}
                      <RHFSelect name="nationality" label={t('nationality')}>
                        {countriesData.map((option, idx) => (
                          <MenuItem lang="ar" key={idx} value={option._id}>
                            {curLangAr ? option?.name_arabic : option?.name_english}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                      {/* <RHFSelect name="country" label={t('country of residence')}>
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
                      </RHFSelect> */}
                    </Box>
                    <RHFTextField multiline rows={2} name="note" label={t('note')} />

                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                      <LoadingButton
                        disabled={!selected}
                        type="submit"
                        tabIndex={-1}
                        variant="contained"
                        loading={isSubmitting}
                      >
                        {t('create new patient and book')}
                      </LoadingButton>
                    </Stack>
                  </>
                )}
                {existPatients.length > 0 && values.patientExist === 'new' && (
                  <PatientsFound
                    SelectedAppointment={appointmentsData.find(
                      (appoint) => appoint._id === selected
                    )}
                    selected={selected}
                    reset={reset}
                    oldPatients={existPatients}
                  />
                )}
                {foundPatients.length > 0 && values.patientExist === 'my_patients' && (
                  <PatientsFound
                    SelectedAppointment={appointmentsData.find(
                      (appoint) => appoint._id === selected
                    )}
                    selected={selected}
                    reset={reset}
                    oldPatients={foundPatients}
                    usPatients
                  />
                )}
              </>
            )}
          </Card>
        </FormProvider>
      </Container>
      <AddEmegencyAppointment refetch={refetch} open={addModal.value} onClose={addModal.onFalse} />
    </>
  );
}
