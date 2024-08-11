import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
// import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useFindPatient, useGetCountries, useGetCountryCities } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function BookAppointmentManually({ refetch, appointment, onClose, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  // const { user } = useAuthContext();
  // const { id } = useParams();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    family_name: Yup.string().required('family name is required'),
    identification_num: Yup.string().required('ID is required'),
    birth_date: Yup.date().nullable(),
    marital_status: Yup.string().nullable(),
    nationality: Yup.string().nullable(),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    email: Yup.string().required('Email is required'),
    mobile_num1: Yup.string().required('Mobile number is required'),
    mobile_num2: Yup.string(),
    gender: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: '',
      family_name: '',
      identification_num: '',
      birth_date: null,
      marital_status: null,
      nationality: null,
      country: null,
      city: null,
      email: '',
      mobile_num1: '',
      mobile_num2: '',
      gender: null,
    }),
    []
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const { reset, setValue, watch, handleSubmit } = methods;
  const values = watch();

  const { tableData } = useGetCountryCities(values.country, { select: 'name_english name_arabic' });

  const { existPatients } = useFindPatient({
    email: values.email,
    identification_num: values.identification_num,
    mobile_num1: values.mobile_num1,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data._id) {
        await axios.patch(endpoints.appointments.book(appointment._id), {
          patient: data._id,
          lang: curLangAr,
        });
      } else {
        await axios.patch(
          endpoints.appointments.patient.createPatientAndBookAppoint(appointment._id),
          { ...data, lang: curLangAr }
        );
        socket.emit('register', data);
      }
      enqueueSnackbar(t('created successfully!'));
      refetch();

      onClose();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  function handleFillData(info) {
    reset({
      _id: info._id || null,
      first_name: info.first_name || '',
      family_name: info.family_name || '',
      identification_num: info.identification_num || '',
      birth_date: info.birth_date || '',
      marital_status: info.marital_status || '',
      country: info.country || null,
      city: info.city || null,
      nationality: info.nationality._id || null,
      email: info.email || '',
      mobile_num1: info.mobile_num1 || '',
      mobile_num2: info.mobile_num2 || '',
      gender: info.gender || '',
    });
  }

  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <>
      <Dialog maxWidth="lg" onClose={handleClose} sx={{ width: 'auto' }} {...other}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle sx={{ mb: 1 }}> {t('book manually')} </DialogTitle>
          {existPatients?.map((patient, index, idx) => (
            <Alert key={idx} severity="info" sx={{ width: 1, marginBottom: 2 }}>
              {t('We found a record with similar information for ')}{' '}
              <strong>
                {patient.first_name} {patient.family_name}
              </strong>
              . {t('Is this you?')}
              <br />
              <button
                type="button"
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  color: 'blue',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
                onClick={() => {
                  handleFillData(patient);
                }}
              >
                {t('Click here to fill your data')}
              </button>
            </Alert>
          ))}

          <DialogContent sx={{ overflow: 'unset', width: 'auto' }}>
            <Stack spacing={2.5}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                width="auto"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="first_name" label={t('first name')} />
                <RHFTextField name="family_name" label={t('family name')} />
                <RHFTextField name="email" label={t('email')} />
                <RHFTextField name="identification_num" label={t('ID number')} />
                <RHFTextField type="number" name="mobile_num1" label={t('mobile number')} />
                <RHFTextField
                  type="number"
                  name="mobile_num2"
                  label={t('alternative mobile number')}
                />
                <Controller
                  name="birth_date"
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      // InputLabelProps={{ shrink: true }}
                      label={t('birth date')}
                      // sx={{ width: '30vw', minWidth: '300px' }}
                      onChange={(newValue) => {
                        setValue('birth_date', newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          // margin: 'normal',
                        },
                      }}
                    />
                  )}
                />
                <RHFSelect
                  name="nationality"
                  label={t('nationality')}
                // InputLabelProps={{ shrink: true }}
                >
                  {countriesData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  // onChange={handleCountryChange}
                  name="country"
                  label={t('country')}
                // InputLabelProps={{ shrink: true }}
                >
                  {countriesData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="city"
                  label="City"
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                // InputLabelProps={{ shrink: true }}
                >
                  {tableData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="marital_status"
                  label={t('marital status')}
                // InputLabelProps={{ shrink: true }}
                >
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
                    {t('divorced')}{' '}
                  </MenuItem>
                </RHFSelect>
                <RHFSelect
                  name="gender"
                  label={t('gender')}
                // InputLabelProps={{ shrink: true }}
                >
                  <MenuItem lang="ar" value="male">
                    {t('male')}
                  </MenuItem>
                  <MenuItem lang="ar" value="female">
                    {t('female')}
                  </MenuItem>
                </RHFSelect>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={handleClose}>
              {t('cancel')}
            </Button>

            <Button type="submit" variant="contained">
              {t('add')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      {/*  */}
    </>
  );
}

BookAppointmentManually.propTypes = {
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  appointment: PropTypes.string,
};
