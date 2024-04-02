import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { matchIsValidTel } from 'mui-tel-input';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Alert, Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useNewScreen } from 'src/hooks/use-new-screen';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetCountries,
  useGetSpecialties,
  useGetActiveEmployeeTypes,
  useGetUSActiveDepartments,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFPhoneNumber,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { countriesData } = useGetCountries();
  const { employeeTypesData } = useGetActiveEmployeeTypes();

  const { specialtiesData } = useGetSpecialties();
  const { departmentsData } = useGetUSActiveDepartments(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const { handleAddNew } = useNewScreen();

  const [errorMsg, setErrorMsg] = useState('');

  const NewUserSchema = Yup.object().shape({
    // unit_service: Yup.string().required(t('required field')),
    department: Yup.string().nullable(),
    employee_type: Yup.string().required(t('required field')),
    email: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    name_arabic: Yup.string().required(t('required field')),
    nationality: Yup.string().required(t('required field')),
    address: Yup.string(),
    phone: Yup.string()
      .required(t('required field'))
      .test('is-valid-phone', t('Invalid phone number'), (value) => matchIsValidTel(value)),
    speciality: Yup.string().nullable(),
    gender: Yup.string().required(t('required field')),
    birth_date: Yup.string(),
    visibility_US_page: Yup.bool(),
    visibility_online_appointment: Yup.bool(),
    password: Yup.string().min(8, `${t('must be at least')} 8`),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('Passwords must match'))
      .min(8, `${t('must be at least')} 8`),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        currentTable?.unit_service?._id ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department: currentTable?.department?._id || '',
      employee_type: currentTable?.employee_type?._id || '',
      email: currentTable?.email || '',
      name_english: currentTable?.name_english || '',
      name_arabic: currentTable?.name_arabic || '',
      nationality: currentTable?.nationality || '',
      address: currentTable?.address || '',
      phone: currentTable?.phone || '',
      speciality: currentTable?.speciality || '',
      gender: currentTable?.gender || '',
      visibility_US_page: currentTable?.visibility_US_page || false,
      visibility_online_appointment: currentTable?.visibility_online_appointment || false,
      birth_date: currentTable?.birth_date || '',
      password: currentTable?.password || '',
      confirmPassword: currentTable?.confirmPassword || '',
    }),
    [currentTable, user?.employee]
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
      await axiosInstance.post(endpoints.auth.register, {
        role: 'employee',
        userName: data.name_english,
        ...data,
      });

      socket.emit('created', {
        data,
        user,
        link: paths.unitservice.employees.root,
        msg: `created an employee <strong>${data.name_english || ''}</strong>`,
      });
      reset();
      router.push(paths.unitservice.employees.root);
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
    } catch (error) {
      console.error(error);
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            {!!errorMsg && (
              <Alert sx={{ mb: 3 }} severity="error">
                <div> {errorMsg} </div>
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
                onChange={handleEnglishInputChange}
                name="name_english"
                label={`${t('Full name in English')} *`}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={`${t('Full name in Arabic')} *`}
              />
              <RHFPhoneNumber name="phone" label={t('phone number')} />

              <RHFSelect name="nationality" label={`${t('nationality')} *`}>
                {countriesData.map((nationality, idx) => (
                  <MenuItem lang="ar" key={idx} value={nationality._id}>
                    {curLangAr ? nationality.name_arabic : nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                name="department"
                label={t('department')}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment position="start">
                //       <IconButton onClick={handleAddNew} edge="start">
                //         <Iconify icon="mdi:add-bold" />
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
              >
                {departmentsData.map((department, idx) => (
                  <MenuItem lang="ar" key={idx} value={department._id}>
                    {curLangAr ? department.name_arabic : department.name_english}
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
                  onClick={() => handleAddNew(paths.unitservice.departments.new)}
                >
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    {t('Add new')}
                  </Typography>
                  <Iconify icon="material-symbols:new-window-sharp" />
                </MenuItem>
              </RHFSelect>
              <RHFSelect name="employee_type" label={`${t('employee type')} *`}>
                {employeeTypesData.map((employee_type, idx) => (
                  <MenuItem lang="ar" key={idx} value={employee_type._id}>
                    {curLangAr ? employee_type.name_arabic : employee_type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect name="speciality" label={`${t('specialty')} *`}>
                {specialtiesData.map((speciality, idx) => (
                  <MenuItem lang="ar" key={idx} value={speciality._id}>
                    {curLangAr ? speciality.name_arabic : speciality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
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
              <RHFTextField
                onChange={handleEnglishInputChange}
                name="address"
                label={t('address')}
              />
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
};
