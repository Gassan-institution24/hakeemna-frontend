import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Tooltip, MenuItem, Typography } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetCountries, useGetSpecialties, useGetEmployeeTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadBox,
  RHFUploadAvatar,
} from 'src/components/hook-form';
// ----------------------------------------------------------------------

export default function AccountGeneral({ employeeData, refetch }) {
  const [phone, setPhone] = useState();
  const [alterPhone, setAlterPhone] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const { countriesData } = useGetCountries();
  const { employeeTypesData } = useGetEmployeeTypes();
  const { specialtiesData } = useGetSpecialties();

  const { user } = useAuthContext();

  const { t } = useTranslate();

  // console.log('employeeData', employeeData);

  const UpdateUserSchema = Yup.object().shape({
    employee_type: Yup.string().required('Employee type is required.'),
    email: Yup.string().required('Email is required.'),
    first_name: Yup.string().required('First name is required.'),
    middle_name: Yup.string(),
    family_name: Yup.string().required('Family name is required.'),
    nationality: Yup.string().required('Nationality is required.'),
    profrssion_practice_num: Yup.string().required('Profrssion practice number is required.'),
    identification_num: Yup.string().required('ID number is required.'),
    tax_num: Yup.string(),
    phone: Yup.string().required('Phone number is required'),
    mobile_num: Yup.string(),
    speciality: Yup.string().required('speciality'),
    gender: Yup.string().required('gender'),
    birth_date: Yup.date().required('birth_date'),
    Bachelor_year_graduation: Yup.number(),
    University_graduation_Bachelor: Yup.string(),
    University_graduation_Specialty: Yup.string(),
    scanned_identity: Yup.mixed().nullable(),
    signature: Yup.mixed().nullable(),
    stamp: Yup.mixed().nullable(),
    picture: Yup.mixed().nullable(),
  });

  const defaultValues = {
    employee_type: employeeData?.employee_type?._id || null,
    email: employeeData?.email || '',
    first_name: employeeData?.first_name || '',
    middle_name: employeeData?.middle_name || '',
    family_name: employeeData?.family_name || '',
    nationality: employeeData?.nationality?._id || '',
    profrssion_practice_num: employeeData?.profrssion_practice_num || '',
    identification_num: employeeData?.identification_num || '',
    tax_num: employeeData?.tax_num || '',
    phone: employeeData?.phone || '',
    mobile_num: employeeData?.mobile_num || '',
    speciality: employeeData?.speciality?._id || null,
    gender: employeeData?.gender || '',
    birth_date: employeeData?.birth_date || null,
    Bachelor_year_graduation: employeeData?.Bachelor_year_graduation || '',
    University_graduation_Bachelor: employeeData?.University_graduation_Bachelor || '',
    University_graduation_Specialty: employeeData?.University_graduation_Specialty || '',
    scanned_identity: employeeData?.scanned_identity || null,
    signature: employeeData?.signature || null,
    stamp: employeeData?.stamp || null,
    picture: employeeData?.picture || null,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = getValues();

  const handleDrop = useCallback(
    (name, acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(name, newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      // console.log('data', data);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== defaultValues[key]) {
          formData.append(key, data[key]);
        }
      });

      // console.log('formData', formData);
      await axios.patch(endpoints.tables.employee(employeeData._id), formData);
      enqueueSnackbar('Update success!');
      refetch();
      console.info('DATA', data);
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.href });
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error(error);
    }
  });

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* img */}
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 5, height: { md: '100%' }, pb: { xs: 5 }, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              // helperText={
              //   <Typography
              //     variant="caption"
              //     sx={{
              //       mt: 3,
              //       mx: 'auto',
              //       display: 'block',
              //       textAlign: 'center',
              //       color: 'text.disabled',
              //     }}
              //   >
              //     max size of {fData(3145728)}
              //   </Typography>
              // }
              maxSize={3145728}
              name="picture"
              onDrop={(acceptedFiles) => handleDrop('picture', acceptedFiles)}
            />
            <Box
              rowGap={3}
              columnGap={2}
              sx={{ mt: 5 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                lang="ar"
                // disabled
                variant="filled"
                name="identification_num"
                label={`${t('ID number')} :`}
              />
              <RHFTextField
                lang="ar"
                // disabled
                variant="filled"
                name="profrssion_practice_num"
                label={`${t('profrssion practice number')} :`}
              />
              <RHFTextField
                lang="ar"
                type="email"
                variant="filled"
                name="email"
                label={`${t('email')} :`}
              />
              <Tooltip placement="top" title="Phone number of service unit">
                <MuiTelInput
                  forceCallingCode
                  variant="filled"
                  label={`${t('phone')}* : `}
                  value={phone}
                  onChange={(newPhone) => {
                    matchIsValidTel(newPhone);
                    setPhone(newPhone);
                    methods.setValue('phone', newPhone);
                  }}
                />
              </Tooltip>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <Box>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="scanned_identity"
                    label={t('scanned ID')}
                    onDrop={(acceptedFiles) => handleDrop('scanned_identity', acceptedFiles)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('scanned ID')}
                  </Typography>
                  {values.scanned_identity && <Iconify icon="flat-color-icons:ok" />}
                </Box>
                <Box>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="signature"
                    label={t('signature')}
                    onDrop={(acceptedFiles) => handleDrop('signature', acceptedFiles)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('signature')}
                  </Typography>
                  {values.signature && <Iconify icon="flat-color-icons:ok" />}
                </Box>
                <Box>
                  <RHFUploadBox
                    sx={{
                      mx: 'auto',
                    }}
                    name="stamp"
                    label={t('stamp')}
                    onDrop={(acceptedFiles) => handleDrop('stamp', acceptedFiles)}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 'auto',
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {t('stamp')}
                  </Typography>
                  {values.stamp && <Iconify icon="flat-color-icons:ok" />}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3, pt: 5 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField lang="ar" name="first_name" label={`${t('first name')} *`} />
              <RHFTextField lang="ar" name="middle_name" label={t('middle name')} />
              <RHFTextField lang="ar" name="family_name" label={`${t('family name')} *`} />
              <RHFSelect
                label={`${t('nationality')} *`}
                fullWidth
                name="nationality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {countriesData.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField lang="ar" type="number" name="tax_num" label={t('tax number')} />
              <Tooltip placement="top" title="Phone number of service unit">
                <MuiTelInput
                  forceCallingCode
                  label={t('alternative mobile number')}
                  value={alterPhone}
                  onChange={(newPhone) => {
                    matchIsValidTel(newPhone);
                    setAlterPhone(newPhone);
                    methods.setValue('mobile_num', newPhone);
                  }}
                />
              </Tooltip>
              <RHFSelect
                label={`${t('specialty')} *`}
                fullWidth
                name="speciality"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {specialtiesData.map((specialty) => (
                  <MenuItem value={specialty._id} key={specialty._id}>
                    {specialty.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                label={`${t('gender')} *`}
                fullWidth
                name="gender"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                <MenuItem value="male">male</MenuItem>
                <MenuItem value="female">female</MenuItem>
              </RHFSelect>
              <RHFSelect
                label={`${t('employee type')} *`}
                fullWidth
                name="employee_type"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {employeeTypesData.map((type) => (
                  <MenuItem value={type._id} key={type._id}>
                    {type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                lang="ar"
                type="number"
                name="Bachelor_year_graduation"
                label={t('bachelor year graduation')}
              />
              <RHFTextField
                lang="ar"
                name="University_graduation_Bachelor"
                label={t('university graduation bachelor')}
              />
              <RHFTextField
                lang="ar"
                name="University_graduation_Specialty"
                label={t('university graduation specialty')}
              />
              <Controller
                name="birth_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={t('birth date')}
                    // sx={{ flex: 1 }}
                    value={new Date(values.birth_date ? values.birth_date : '')}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>
            <RHFTextField
              lang="ar"
              multiline
              sx={{ mt: 3 }}
              rows={2}
              name="address"
              label={t('address')}
            />

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
AccountGeneral.propTypes = {
  employeeData: PropTypes.object,
  refetch: PropTypes.func,
};
