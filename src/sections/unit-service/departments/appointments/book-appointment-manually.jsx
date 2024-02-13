import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
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

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { socket } from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetCities, useGetCountries } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import { usePopover } from 'src/components/custom-popover';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AddEmegencyAppointment({ refetch, appointment, onClose, ...other }) {
  const router = useRouter();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { id } = useParams();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [email, setEmail] = useState();
  const [identification_num, setID] = useState();
  const [mobile_num1, setPhoneNumber] = useState();
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [existPatients, setExistPatients] = useState([]);

  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    family_name: Yup.string().required('family name is required'),
    identification_num: Yup.string().required('ID is required'),
    birth_date: Yup.date().nullable(),
    marital_status: Yup.string(),
    nationality: Yup.string().nullable(),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    email: Yup.string().required('Email is required'),
    mobile_num1: Yup.string().required('Mobile number is required'),
    mobile_num2: Yup.string(),
    gender: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      first_name: '',
      family_name: '',
      identification_num: '',
      birth_date: null,
      marital_status: '',
      nationality: null,
      country: null,
      city: null,
      email: '',
      mobile_num1: '',
      mobile_num2: '',
      gender: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data._id) {
        await axios.patch(endpoints.tables.appointment(appointment._id), {
          patient: data._id,
        });
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.appointments(appointment.department._id),
          msg: `booked an appointment ${appointment.code} in department <strong>${appointment.department.name_english}</strong>`,
        });
      } else {
        await axios.patch(endpoints.tables.createPatientAndBookAppoint(appointment._id), data);
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.appointments(appointment.department._id),
          msg: `booked an appointment ${appointment.code} in department <strong>${appointment.department.name_english}</strong>`,
        });
        socket.emit('register', data);
      }
      enqueueSnackbar('Create success!');
      refetch();
      console.info('DATA', data);
      onClose();
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.href });
      enqueueSnackbar(`Please try again later!: ${error}`, { variant: 'error' });
      console.error(error);
    }
  });

  const handleCountryChange = (event) => {
    const selectedCountryId = event.target.value;
    methods.setValue('country', selectedCountryId, { shouldValidate: true });
    setSelectedCountry(selectedCountryId);
    // setCities(tableData.filter((data)=>data?.country?._id === event.target.value))
  };

  useEffect(() => {
    setCities(
      selectedCountry
        ? tableData.filter((data) => data?.country?._id === selectedCountry)
        : tableData
    );
  }, [tableData, selectedCountry]);
  useEffect(() => {
    async function getExistPatients() {
      const results = [];
      if (email) {
        const { data } = await axios.post(endpoints.tables.findPatients, { email });
        if (data && data.length) {
          results.push(...data);
        }
      }
      if (identification_num) {
        const { data } = await axios.post(endpoints.tables.findPatients, { identification_num });
        if (data && data.length) {
          results.push(...data);
        }
      }
      if (mobile_num1) {
        const { data } = await axios.post(endpoints.tables.findPatients, { mobile_num1 });
        if (data && data.length) {
          results.push(...data);
        }
      }
      setExistPatients(results);
    }
    getExistPatients();
  }, [identification_num, mobile_num1, email]);

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
  return (
    <>
      <Dialog maxWidth="lg" onClose={onClose} sx={{ width: 'auto' }} {...other}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle sx={{ mb: 1 }}> Book Manually </DialogTitle>
          {existPatients?.map((patient, index) => (
            <Alert
              key={patient._id}
              severity="info"
              onClose={() => {
                setExistPatients(existPatients.filter((info) => info !== patient));
              }}
              sx={{ width: 1, marginBottom: 2 }}
            >
              We found a record with similar information for{' '}
              <strong>
                {patient.first_name} {patient.family_name}
              </strong>
              . Is this you?
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
                  setExistPatients([]);
                }}
              >
                Click here to fill your data
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
                <RHFTextField lang="ar" name="first_name" label={t('first name')} />
                <RHFTextField lang="ar" name="family_name" label="family name" />
                <RHFTextField
                  lang="ar"
                  onChange={(e) => {
                    setValue('email', e.target.value);
                    setEmail(e.target.value);
                  }}
                  name="email"
                  label={t('email')}
                />
                <RHFTextField
                  lang="ar"
                  onChange={(e) => {
                    setValue('identification_num', e.target.value);
                    setID(e.target.value);
                  }}
                  name="identification_num"
                  label={t('ID number')}
                />
                <RHFTextField
                  lang="ar"
                  type="number"
                  onChange={(e) => {
                    setValue('mobile_num1', e.target.value);
                    setPhoneNumber(e.target.value);
                  }}
                  name="mobile_num1"
                  label="Mobile number"
                />
                <RHFTextField
                  lang="ar"
                  type="number"
                  name="mobile_num2"
                  label="Additional mobile number"
                />
                <Controller
                  name="birth_date"
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      InputLabelProps={{ shrink: true }}
                      label="Birth date"
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
                  native
                  name="nationality"
                  label={t('nationality')}
                  InputLabelProps={{ shrink: true }}
                >
                  {countriesData.map((option) => (
                    <MenuItem value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  native
                  onChange={handleCountryChange}
                  name="country"
                  label="Country"
                  InputLabelProps={{ shrink: true }}
                >
                  {countriesData.map((option) => (
                    <MenuItem value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  native
                  name="city"
                  label="City"
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                  InputLabelProps={{ shrink: true }}
                >
                  {cities.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  native
                  name="marital_status"
                  label="Marital status"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                  <MenuItem value="separated">Separated</MenuItem>
                  <MenuItem value="divorced">Divorced </MenuItem>
                </RHFSelect>
                <RHFSelect name="gender" label={t('gender')} InputLabelProps={{ shrink: true }}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </RHFSelect>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
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

AddEmegencyAppointment.propTypes = {
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  appointment: PropTypes.string,
};
