import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSActiveWorkGroups } from 'src/api/work_groups';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id;

  const { workGroupsData } = useGetUSActiveWorkGroups(unitServiceId);

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string().required(t('required field')),
    name_english: Yup.string().required(t('required field')),
    general_info: Yup.string(),
    general_info_arabic: Yup.string(),
    work_group: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      general_info: currentTable?.general_info || '',
      general_info_arabic: currentTable?.general_info_arabic || '',
      work_group: currentTable?.work_group?._id || '',
    }),
    [currentTable]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const handleArabicInputChange = (event) => {
    const arabicRegex = /^[؀-ۿ0-9\s!@#$%^&*_\-().]*$/;
    if (arabicRegex.test(event.target.value)) {
      methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;
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
      Object.keys(errors).forEach((key) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(endpoints.departments.one(currentTable._id), {
          unit_service: unitServiceId,
          name_arabic: data.name_arabic,
          name_english: data.name_english,
          general_info: data.general_info,
          general_info_arabic: data.general_info_arabic,
          work_group: data.work_group || null,
        });
        socket.emit('updated', {
          data,
          user,
          link: paths.unitservice.departments.info(currentTable._id),
          msg: `updating department <strong>${data.name_english || ''}</strong>`,
        });
        router.push(paths.unitservice.departments.root);
      } else {
        const response = await axiosInstance.post(endpoints.departments.all, {
          name_arabic: data.name_arabic,
          name_english: data.name_english,
          general_info: data.general_info,
          general_info_arabic: data.general_info_arabic,
          unit_service: unitServiceId,
          work_group: data.work_group || null,
        });
        const newDeptId = response.data?._id;
        socket.emit('created', {
          data,
          user,
          link: paths.unitservice.departments.info(newDeptId),
          msg: `creating department <strong>${data.name_english || ''}</strong>`,
          ar_msg: `إنشاء قسم <strong>${data.name_arabic || ''}</strong>`,
        });
        router.push(paths.unitservice.departments.root);
      }
      reset();
      enqueueSnackbar(currentTable ? t('update success!') : t('create success!'));
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        { variant: 'error' }
      );
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
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
              <RHFTextField
                onChange={handleEnglishInputChange}
                name="general_info"
                label={t('general info')}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="general_info_arabic"
                label={t('general info in arabic')}
              />

              <RHFSelect name="work_group" label={t('work group')}>
                <MenuItem value="">&nbsp;</MenuItem>
                {workGroupsData.map((wg) => (
                  <MenuItem key={wg._id} value={wg._id}>
                    {curLangAr ? wg.name_arabic : wg.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
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
