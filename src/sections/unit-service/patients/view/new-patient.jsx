import * as Yup from 'yup';

import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useFindPatient,
  useGetCountries,
  useGetCountryCities,
  useGetAppointmentTypes,
  useGetUSActiveWorkGroups,
  useGetUSActiveWorkShifts,
  useGetUSActiveServiceTypes,
} from 'src/api';
// import { useAclGuard } from 'src/auth/guard/acl-guard';

import { useForm } from 'react-hook-form';
// import UploadOldPatient from '../upload-old-patient';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, MenuItem } from '@mui/material';

import { useNewScreen } from 'src/hooks/use-new-screen';

import { addToCalendar } from 'src/utils/calender';
import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
// import { LoadingScreen } from 'src/components/loading-screen';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
// // import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import {
  RHFSelect,
  RHFTextField,
  RHFDatePicker,
  RHFPhoneNumber,
  RHFMultiSelect,
} from 'src/components/hook-form';

import PatientsFound from '../patients-found';
// ----------------------------------------------------------------------

export default function TableCreateView() {
  // // const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  // const { myunitTime } = useUnitTime();
  const { handleAddNew } = useNewScreen();

  const { appointmenttypesData, loading: typesLoading } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );
  const { workGroupsData, loading: wgLoading } = useGetUSActiveWorkGroups(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { workShiftsData } = useGetUSActiveWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  // const router = useRouter();

  // const [filters, setFilters] = useState(defaultFilters);

  // const canReset = !isEqual(filters, defaultFilters);

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
    work_shift: Yup.string().required(t('required field')),
    work_group: Yup.string().required(t('required field')),
    service_types: Yup.array(),
    appointment_type: Yup.string().required(t('required field')),
    start_time: Yup.date().required(t('required field')),
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
      country:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
          .country._id,
      city: user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
        .city._id,
      mobile_num1: '',
      mobile_num2: '',
      gender: '',
      note: '',
      appointment_type: appointmenttypesData?.[0]?._id,
      start_time: new Date(),
      work_group: workGroupsData?.[0]?._id,
      work_shift: workShiftsData.filter((one) => {
        const currentDate = new Date();

        const startTime = new Date(currentDate);
        startTime.setHours(
          new Date(one.start_time).getHours(),
          new Date(one.start_time).getMinutes(),
          0,
          0
        );

        const endTime = new Date(currentDate);
        endTime.setHours(
          new Date(one.end_time).getHours(),
          new Date(one.end_time).getMinutes(),
          0,
          0
        );

        if (startTime <= endTime) {
          return currentDate >= startTime && currentDate < endTime;
        }
        // If the shift crosses midnight
        const endTimeNextDay = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
        return currentDate >= startTime || currentDate < endTimeNextDay;
      })?.[0]?._id,
      service_types: [],
    }),
    [workGroupsData, appointmenttypesData, user?.employee, workShiftsData]
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
  const { tableData } = useGetCountryCities(values.country, { select: 'name_english name_arabic' });

  const { existPatients } = useFindPatient({
    sequence_number: values.sequence_number,
    name_english: values.name_english,
    name_arabic: values.name_arabic,
    email: values.email.toLowerCase(),
    identification_num: values.identification_num,
    mobile_num1: values.mobile_num1,
    mobile_num2: values.mobile_num2,
  });

  const createAppointment = async () => {
    const appoint = await axiosInstance.post(endpoints.appointments.all, {
      appointment_type: values.appointment_type,
      start_time: new Date(),
      work_group: values.work_group,
      work_shift: values.work_shift,
      service_types: values.service_types,
      emergency: true,
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id,
      department: workGroupsData.filter((item) => item._id === values.work_group)?.[0]?.department
        ?._id,
    });
    return appoint;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { data: appointmentData } = await createAppointment();
      await axiosInstance.patch(
        endpoints.appointments.patient.createPatientAndBookAppoint(appointmentData?._id),
        { ...data, lang: curLangAr }
      );
      await addToCalendar(appointmentData);
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
      // refetch();
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

  // const handleResetFilters = useCallback(() => {
  //     setFilters(defaultFilters);
  // }, []);

  // if (loading) {
  //     return <LoadingScreen />;
  // }
  useEffect(() => {
    reset({
      sequence_number: '',
      name_english: '',
      name_arabic: '',
      email: '',
      identification_num: '',
      birth_date: null,
      marital_status: '',
      nationality: null,
      country:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
          .country._id,
      city: user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
        .city._id,
      mobile_num1: '',
      mobile_num2: '',
      gender: '',
      note: '',
      appointment_type: appointmenttypesData?.[0]?._id,
      start_time: new Date(),
      work_group: workGroupsData?.[0]?._id,
      work_shift: workShiftsData.filter((one) => {
        const currentDate = new Date();

        const startTime = new Date(currentDate);
        startTime.setHours(
          new Date(one.start_time).getHours(),
          new Date(one.start_time).getMinutes(),
          0,
          0
        );

        const endTime = new Date(currentDate);
        endTime.setHours(
          new Date(one.end_time).getHours(),
          new Date(one.end_time).getMinutes(),
          0,
          0
        );

        if (startTime <= endTime) {
          return currentDate >= startTime && currentDate < endTime;
        }
        // If the shift crosses midnight
        const endTimeNextDay = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
        return currentDate >= startTime || currentDate < endTimeNextDay;
      })?.[0]?._id,
      service_types: [],
    });
    // eslint-disable-next-line
  }, [
    workGroupsData,
    appointmenttypesData,
    user?.employee,
    typesLoading,
    wgLoading,
    workShiftsData,
  ]);

  if (
    (!values.appointment_type || !values.work_group) &&
    appointmenttypesData.length &&
    workGroupsData.length
  ) {
    return <LoadingScreen />;
  }
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('new patient')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('patients'),
            href: paths.unitservice.patients.all,
          },
          { name: t('new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ px: 3, pb: 3 }}>
          <Stack spacing={2.5} sx={{ my: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFSelect name="appointment_type" label={t('appointment type')}>
                {appointmenttypesData.map((option, index, idx) => (
                  <MenuItem lang="ar" key={idx} value={option._id}>
                    {curLangAr ? option?.name_arabic : option?.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                name="work_shift"
                label={t('work shift')}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {workShiftsData &&
                  workShiftsData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                <Divider />
                <MenuItem
                  lang="ar"
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    fontWeight: 600,
                    // color: 'error.main',
                  }}
                  onClick={() => handleAddNew(paths.unitservice.tables.workshifts.new)}
                >
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    {t('Add new')}
                  </Typography>
                  <Iconify icon="material-symbols:new-window-sharp" />
                </MenuItem>
              </RHFSelect>
              <RHFSelect name="work_group" label={t('work group')}>
                {workGroupsData.map((option, index, idx) => (
                  <MenuItem lang="ar" key={idx} value={option._id}>
                    {curLangAr ? option?.name_arabic : option?.name_english}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem
                  lang="ar"
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    fontWeight: 600,
                    // color: 'error.main',
                  }}
                  onClick={() => handleAddNew(paths.unitservice.tables.workgroups.new)}
                >
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    {t('Add new')}
                  </Typography>
                  <Iconify icon="material-symbols:new-window-sharp" />
                </MenuItem>
              </RHFSelect>
            </Box>
            <RHFMultiSelect
              checkbox
              name="service_types"
              label={t('service types')}
              options={serviceTypesData}
              path={paths.unitservice.tables.services.new}
            />
          </Stack>
          <Divider />
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
              {t('create new patient and open file')}
            </LoadingButton>
          </Stack>
          {existPatients.length > 0 && (
            <PatientsFound
              createAppointment={createAppointment}
              reset={reset}
              oldPatients={existPatients}
            />
          )}
        </Card>
      </FormProvider>
    </Container>
  );
}
