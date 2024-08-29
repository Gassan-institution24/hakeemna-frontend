import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Divider, Checkbox, MenuItem, Typography, FormControlLabel } from '@mui/material';

import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

import { useNewScreen } from 'src/hooks/use-new-screen';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import useUSTypeGuard from 'src/auth/guard/USType-guard';
import {
  useGetTaxes,
  useGetAnalyses,
  useGetDeductions,
  useGetUSActiveWorkShifts,
  useGetActiveMeasurmentTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  // const router = useRouter();

  const { user } = useAuthContext();

  const [showTax, setShowTax] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);

  const myUS =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service;

  const { measurmentTypesData } = useGetActiveMeasurmentTypes();
  const { taxesData } = useGetTaxes();
  const { deductionsData } = useGetDeductions();
  const { workShiftsData } = useGetUSActiveWorkShifts(myUS?._id);

  const { enqueueSnackbar } = useSnackbar();

  const { handleAddNew } = useNewScreen();

  const { isMedLab } = useUSTypeGuard();

  const { analysesData } = useGetAnalyses();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string(),
    name_english: Yup.string().required(t('required field')),
    description_arabic: Yup.string(),
    description_english: Yup.string(),
    work_shift: Yup.string().nullable(),
    Measurement_type: Yup.string().required(t('required field')),
    Price_per_unit: Yup.string().required(t('required field')),
    place_of_service: Yup.string(),
    tax: Yup.string().nullable(),
    deduction: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentTable?.name_arabic || '',
      name_english: currentTable?.name_english || '',
      description_arabic: currentTable?.description_arabic || '',
      description_english: currentTable?.description_english || '',
      unit_service: myUS?._id,
      work_shift: currentTable?.work_shift?._id || null,
      Measurement_type: currentTable?.Measurement_type?._id || null,
      Price_per_unit: currentTable?.Price_per_unit || '',
      tax: currentTable?.tax || null,
      deduction: currentTable?.deduction || null,
    }),
    [currentTable, myUS]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/; // Range for Arabic characters

    if (arabicRegex.test(event?.target?.value)) {
      methods.setValue(event?.target?.name, event?.target?.value, { shouldValidate: true });
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event?.target?.value)) {
      methods.setValue(event?.target?.name, event?.target?.value, { shouldValidate: true });
    }
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // useEffect(() => {
  //   if (Object.keys(errors).length) {
  //     Object.keys(errors).forEach((key, idx) =>
  //       enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
  //     );
  //   }
  // }, [errors, enqueueSnackbar]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(endpoints.service_types.one(currentTable._id), data);
      } else {
        await axiosInstance.post(endpoints.service_types.all, data);
      }
      reset();
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
      // router.push(paths.unitservice.tables.services.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
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
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {isMedLab && (
                <RHFAutocomplete
                  freeSolo
                  name="name_english"
                  label="name english"
                  // onChange={handleChange}
                  // onInputChange={handleEnglishInputChange}
                  placeholder="Choose a name english"
                  options={analysesData.map((option) => option.name_english)}
                  getOptionLabel={(option) => option}
                />
              )}
              {/* {isMedLab && (
                <RHFAutocomplete
                  freeSolo
                  name="name_arabic"
                  label="name arabic"
                  // onChange={handleChange}
                  // onInputChange={handleArabicInputChange}
                  placeholder="Choose a name arabic"
                  options={analysesData.map((option) => option.name_arabic)}
                  getOptionLabel={(option) => option}
                />
              )} */}
              {!isMedLab && (
                <RHFTextField
                  onChange={handleEnglishInputChange}
                  name="name_english"
                  label={t('name english')}
                />
              )}
              {!isMedLab && (
                <RHFTextField
                  onChange={handleArabicInputChange}
                  name="name_arabic"
                  label={t('name arabic')}
                />
              )}

              <RHFSelect name="work_shift" label={t('work shift')}>
                {workShiftsData.map((work_shift, idx) => (
                  <MenuItem lang="ar" key={idx} value={work_shift._id}>
                    {curLangAr ? work_shift.name_arabic : work_shift.name_english}
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
                  onClick={() => handleAddNew(paths.unitservice.tables.workshifts.new)}
                >
                  <Typography variant="body2" sx={{ color: 'info.main' }}>
                    {t('Add new')}
                  </Typography>
                  <Iconify icon="material-symbols:new-window-sharp" />
                </MenuItem>
              </RHFSelect>
              <RHFSelect name="Measurement_type" label={t('measurement type')}>
                {measurmentTypesData.map((type, idx) => (
                  <MenuItem lang="ar" key={idx} value={type._id}>
                    {curLangAr ? type.name_arabic : type.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField type="number" name="Price_per_unit" label={t('price per unit')} />
              <RHFSelect name="place_of_service" label={t('place of service')}>
                <MenuItem lang="ar" value="clinic">
                  {t('clinic')}
                </MenuItem>
                <MenuItem lang="ar" value="hospital">
                  {t('hospital')}
                </MenuItem>
                <MenuItem lang="ar" value="online">
                  {t('online')}
                </MenuItem>
              </RHFSelect>
              <RHFTextField
                multiline
                rows={2}
                onChange={handleEnglishInputChange}
                name="description_english"
                label={t('english description')}
              />
              <RHFTextField
                multiline
                rows={2}
                onChange={handleArabicInputChange}
                name="description_arabic"
                label={t('arabic description')}
              />
              {myUS?.has_tax && (
                <FormControlLabel
                  sx={{ ml: 2 }}
                  control={<Checkbox onChange={() => setShowTax((prev) => !prev)} />}
                  label={t('tax')}
                />
              )}
              {myUS?.has_deduction && (
                <FormControlLabel
                  sx={{ ml: 2 }}
                  control={<Checkbox onChange={() => setShowDeduction((prev) => !prev)} />}
                  label={t('deduction')}
                />
              )}
              {showTax && (
                <RHFSelect name="tax" label={t('tax')}>
                  {taxesData.map((one, idx) => (
                    <MenuItem lang="ar" key={idx} value={one._id}>
                      {curLangAr ? one.name_arabic : one.name_english} {one.percentage}%
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}

              {showDeduction && (
                <RHFSelect name="deduction" label={t('deduction')}>
                  {deductionsData.map((one, idx) => (
                    <MenuItem lang="ar" key={idx} value={one._id}>
                      {curLangAr ? one.name_arabic : one.name_english} {one.percentage}%
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
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
