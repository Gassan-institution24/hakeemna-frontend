import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Stack, Dialog, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useDebounce } from 'src/hooks/use-debounce';
import { useNewScreen } from 'src/hooks/use-new-screen';

import { addToCalendar } from 'src/utils/calender';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useFindPatient,
  useGetCountries,
  useFindUSPatient,
  // useGetCountryCities,
  useGetAppointmentTypes,
  useGetUSActiveWorkGroups,
  useGetUSActiveWorkShifts,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';
import {
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFPhoneNumber,
} from 'src/components/hook-form';

import PatientsFound from './patients-found';
// ----------------------------------------------------------------------

export default function NewAppointmentDialog({ open, close, refetch }) {
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  const { handleAddNew } = useNewScreen();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const { workGroupsData } = useGetUSActiveWorkGroups(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { workShiftsData } = useGetUSActiveWorkShifts(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    sequence_number: Yup.string(),
    name_english: Yup.string(),
    name_arabic: Yup.string(),
    nationality: Yup.string().required(t('required field')),
    mobile_num1: Yup.string().required(t('required field')),
    mobile_num2: Yup.string(),
    note: Yup.string(),
    work_shift: Yup.string().required(t('required field')),
    work_group: Yup.string().required(t('required field')),
    service_types: Yup.array(),
    appointment_type: Yup.string().required(t('required field')),
    start_time: Yup.mixed().required(t('required field')),
  });

  const defaultValues = useMemo(
    () => ({
      sequence_number: '',
      name_english: '',
      name_arabic: '',
      nationality: null,
      mobile_num1: '',
      mobile_num2: '',
      note: '',
      appointment_type: appointmenttypesData?.[0]?._id,
      start_time: new Date(),
      work_group: workGroupsData?.[0]?._id,
      unit_service:
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id,
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
    [workGroupsData, appointmenttypesData, workShiftsData, user?.employee]
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

  const createAppointment = async () => {
    const appoint = await axiosInstance.post(endpoints.appointments.all, {
      appointment_type: values.appointment_type,
      start_time: new Date(),
      work_group: values.work_group,
      work_shift: values.work_shift,
      service_types: values.service_types,
      emergency: true,
      unit_service:
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id,
      department: workGroupsData.filter((item) => item._id === values.work_group)?.[0]?.department
        ?._id,
    });
    return appoint;
  };

  const debouncedQuery = useDebounce({
    sequence_number: values.sequence_number,
    name_english: values.name_english,
    name_arabic: values.name_arabic,
    mobile_num1: values.mobile_num1,
    mobile_num2: values.mobile_num2,
    work_group: values.work_group,
    appointment_type: values.appointment_type,
    work_shift: values.work_shift,
  });

  const { existPatients } = useFindPatient({
    ...debouncedQuery,
    select:
      'code name_english name_arabic mobile_num1 mobile_num2 identification_num nationality birth_date',
  });
  const { foundPatients } = useFindUSPatient({
    ...debouncedQuery,
    select:
      'code name_english patient name_arabic mobile_num1 mobile_num2 identification_num nationality birth_date',
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      delete data.sequence_number;
      const { data: appointmentData } = await createAppointment();
      await axiosInstance.patch(
        endpoints.appointments.patient.createPatientAndBookAppoint(appointmentData?._id),
        { ...data, lang: curLangAr }
      );
      await addToCalendar(appointmentData);
      enqueueSnackbar(t('created successfully!'));
      reset();
      close();
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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (
    (!values.appointment_type || !values.work_group) &&
    appointmenttypesData.length &&
    workGroupsData.length
  ) {
    return <LoadingScreen />;
  }
  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={close}>
      <Container maxWidth="xl" sx={{ p: 5 }}>
        <Typography variant="h5">{t('create & book appointment')}</Typography>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={2.5} sx={{ my: 3 }}>
            <Typography variant="subtitle1" color="text.disabled">
              {t('appointment details')}
            </Typography>
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
          </Stack>
          <Divider />
          <br />
          <Typography
            lang="ar"
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
                <RHFPhoneNumber name="mobile_num1" label={t('mobile number')} />
                <RHFPhoneNumber name="mobile_num2" label={t('alternative mobile number')} />
                <RHFSelect name="nationality" label={t('nationality')}>
                  {countriesData.map((option, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
               
              </Box>
              <RHFTextField multiline rows={2} name="note" label={t('note')} />

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
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
              createAppointment={createAppointment}
              reset={reset}
              close={close}
              refetch={refetch}
              oldPatients={existPatients}
            />
          )}
          {foundPatients.length > 0 && values.patientExist === 'my_patients' && (
            <PatientsFound
              createAppointment={createAppointment}
              reset={reset}
              close={close}
              refetch={refetch}
              oldPatients={foundPatients}
              usPatients
            />
          )}
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton tabIndex={-1} variant="contained" onClick={close}>
              {t('cancel')}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </Dialog>
  );
}
NewAppointmentDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  refetch: PropTypes.func,
};
