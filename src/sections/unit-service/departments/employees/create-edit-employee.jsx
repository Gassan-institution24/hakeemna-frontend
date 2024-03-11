import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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
import { useGetCountries, useGetSpecialties, useGetUSActiveEmployeeTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable, departmentData }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { countriesData } = useGetCountries();
  const { employeeTypesData } = useGetUSActiveEmployeeTypes(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
  const { specialtiesData } = useGetSpecialties();

  const [phone, setPhone] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    // unit_service: Yup.string().required('Unit Service is required'),
    // department: Yup.string(),
    employee_type: Yup.string().required('Employee Type is required'),
    email: Yup.string().required('email is required'),
    first_name: Yup.string().required('First name is required'),
    middle_name: Yup.string(),
    family_name: Yup.string().required('Family name is required'),
    nationality: Yup.string().required('Nationality is required'),
    address: Yup.string(),
    phone: Yup.string().required('phone is required'),
    speciality: Yup.string().required('speciality is required'),
    gender: Yup.string().required('gender is required'),
    birth_date: Yup.string(),
    password: Yup.string().required('password is required'),
    confirmPassword: Yup.string().required('confirmPassword is required'),
  });

  const defaultValues = useMemo(
    () => ({
      // unit_service: currentTable?.unit_service || '',
      // department: currentTable?.department || '',
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
          ?._id || departmentData.unit_service._id,
      department: departmentData._id,
      employee_type: currentTable?.employee_type || '',
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
    [currentTable, departmentData, user?.employee]
  );

  const password = useBoolean();

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  // const handleArabicInputChange = (event) => {
  //   // Validate the input based on Arabic language rules
  //   const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

  //   if (arabicRegex.test(event.target.value)) {
  //     methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
  //   }
  // };

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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // console.log('data', data);

      if (currentTable) {
        await axiosInstance.patch(endpoints.hospitals.one(currentTable._id), {
          role: 'employee',
          ...data,
        });
        socket.emit('created', {
          data,
          user,
          link: paths.unitservice.departments.employees.root(departmentData._id),
          msg: `creating an employee <strong>${data.first_name}</strong> in <strong>${departmentData.name_english}</strong> department`,
        });
      } else {
        await axiosInstance.post(endpoints.auth.register, {
          role: 'employee',
          userName: `${data.first_name} ${data.family_name}`,
          ...data,
        });
        socket.emit('updated', {
          data,
          user,
          link: paths.unitservice.departments.employees.root(departmentData._id),
          msg: `updating an employee <strong>${data.first_name}</strong> in <strong>${departmentData.name_english}</strong> department`,
        });
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      router.push(paths.unitservice.departments.employees.root(departmentData._id));
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
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
                label={t('middle name')}
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
                defaultCountry="JO"
                value={phone}
                onChange={(newPhone) => {
                  matchIsValidTel(newPhone);
                  setPhone(newPhone);
                  methods.setValue('phone', newPhone);
                }}
              />

              <RHFSelect name="nationality" label={`${t('nationality')} *`}>
                {countriesData.map((nationality, idx) => (
                  <MenuItem key={idx} value={nationality._id}>
                    {curLangAr ? nationality.name_arabic : nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="employee_type" label={`${t('employee type')} *`}>
                {employeeTypesData.map((employee_type, idx) => (
                  <MenuItem key={idx} value={employee_type._id}>
                    {curLangAr ? employee_type.name_arabic : employee_type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="speciality" label={`${t('specialty')} *`}>
                {specialtiesData.map((speciality, idx) => (
                  <MenuItem key={idx} value={speciality._id}>
                    {curLangAr ? speciality.name_arabic : speciality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="gender" label={`${t('gender')} *`}>
                <MenuItem value="male">{t('male')}</MenuItem>
                <MenuItem value="female">{t('female')}</MenuItem>
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
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
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
  departmentData: PropTypes.object,
};
