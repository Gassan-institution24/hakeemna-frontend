import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useNewScreen } from 'src/hooks/use-new-screen';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSActiveDepartments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

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
  const { departmentsData } = useGetUSActiveDepartments(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const { handleAddNew } = useNewScreen();

  const NewUserSchema = Yup.object().shape({
    department: Yup.string().nullable(),
    name_arabic: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    details: Yup.string(),
    details_arabic: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        currentTable?.unit_service._id ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department: currentTable?.department._id || null,
      name_english: currentTable?.name_english || '',
      name_arabic: currentTable?.name_arabic || '',
      details: currentTable?.details || '',
      details_arabic: currentTable?.details_arabic || '',
    }),
    [currentTable, user?.employee]
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(`${endpoints.activities.one(currentTable._id)}`, data);
        socket.emit('updated', {
          data,
          user,
          link: paths.unitservice.tables.activities.root,
          msg: `updated an activity <strong>${data.name_english || ''}</strong>`,
        });
      } else {
        await axiosInstance.post(`${endpoints.activities.all}`, data);
        socket.emit('created', {
          data,
          user,
          link: paths.unitservice.tables.activities.root,
          msg: `created an activity <strong>${data.name_english || ''}</strong>`,
          ar_msg: `إنشاء نشاط  <strong>${data.name_arabic || ''}</strong>`,
        });
      }
      reset();
      router.push(paths.unitservice.tables.activities.root);
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
  });

  /* eslint-disable */
  useEffect(() => {
    reset({
      unit_service:
        currentTable?.unit_service._id ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department: currentTable?.department._id || null,
      name_english: currentTable?.name_english || '',
      name_arabic: currentTable?.name_arabic || '',
      details: currentTable?.details || '',
      details_arabic: currentTable?.details_arabic || '',
    });
  }, [currentTable]);
  /* eslint-enable */

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
                label={`${t('name english')} *`}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={`${t('name arabic')} *`}
              />
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
              <RHFTextField
                onChange={handleEnglishInputChange}
                name="details"
                label={t('details')}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="details_arabic"
                label={t('details arabic')}
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
