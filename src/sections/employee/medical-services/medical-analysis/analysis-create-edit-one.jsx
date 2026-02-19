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

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicalAnalysis } from 'src/api/medicalAnalysis';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function MedicalAnalysisNewEditForm({ currentFavorite }) {
  const router = useRouter();
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const NewMedicalAnalysis = Yup.object().shape({
    name_arabic: Yup.string().required(t('arabic name is required')),
    name_english: Yup.string().required(t('english name is required')),
    medical_analyses: Yup.array().min(1, t('medical analyses is required')),
    note: Yup.string(),
  });

  const { medicalAnalysisData } = useGetMedicalAnalysis();
  const defaultValues = useMemo(
    () => ({
      name_arabic: currentFavorite?.favorite_name_ar || '',
      name_english: currentFavorite?.favorite_name || '',
      medical_analyses: currentFavorite?.medical_analyses || [],
      note: currentFavorite?.note || '',
    }),
    [currentFavorite]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewMedicalAnalysis),
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        favorite_name: data.name_english,
        favorite_name_ar: data.name_arabic,
        medical_analyses: data.medical_analyses.map((a) => a._id),
        note: data.note,
      };

      if (currentFavorite) {
        await axiosInstance.patch(
          endpoints.favoriteMedicalAnalysis.one(currentFavorite._id),
          payload
        );
      } else {
        await axiosInstance.post(endpoints.favoriteMedicalAnalysis.all, payload);
      }

      enqueueSnackbar(currentFavorite ? t('update success!') : t('create success!'));
      router.push(paths.employee.medicalServices.medicalAnalysis.root);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  const selectedAnalyses = methods.watch('medical_analyses');

  const filteredOptions = useMemo(() => {
    if (!medicalAnalysisData) return [];

    const selectedIds = selectedAnalyses?.map((a) => a._id) || [];

    return medicalAnalysisData.filter((analysis) => !selectedIds.includes(analysis._id));
  }, [medicalAnalysisData, selectedAnalyses]);

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
                label={t('name english')}
              />
              <RHFTextField
                onChange={handleArabicInputChange}
                name="name_arabic"
                label={t('name arabic')}
              />
              <RHFAutocomplete
                multiple
                name="medical_analyses"
                label={t('medical analyses')}
                options={filteredOptions}
                getOptionLabel={(option) =>
                  curLangAr ? option?.name_arabic || '' : option?.name_english || ''
                }
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />

              <RHFTextField name="note" label={t('note')} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentFavorite ? t('create') : t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

MedicalAnalysisNewEditForm.propTypes = {
  currentFavorite: PropTypes.object,
};
