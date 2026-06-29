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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSActiveEmployeeEngs } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { employeesData } = useGetUSActiveEmployeeEngs(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id,
    { select: 'employee', populate: [{ path: 'employee', select: 'name_english name_arabic' }] }
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    employees: Yup.array().min(1, 'Choose at least one option'),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id,
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      employees: currentTable?.employees || [],
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
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key) =>
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
          msg: `updated a work group <strong>${data?.name_english || ''}</strong>`,
        });
        reset();
        router.push(paths.unitservice.tables.workgroups.root);
      } else {
        await axiosInstance.post(endpoints.work_groups.all, data);
        socket.emit('created', {
          user,
          link: paths.unitservice.tables.workgroups.root,
          msg: `created a work group <strong>${data.name_english || ''}</strong>`,
        });
        reset();
        router.push(paths.unitservice.tables.workgroups.root);
      }
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        { variant: 'error' }
      );
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
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
                methods.setValue('employees', newValue, { shouldValidate: true });
              }}
              renderTags={(selected, getTagProps) =>
                selected?.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={curLangAr ? option?.employee.name_arabic : option?.employee?.name_english}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
              {!currentTable ? t('create') : t('save changes')}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
};
