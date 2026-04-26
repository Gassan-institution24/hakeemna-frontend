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

import { useTranslate } from 'src/locales';
import { useGetdiagnosis } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export default function DiagnosisNewEditForm({ currentFavorite }) {
  const router = useRouter();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const { diagnosisData } = useGetdiagnosis();

  const schema = Yup.object().shape({
    name_arabic: Yup.string().required(t('arabic name is required')),
    name_english: Yup.string().required(t('english name is required')),
    diagnoses: Yup.array().min(1, t('diagnosis is required')),
    note: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentFavorite?.favorite_name_ar || '',
      name_english: currentFavorite?.favorite_name || '',
      diagnoses: currentFavorite?.diagnoses || [],
      note: currentFavorite?.note || '',
    }),
    [currentFavorite]
  );

  const methods = useForm({ mode: 'all', resolver: yupResolver(schema), defaultValues });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  const selectedDiagnoses = watch('diagnoses');

  const filteredOptions = useMemo(() => {
    if (!diagnosisData) return [];
    const selectedIds = selectedDiagnoses?.map((d) => d._id) || [];
    return diagnosisData.filter((d) => !selectedIds.includes(d._id));
  }, [diagnosisData, selectedDiagnoses]);

  const handleArabicInput = (e) => {
    if (/^[؀-ۿ0-9\s!@#$%^&*_\-().]*$/.test(e.target.value)) {
      methods.setValue(e.target.name, e.target.value, { shouldValidate: true });
    }
  };

  const handleEnglishInput = (e) => {
    if (/^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/.test(e.target.value)) {
      methods.setValue(e.target.name, e.target.value, { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        favorite_name: data.name_english,
        favorite_name_ar: data.name_arabic,
        diagnoses: data.diagnoses.map((d) => d._id),
        note: data.note,
      };

      if (currentFavorite) {
        await axiosInstance.patch(endpoints.favoriteDiagnosis.one(currentFavorite._id), payload);
      } else {
        await axiosInstance.post(endpoints.favoriteDiagnosis.all, payload);
      }

      enqueueSnackbar(currentFavorite ? t('update success!') : t('create success!'));
      router.push(paths.employee.medicalServices.diagnosis.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error uploading data'), { variant: 'error' });
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
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <RHFTextField onChange={handleEnglishInput} name="name_english" label={t('name english')} />
              <RHFTextField onChange={handleArabicInput} name="name_arabic" label={t('name arabic')} />
              <RHFAutocomplete
                multiple
                name="diagnoses"
                label={t('diagnosis')}
                options={filteredOptions}
                getOptionLabel={(option) => option?.name || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
              <RHFTextField name="note" label={t('note')} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentFavorite ? t('create') : t('save changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DiagnosisNewEditForm.propTypes = {
  currentFavorite: PropTypes.object,
};
