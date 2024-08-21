import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

import { useNewScreen } from 'src/hooks/use-new-screen';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSActiveDepartments, useGetUSActiveEmployeeEngs } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  // const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { handleAddNew } = useNewScreen();

  const { employeesData } = useGetUSActiveEmployeeEngs(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id,
    { select: 'employee', populate: [{ path: 'employee', select: 'name_english name_arabic' }] }
  );

  const { departmentsData } = useGetUSActiveDepartments(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    department: Yup.string().nullable(),
    name_arabic: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    employees: Yup.array().min(1, 'Choose at least one option'),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id,
      department: currentTable?.department?._id || null,
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      employees: currentTable?.employees?.map((info, idx) => info.employee) || [],
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
    watch,
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

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(endpoints.work_groups.one(currentTable?._id), data);
        socket.emit('updated', {
          user,
          link: paths.unitservice.tables.workgroups.root,
          msg: `updated a work group <strong>${data.name_english || ''}</strong>`,
        });
      } else {
        await axiosInstance.post(endpoints.work_groups.all, data);
        socket.emit('created', {
          user,
          link: paths.unitservice.tables.workgroups.root,
          msg: `created a work group <strong>${data.name_english || ''}</strong>`,
        });
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
      // router.push(paths.unitservice.tables.workgroups.root);
    } catch (error) {
      // // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      // console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {/* <Grid container spacing={3}> */}
      <Grid xs={12} maxWidth="md">
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <RHFTextField
              onChange={handleEnglishInputChange}
              name="name_english"
              placeholder="Dr.Ahmad WG"
              label={`${t('name english')} *`}
            />
            <RHFTextField
              onChange={handleArabicInputChange}
              name="name_arabic"
              placeholder="فريق عمل الدكتور أحمد"
              label={`${t('name arabic')} *`}
            />
            <RHFSelect name="department" label={t('department')}>
              {departmentsData.map((department, idx) => (
                <MenuItem lang="ar" key={idx} value={department?._id}>
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
            {/* <Stack spacing={1.5}> */}
            {/* <Typography variant="subtitle2">Working schedule</Typography> */}
            <RHFAutocomplete
              name="employees"
              label={`${t('employees')} *`}
              multiple
              disableCloseOnSelect
              options={employeesData.filter(
                (option) =>
                  !values.employees.some(
                    (item) => option?._id === item?._id || option?._id === item
                  )
              )}
              getOptionLabel={(option) => option?._id}
              renderOption={(props, option, idx) => (
                <li lang="ar" {...props} key={idx} value={option?._id}>
                  {curLangAr ? option?.employee.name_arabic : option?.employee?.name_english}
                </li>
              )}
              onChange={(event, newValue) => {
                // setSelectedEmployees(newValue);
                methods.setValue('employees', newValue, { shouldValidate: true });
              }}
              renderTags={(selected, getTagProps) =>
                selected?.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={curLangAr ? option?.employee.name_arabic : option?.employee.name_english}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
            {/* </Stack> */}
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
              {!currentTable ? t('create') : t('save changes')}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
      {/* </Grid> */}
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
  departmentData: PropTypes.object,
};
