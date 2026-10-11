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
import {
  Divider,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useNewScreen } from 'src/hooks/use-new-screen';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import useUSTypeGuard from 'src/auth/guard/USType-guard';
import useSpecialityGuard from 'src/auth/guard/speciality-guard';
import {
  useGetTaxes,
  useGetAnalyses,
  useGetDeductions,
  useGetUSActiveWorkShifts,
  useGetSpecialityServices,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();

  const { user } = useAuthContext();

  const [showTax, setShowTax] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);

  const myUS =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service;

  const { taxesData } = useGetTaxes();
  const { deductionsData } = useGetDeductions();
  const { workShiftsData } = useGetUSActiveWorkShifts(myUS?._id);

  const { enqueueSnackbar } = useSnackbar();

  const { handleAddNew } = useNewScreen();

  const { isMedLab } = useUSTypeGuard();

  const { analysesData } = useGetAnalyses();

  // Optional link to the superadmin's speciality list: picking one fills (and locks) the names,
  // the clinic only sets its own price. Lists the speciality of the service being edited, else
  // the logged-in employee's own speciality.
  const { specialityId: mySpeciality } = useSpecialityGuard();
  const catalogueSpeciality =
    currentTable?.speciality_service?.speciality?._id ||
    currentTable?.speciality_service?.speciality ||
    mySpeciality;
  const { services: catalogue } = useGetSpecialityServices(catalogueSpeciality || null);
  const [linked, setLinked] = useState(currentTable?.speciality_service || null);
  useEffect(() => {
    setLinked(currentTable?.speciality_service || null);
  }, [currentTable]);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const NewUserSchema = Yup.object().shape({
    name_arabic: Yup.string(),
    name_english: Yup.string().required(t('required field')),
    description_arabic: Yup.string(),
    description_english: Yup.string(),
    work_shift: Yup.string().nullable(),
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
      // An empty value on edit unlinks it; the server keeps the names it already has.
      const payload = { ...data, speciality_service: linked?._id || (currentTable ? '' : undefined) };
      if (currentTable) {
        await axiosInstance.patch(endpoints.service_types.one(currentTable._id), payload);
        router.push(paths.unitservice.tables.services.root);
      } else {
        await axiosInstance.post(endpoints.service_types.all, payload);
      }
      reset();
      setLinked(null);
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message || String(error), { variant: 'error' });
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
            {!isMedLab && (
              <Autocomplete
                sx={{ mb: 3 }}
                options={catalogue}
                value={linked}
                onChange={(e, value) => {
                  setLinked(value);
                  if (value) {
                    methods.setValue('name_english', value.name_english || value.name_arabic || '', {
                      shouldValidate: true,
                    });
                    methods.setValue('name_arabic', value.name_arabic || '');
                  }
                }}
                getOptionLabel={(option) =>
                  [option.code, curLangAr ? option.name_arabic || option.name_english : option.name_english]
                    .filter(Boolean)
                    .join(' · ')
                }
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('From speciality list')}
                    placeholder={t('Search code or service...')}
                    helperText={
                      linked
                        ? t('Name and code come from the speciality list — set your own price below.')
                        : t('Optional — leave empty for a service of your own.')
                    }
                  />
                )}
              />
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
                  disabled={!!linked}
                />
              )}
              {!isMedLab && (
                <RHFTextField
                  onChange={handleArabicInputChange}
                  name="name_arabic"
                  label={t('name arabic')}
                  disabled={!!linked}
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
            <RHFTextField
              multiline
              rows={2}
              onChange={handleEnglishInputChange}
              name="description_english"
              label={t('english description')}
              sx={{ mt: 3 }}
            />
            <RHFTextField
              multiline
              rows={2}
              onChange={handleArabicInputChange}
              name="description_arabic"
              label={t('arabic description')}
              sx={{ mt: 3 }}
            />
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
