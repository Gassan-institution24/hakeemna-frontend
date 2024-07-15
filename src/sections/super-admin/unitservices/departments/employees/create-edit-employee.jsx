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
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetCountries, useGetSpecialties, useGetActiveEmployeeTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable, departmentData }) {
  const router = useRouter();

  const { id } = useParams();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { employeeTypesData } = useGetActiveEmployeeTypes();
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });

  const [phone, setPhone] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    // unit_service: Yup.string().required('unit of service is required'),
    // department: Yup.string(),
    employee_type: Yup.string().required('Employee Type is required'),
    email: Yup.string().required('email is required'),
    name_english: Yup.string().required('name is required'),
    name_arabic: Yup.string(),
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
      unit_service: id || departmentData.unit_service._id,
      department: departmentData._id,
      employee_type: currentTable?.employee_type || '',
      email: currentTable?.email || '',
      name_english: currentTable?.name_english || '',
      name_arabic: currentTable?.name_arabic || '',
      nationality: currentTable?.nationality || '',
      address: currentTable?.address || '',
      phone: currentTable?.phone || '079',
      speciality: currentTable?.speciality || '',
      gender: currentTable?.gender || '',
      birth_date: currentTable?.birth_date || '',
      password: currentTable?.password || '',
      confirmPassword: currentTable?.confirmPassword || '',
    }),
    [currentTable, departmentData, id]
  );

  const password = useBoolean();

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

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
      if (currentTable) {
        await axiosInstance.patch(endpoints.hospitals.one(currentTable._id), {
          role: 'employee',
          ...data,
        });
        socket.emit('created', {
          data,
          user,
          link: paths.superadmin.unitservices.departments.employees.root(id, departmentData._id),
          msg: `creating an employee <strong>${data.name_english}</strong> in <strong>${departmentData.name_english}</strong> department`,
          ar_msg: `إضافة موظف <strong>${data.name_arabic}</strong> إلى قسم <strong>${departmentData.name_arabic}</strong>`,
        });
      } else {
        await axiosInstance.post(endpoints.auth.register, {
          role: 'employee',
          userName: data.name_english,
          ...data,
        });
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      router.push(paths.superadmin.unitservices.departments.employees.root(id, departmentData._id));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
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
                onChange={handleEnglishInputChange}
                name="name_english"
                label={`${t('Full name in English')} *`}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={t('Full name in Arabic')}
              />
              <RHFTextField
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
                  <MenuItem lang="ar" key={idx} value={nationality._id}>
                    {curLangAr ? nationality.name_arabic : nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFAutocomplete
                name="employee_type"
                label={t('employee type')}
                options={employeeTypesData.map((one) => one._id)}
                getOptionLabel={(option) =>
                  employeeTypesData.find((one) => one._id === option)?.[
                    curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li {...props} key={idx} value={option}>
                    {
                      employeeTypesData.find((one) => one._id === option)?.[
                        curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              />
              <RHFAutocomplete
                name="speciality"
                label={`${t('speciality')} *`}
                options={specialtiesData.map((speciality) => speciality._id)}
                getOptionLabel={(option) =>
                  specialtiesData.find((one) => one._id === option)?.[
                    curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li {...props} key={idx} value={option}>
                    {
                      specialtiesData.find((one) => one._id === option)?.[
                        curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              />
              <RHFSelect name="gender" label={`${t('gender')} *`}>
                <MenuItem lang="ar" value="male">
                  {t('male')}
                </MenuItem>
                <MenuItem lang="ar" value="female">
                  {t('female')}
                </MenuItem>
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
              <RHFTextField name="email" label={`${t('email')} *`} />
              <RHFTextField
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
