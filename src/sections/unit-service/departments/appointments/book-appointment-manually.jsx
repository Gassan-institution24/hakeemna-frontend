import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';
import { useGetCountries, useGetCities } from 'src/api/tables';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { DatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function AddEmegencyAppointment({ onClose, ...other }) {
  const router = useRouter();
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { id } = useParams();

  const [identification_num, setID] = useState();
  const [mobile_num1, setPhoneNumber] = useState();
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [existPatients, setExistPatients] = useState([]);

  const { countriesData } = useGetCountries();
  const { tableData } = useGetCities();

  const NewUserSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    identification_num: Yup.string().required('ID is required'),
    birth_date: Yup.date().required('Birth date is required'),
    marital_status: Yup.string(),
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
      last_name: '',
      identification_num: '',
      birth_date: null,
      marital_status: '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data', data);
      await axios.post(endpoints.tables.appointments, {
        ...data,
        emergency: true,
        unit_service: user.unit_service._id,
      });
      reset();
      enqueueSnackbar('Create success!');
      console.info('DATA', data);
      onClose();
    } catch (error) {
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
    setExistPatients([])

    async function getExistPatients() {

      if (identification_num) {
        const {data} = await axios.post(endpoints.tables.findPatients, { identification_num });
        console.log('data', data);
        if (data && data.length) {
          console.log('data', data);
          setExistPatients((prev) => [...prev, ...data]);
        }
      } 
       if (mobile_num1) {
        const {data} = await axios.post(endpoints.tables.findPatients, { mobile_num1 });
        console.log('data', data);
        if (data && data.length) {
          console.log('data', data);
          setExistPatients((prev) => [...prev, ...data]);
        }
      }

    }
    getExistPatients();
  }, [identification_num, mobile_num1]);
  console.log('existPatients', existPatients);
  return (
    <>
      <Dialog maxWidth="lg" onClose={onClose} {...other}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle sx={{ mb: 1 }}> Book Manually </DialogTitle>
        {existPatients?.map((patient)=>(
          <Alert key={patient._id} severity='info' onClose={() => {}} sx={{ width: 1 }}>
          there is a patient with similar info with name {patient.first_name} {patient.last_name}, Is this you?
        </Alert>
        ))}

          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack spacing={2.5}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="first_name" label="First name" />
                <RHFTextField name="last_name" label="Last name" />
                <RHFTextField
                  onChange={(e) => {
                    setValue('identification_num', e.target.value);
                    setID(e.target.value);
                  }}
                  name="identification_num"
                  label="ID number"
                />
                <RHFTextField
                  onChange={(e) => {
                    setValue('mobile_num1', e.target.value);
                    setPhoneNumber(e.target.value);
                  }}
                  name="mobile_num1"
                  label="Mobile number"
                />
                <RHFTextField name="mobile_num2" label="Additional mobile number" />
                <Controller
                  name="birth_date"
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
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
                <RHFSelect native name="nationality" label="Nationality">
                  <option>{null}</option>
                  {countriesData.map((option) => (
                    <option value={option._id}>{option.name_english}</option>
                  ))}
                </RHFSelect>
                <RHFSelect native onChange={handleCountryChange} name="country" label="Country">
                  <option>{null}</option>
                  {countriesData.map((option) => (
                    <option value={option._id}>{option.name_english}</option>
                  ))}
                </RHFSelect>
                <RHFSelect
                  native
                  name="city"
                  label="City"
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  <option value={null}> </option>
                  {cities.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name_english}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect native name="marital_status" label="Marital status">
                  <option>{null}</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                  <option value="divorced">Divorced </option>
                </RHFSelect>
                <RHFSelect native name="gender" label="Gender">
                  <option>{null}</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </RHFSelect>
              </Box>

              <Stack
                direction="row"
                alignItems="center"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
                Your transaction is secured with SSL encryption
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
      >
        Three-digit number on the back of your VISA card
      </CustomPopover>
    </>
  );
}

AddEmegencyAppointment.propTypes = {
  onClose: PropTypes.func,
};
