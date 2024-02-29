import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ departmentData, currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  // const { currentLang } = useLocales();
  // const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
    details: Yup.string(),
    details_arabic: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      department: departmentData._id,
      unit_service: departmentData.unit_service._id,
      name_english: currentTable?.name_english || '',
      name_arabic: currentTable?.name_arabic || '',
      details: currentTable?.details || '',
      details_arabic: currentTable?.details_arabic || '',
    }),
    [currentTable, departmentData]
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(`${endpoints.tables.activity(currentTable._id)}`, data);
        socket.emit('updated', {
          user,
          link: paths.unitservice.departments.activities.root(departmentData._id),
          msg: `editted an activity <strong>[ ${data.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      } else {
        await axiosInstance.post(`${endpoints.tables.activities}`, data);
        socket.emit('created', {
          user,
          link: paths.unitservice.departments.activities.root(departmentData._id),
          msg: `created an activity <strong>[ ${data.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
        });
      }
      reset();
      router.push(paths.unitservice.departments.activities.root(departmentData._id));
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
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
                name="name_english"
                label={`${t('name english')} *`}
              />
              <RHFTextField
                lang="ar"
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={`${t('name arabic')} *`}
              />
              <RHFTextField
                lang="ar"
                onChange={handleEnglishInputChange}
                name="details"
                label={t('details')}
              />
              <RHFTextField
                lang="ar"
                onChange={handleArabicInputChange}
                name="details_arabic"
                label={t('details arabic')}
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
