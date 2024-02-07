import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetUSDepartments } from 'src/api/tables';

import { socket } from 'src/socket';
import { useLocales, useTranslate } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();
  const { departmentsData } = useGetUSDepartments(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    department: Yup.string().nullable(),
    name_arabic: Yup.string().required('Name is required'),
    name_english: Yup.string().required('Name is required'),
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
      const address = await axios.get('https://geolocation-db.com/json/');
      if (currentTable) {
        await axiosHandler({
          method: 'PATCH',
          path: `${endpoints.tables.activity(currentTable._id)}`,
          data: {
            modifications_nums: (currentTable.modifications_nums || 0) + 1,
            ip_address_user_modification: address.data.IPv4,
            user_modification: user._id,
            ...data,
          },
        });
      } else {
        await axiosHandler({
          method: 'POST',
          path: `${endpoints.tables.activities}`,
          data: {
            ip_address_user_creation: address.data.IPv4,
            user_creation: user._id,
            ...data,
          },
        });
      }
      reset();
      router.push(paths.unitservice.activities.root);
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));

      console.info('DATA', data);
    } catch (error) {
      socket.emit('error', {
        error,
        user,
        link: `/dashboard/unitservices/${data.unit_service}/systemerrors`,
        msg: `creating or updating a new activity ${data.name_english} into ${data.unit_service}`,
      });
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
              <RHFSelect lang="ar" name="department" label={t('department')}>
                {departmentsData.map((department) => (
                  <MenuItem key={department._id} value={department._id}>
                    {curLangAr ? department.name_arabic : department.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
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
              <LoadingButton lang="ar" type="submit" variant="contained" loading={isSubmitting}>
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
