import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetCountries, useGetSpecialties, useGetActiveEmployeeTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable, departmentData }) {
  const router = useRouter();

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
    // unit_service: Yup.string().required(t('required field')),
    // department: Yup.string(),
    employee_type: Yup.string().required(t('required field')),
    email: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    name_arabic: Yup.string().required(t('required field')),
    nationality: Yup.string().required(t('required field')),
    address: Yup.string(),
    phone: Yup.string().required(t('required field')),
    speciality: Yup.string(),
    gender: Yup.string().required(t('required field')),
    birth_date: Yup.string(),
    visibility_US_page: Yup.bool(),
    visibility_online_appointment: Yup.bool(),
    password: Yup.string().required(t('required field')),
    confirmPassword: Yup.string().required(t('required field')),
  });

  const defaultValues = useMemo(
    () => ({
      // unit_service: currentTable?.unit_service || '',
      // department: currentTable?.department || '',
      unit_service:
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id || departmentData.unit_service._id,
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
      visibility_US_page: currentTable?.visibility_US_page || false,
      visibility_online_appointment: currentTable?.visibility_online_appointment || false,
      password: currentTable?.password || '',
      confirmPassword: currentTable?.confirmPassword || '',
    }),
    [currentTable, departmentData, user?.employee]
  );

  const password = useBoolean();

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

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
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

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
          link: paths.unitservice.departments.employees.root(departmentData._id),
          msg: `creating an employee <strong>${data.em_name_english}</strong> in <strong>${departmentData.name_english}</strong> department`,
          ar_msg: `إضافة موظف  <strong>${data.name_arabic}</strong> إلى قسم <strong>${departmentData.name_arabic}</strong>`,
        });
        reset();
        enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
        router.push(paths.unitservice.departments.employees.root(departmentData._id));
      } else {
        const submit = await axiosInstance.post(endpoints.auth.register, {
          role: 'employee',
          userName: data.name_english,
          ...data,
        });
        socket.emit('updated', {
          data,
          user,
          link: paths.unitservice.departments.employees.root(departmentData._id),
          msg: `updating an employee <strong>${data.name_english}</strong> in <strong>${departmentData.name_english}</strong> department`,
        });
        reset();
        enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
        router.push(
          submit.data?.engagement?._id
            ? paths.unitservice.departments.employees.acl(
                departmentData._id,
                submit.data?.engagement?._id
              )
            : paths.unitservice.departments.employees.root(departmentData._id)
        );
      }
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
              <RHFSelect name="employee_type" label={`${t('employee type')} *`}>
                {employeeTypesData.map((employee_type, idx) => (
                  <MenuItem lang="ar" key={idx} value={employee_type._id}>
                    {curLangAr ? employee_type.name_arabic : employee_type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
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
                  <li lang="ar" {...props} key={idx} value={option}>
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
              <RHFCheckbox
                sx={{ px: 2 }}
                name="visibility_US_page"
                label={<Typography sx={{ fontSize: 12 }}>{t('visible on online page')}</Typography>}
              />
              <RHFCheckbox
                sx={{ px: 2 }}
                name="visibility_online_appointment"
                label={
                  <Typography sx={{ fontSize: 12 }}>
                    {t('visible in online appointments')}
                  </Typography>
                }
              />
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
