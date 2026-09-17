import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { matchIsValidTel } from 'mui-tel-input';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useNewScreen } from 'src/hooks/use-new-screen';

import { isDemoUser } from 'src/utils/demo';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { buildEmployeeEmail, getSelectedUnitService } from 'src/utils/employee-email';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import useOwnerGuard from 'src/auth/guard/owner-guard';
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
  RHFAutocomplete,
  RHFPhoneNumberCustom,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();
  // Speciality decides what the system lets a doctor do, so it belongs to
  // whoever runs the clinic. Other staff see it, but cannot change it.
  const { isOwner } = useOwnerGuard();

  const { countriesData } = useGetCountries({ select: 'name_english name_arabic' });
  const { employeeTypesData } = useGetActiveEmployeeTypes();

  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });
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
    email: Yup.string()
      .required(t('required field'))
      .test(
        'no-capital-letters',
        t('Email must not contain capital letters'),
        (value) => !value || !/[A-Z]/.test(value)
      )
      .test(
        'valid-email',
        t('Invalid email address'),
        (value) =>
          !value ||
          (/^[A-Za-z0-9]/.test(value) &&
            !/\s/.test(value) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      ),
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
    identification_num: Yup.string(),
    visibility_US_page: Yup.bool(),
    visibility_online_appointment: Yup.bool(),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        currentTable?.unit_service?._id ||
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ._id,
      department: currentTable?.department?._id || null,
      employee_type: currentTable?.employee_type?._id || '',
      email: currentTable?.email || '',
      name_english: currentTable?.name_english || '',
      name_arabic: currentTable?.name_arabic || '',
      identification_num: currentTable?.identification_num || '',
      nationality: currentTable?.nationality || '',
      address: currentTable?.address || '',
      phone: currentTable?.phone || '',
      speciality: currentTable?.speciality || null,
      gender: currentTable?.gender || '',
      // An employee belongs to the unit service that created them and to nothing else, so a
      // new one is always strict. Editing keeps whatever the existing employee already has.
      strict_employee: currentTable ? currentTable?.strict_employee || false : true,
      visibility_US_page: currentTable?.visibility_US_page || false,
      visibility_online_appointment: currentTable?.visibility_online_appointment || false,
      birth_date: currentTable?.birth_date || '',
    }),
    [currentTable, user?.employee]
  );

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
    watch,
    setValue,
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

  // ── Generated address ──────────────────────────────────────────────────────
  // A new employee's address is not typed, it is derived from their English name and the
  // clinic's name: employeename@unitservicename.com (see src/utils/employee-email.js). The
  // server rebuilds it from the same two names and rejects one that is already taken, so what
  // happens here is a preview — it just lets the clinic see the address, and find out about a
  // clash, before losing the rest of the form.
  //
  // Editing an existing employee leaves the stored address exactly as it is.
  const isCreating = !currentTable;
  const nameEnglish = watch('name_english');
  const unitServiceName = getSelectedUnitService(user)?.name_english;
  const generatedEmail = isCreating ? buildEmployeeEmail(nameEnglish, unitServiceName) : '';

  // available: true / false once answered, null while unknown (empty name, or the check failed).
  const [emailStatus, setEmailStatus] = useState({ checking: false, available: null });

  useEffect(() => {
    if (!isCreating) return;
    setValue('email', generatedEmail, { shouldValidate: Boolean(generatedEmail) });
  }, [isCreating, generatedEmail, setValue]);

  useEffect(() => {
    if (!isCreating || !generatedEmail) {
      setEmailStatus({ checking: false, available: null });
      return undefined;
    }

    setEmailStatus({ checking: true, available: null });

    // Debounced — the name field fires on every keystroke.
    const timer = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get(endpoints.employees.emailCheck(nameEnglish));
        setEmailStatus({ checking: false, available: Boolean(data?.available) });
      } catch (error) {
        // Advisory only: signup re-checks and is what actually rejects a taken address.
        setEmailStatus({ checking: false, available: null });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isCreating, generatedEmail, nameEnglish]);

  const emailHelperText = (() => {
    if (!isCreating) return undefined;
    if (generatedEmail && emailStatus.checking) return t('checking availability...');
    if (generatedEmail && emailStatus.available === false)
      return t('this email already exists, please change the employee name');
    return undefined;
  })();

  const onSubmit = handleSubmit(async (data) => {
    // This form posts to /signup, which only ever creates. It has never been able to save an
    // edit — the address already existed, so the create failed and the screen simply showed an
    // error. Now that the server derives the address from the employee's name instead of using
    // the one on the record, that create could *succeed* for an existing employee and duplicate
    // them, so the edit case is stopped here explicitly.
    // Editing an employee still needs its own update path; this only guarantees that pressing
    // "save changes" cannot write anything.
    if (currentTable) {
      enqueueSnackbar(t('editing an employee is not available on this screen'), {
        variant: 'warning',
      });
      return;
    }

    // Stop here rather than sending a request the server is certain to refuse.
    if (isCreating && emailStatus.available === false) {
      enqueueSnackbar(t('this email already exists, please change the employee name'), {
        variant: 'error',
      });
      return;
    }

    try {
      const submit = await axiosInstance.post(endpoints.auth.register, {
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
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const employees_number =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
      ?.employees_number || 10;

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            {!!errorMsg && (
              <Alert sx={{ mb: 3 }} severity="error">
                {/* eslint-disable-next-line react/no-danger */}
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
                onChange={handleEnglishInputChange}
                name="name_english"
                label={t('Full name in English')}
                helperText={t('should include title like : doctor, specialist,...')}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={t('Full name in Arabic')}
                helperText={t('should include title like : doctor, specialist,...')}
              />
              <RHFTextField name="identification_num" label={t('National ID number')} />
              <RHFPhoneNumberCustom name="phone" label={t('phone number')} />

              <RHFSelect name="nationality" label={t('nationality')}>
                {countriesData.map((nationality, idx) => (
                  <MenuItem lang="ar" key={idx} value={nationality._id}>
                    {curLangAr ? nationality.name_arabic : nationality.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              {employees_number > 3 && (
                <RHFSelect name="department" label={t('department')}>
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
              )}
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
                  <li lang="ar" {...props} key={idx} value={option}>
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
                label={t('speciality')}
                disabled={!isOwner}
                readOnly={!isOwner}
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
                helperText={
                  isOwner ? undefined : t('Only the clinic owner can change the speciality')
                }
              />
              <RHFSelect name="gender" label={t('gender')}>
                <MenuItem lang="ar" value="male">
                  {t('male')}
                </MenuItem>
                <MenuItem lang="ar" value="female">
                  {t('female')}
                </MenuItem>
              </RHFSelect>
              {/* Hidden for demo clinics — their staff never appear in the public clinic page
                  or the online-appointment search, so these switches would be dead controls.
                  The server pins both flags off regardless of what the client sends. */}
              {!isDemoUser(user) && (
                <>
                  <RHFCheckbox
                    sx={{ px: 2 }}
                    name="visibility_US_page"
                    onChange={() => setValue('visibility_US_page', !watch('visibility_US_page'))}
                    label={
                      <Typography sx={{ fontSize: 12 }}>{t('visible on online page')}</Typography>
                    }
                  />
                  <RHFCheckbox
                    sx={{ px: 2 }}
                    name="visibility_online_appointment"
                    onChange={() =>
                      setValue(
                        'visibility_online_appointment',
                        !watch('visibility_online_appointment')
                      )
                    }
                    label={
                      <Typography sx={{ fontSize: 12 }}>
                        {t('visible in online appointments')}
                      </Typography>
                    }
                  />
                </>
              )}
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
                // onChange={handleEnglishInputChange}
                name="address"
                label={t('address')}
              />
              {/* Read-only on create: the address is derived from the name above. */}
              <RHFTextField
                name="email"
                label={t('email')}
                helperText={emailHelperText}
                // Disabled, not merely read-only: the address is generated from the employee
                // name and the clinic name and the server rebuilds it on save, so typing here
                // could never have any effect.
                disabled={isCreating}
                // Spread conditionally: RHFTextField applies `other` after its own `error`, so
                // passing `error={false}` would clear a real validation error on the field.
                {...(isCreating && emailStatus.available === false ? { error: true } : {})}
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
