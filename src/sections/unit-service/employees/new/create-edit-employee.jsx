import axios from 'axios';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetSpecialties,
  useGetUSDepartments,
  useGetUSEmployeeTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { countriesData } = useGetCountries();
  const { employeeTypesData } = useGetUSEmployeeTypes(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { specialtiesData } = useGetSpecialties();
  const { departmentsData } = useGetUSDepartments(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState();
  const [errorMsg, setErrorMsg] = useState('');

  const NewUserSchema = Yup.object().shape({
    // unit_service: Yup.string().required('Unit Service is required'),
    department: Yup.string().nullable(),
    employee_type: Yup.string().required('Employee Type is required'),
    email: Yup.string().required('email is required'),
    first_name: Yup.string().required('First name is required'),
    middle_name: Yup.string().required('Middle name is required'),
    family_name: Yup.string().required('Family name is required'),
    nationality: Yup.string().required('Nationality is required'),
    address: Yup.string(),
    phone: Yup.string().required('phone is required'),
    speciality: Yup.string().required('speciality is required'),
    gender: Yup.string().required('gender is required'),
    birth_date: Yup.string(),
    password: Yup.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .min(8, 'Confirm password must be at least 8 characters'),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        currentTable?.unit_service?._id ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department: currentTable?.department?._id || null,
      employee_type: currentTable?.employee_type?._id || null,
      email: currentTable?.email || '',
      first_name: currentTable?.first_name || '',
      middle_name: currentTable?.middle_name || '',
      family_name: currentTable?.family_name || '',
      nationality: currentTable?.nationality || '',
      address: currentTable?.address || '',
      phone: currentTable?.phone || '079',
      speciality: currentTable?.speciality || '',
      gender: currentTable?.gender || '',
      birth_date: currentTable?.birth_date || '',
      password: currentTable?.password || '',
      confirmPassword: currentTable?.confirmPassword || '',
    }),
    [currentTable, user?.employee]
  );

  const password = useBoolean();

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
    trigger,
    formState: { isSubmitting },
  } = methods;

  const values = methods.getValues();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await axios.get('https://geolocation-db.com/json/');
      await axiosInstance.post(endpoints.auth.register, {
        ip_address_user_creation: address.data.IPv4,
        user_creation: user._id,
        role: 'employee',
        userName: `${data.first_name} ${data.family_name}`,
        ...data,
      });
      // await axiosHandler({
      //   method: 'POST',
      //   path: endpoints.auth.register,
      //   data: {
      //     ip_address_user_creation: address.data.IPv4,
      //     user_creation: user._id,
      //     role: 'employee',
      //     userName: `${data.first_name} ${data.family_name}`,
      //     ...data,
      //   },
      // });
      socket.emit('created', {
        data,
        user,
        link: paths.unitservice.employees.root,
        msg: `created an employee <strong>${data.name_english}</strong>`,
      });
      reset();
      router.push(paths.unitservice.employees.root);
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      socket.emit('error', {
        error: typeof error === 'string' ? error : error.message,
        user,
        location: window.location.pathname,
      });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  // useEffect(() => {
  //   trigger();
  // }, [trigger, methods]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            {!!errorMsg && (
              <Alert sx={{ mb: 3 }} severity="error">
                <div dangerouslySetInnerHTML={{ __html: errorMsg }} />
              </Alert>
            )}
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
                lang="ar"
                onChange={handleEnglishInputChange}
                name="first_name"
                label={`${t('first name')} *`}
              />
              <RHFTextField
                lang="ar"
                onChange={handleEnglishInputChange}
                name="middle_name"
                label={`${t('middle name')} *`}
              />
              <RHFTextField
                lang="ar"
                onChange={handleEnglishInputChange}
                name="family_name"
                label={`${t('family name')} *`}
              />
              <RHFTextField
                lang="ar"
                onChange={handleEnglishInputChange}
                name="address"
                label={t('address')}
              />
              <MuiTelInput
                forceCallingCode
                value={phone}
                label={`${t('phone')} *`}
                onChange={(newPhone) => {
                  matchIsValidTel(newPhone);
                  setPhone(newPhone);
                  methods.setValue('phone', newPhone);
                }}
              />

              <RHFSelect name="nationality" label={`${t('nationality')} *`}>
                {countriesData.map((nationality) => (
                  <MenuItem key={nationality._id} value={nationality._id}>
                    {curLangAr ? nationality.name_arabic : nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="department" label={t('department')}>
                {departmentsData.map((department) => (
                  <MenuItem key={department._id} value={department._id}>
                    {curLangAr ? department.name_arabic : department.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="employee_type" label={`${t('employee type')} *`}>
                {employeeTypesData.map((employee_type) => (
                  <MenuItem key={employee_type._id} value={employee_type._id}>
                    {curLangAr ? employee_type.name_arabic : employee_type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="speciality" label={`${t('specialty')} *`}>
                {specialtiesData.map((speciality) => (
                  <MenuItem key={speciality._id} value={speciality._id}>
                    {curLangAr ? speciality.name_arabic : speciality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="gender" label={`${t('gender')} *`}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </RHFSelect>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              mt={3}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField lang="ar" name="email" label={`${t('email')} *`} />
              <RHFTextField
                lang="ar"
                name="password"
                label={`${t('password')} *`}
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                lang="ar"
                name="confirmPassword"
                label={`${t('confirm password')} *`}
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTable ? t('create') : t('save changes')}
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
