import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetMedicines } from 'src/api';
import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function MedicationNewEditForm({ currentFavorite }) {
  const router = useRouter();
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const MedicationSchema = Yup.object().shape({
    name_arabic: Yup.string().required(t('arabic name is required')),
    name_english: Yup.string().required(t('english name is required')),

    medicines: Yup.array()
      .of(
        Yup.object().shape({
          medicine: Yup.object().nullable().required(t('medicine selection is required')),
          Frequency_per_day: Yup.number(),
          chronic: Yup.boolean(),
          Doctor_Comments: Yup.string(),
        })
      )
      .min(1, t('at least one medicine must be added')),
  });

  const { medicinesData } = useGetMedicines();

  const defaultValues = useMemo(
    () => ({
      name_arabic: currentFavorite?.favorite_name_ar || '',
      name_english: currentFavorite?.favorite_name || '',
      medicines:
        currentFavorite?.medicines?.length > 0
          ? currentFavorite.medicines
          : [
              {
                medicine: null,
                Frequency_per_day: '',
                chronic: false,
                Doctor_Comments: '',
              },
            ],
    }),
    [currentFavorite]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(MedicationSchema),
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
  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines',
  });
  const selectedMedicines = methods.watch('medicines');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        favorite_name: data.name_english,
        favorite_name_ar: data.name_arabic,
        medicines: data.medicines.map((m) => ({
          medicine: m.medicine?._id,
          Frequency_per_day: Number(m.Frequency_per_day),
          chronic: m.chronic || false,
          Doctor_Comments: m.Doctor_Comments,
        })),
      };

      if (currentFavorite) {
        await axiosInstance.patch(endpoints.favoriteMedication.one(currentFavorite._id), payload);
      } else {
        await axiosInstance.post(endpoints.favoriteMedication.all, payload);
      }

      enqueueSnackbar(currentFavorite ? t('update success!') : t('create success!'));
      router.push(paths.employee.medicalServices.medication.root);
    } catch (error) {
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
              <Stack spacing={2} sx={{ gridColumn: '1 / -1' }}>
                {fields.map((field, index) => (
                  <Grid container spacing={2} key={field.id}>
                    <Grid xs={12} md={3}>
                      <RHFAutocomplete
                        name={`medicines.${index}.medicine`}
                        label={t('medicine')}
                        options={(medicinesData || []).filter((option) => {
                          const selectedIds =
                            selectedMedicines?.map((m) => m?.medicine?._id).filter(Boolean) || [];

                          return (
                            !selectedIds.includes(option._id) ||
                            option._id === selectedMedicines[index]?.medicine?._id
                          );
                        })}
                        getOptionLabel={(option) => option?.trade_name || ''}
                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                      />
                    </Grid>
                    <Grid xs={12} md={2}>
                      <RHFTextField
                        name={`medicines.${index}.Frequency_per_day`}
                        label={t('frequency')}
                        type="number"
                      />
                    </Grid>
                    <Grid xs={12} md={2}>
                      <RHFCheckbox
                        name={`medicines.${index}.chronic`}
                        label={t('chronic')}
                        onChange={(e) => {
                          methods.setValue(`medicines.${index}.chronic`, e.target.checked, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <RHFTextField
                        name={`medicines.${index}.Doctor_Comments`}
                        label={t('doctor comments')}
                      />
                    </Grid>

                    <Grid xs={12} md={1}>
                      <LoadingButton color="error" onClick={() => remove(index)}>
                        ✕
                      </LoadingButton>
                    </Grid>
                  </Grid>
                ))}

                <LoadingButton
                  variant="outlined"
                  onClick={() =>
                    append({
                      medicine: null,
                      Frequency_per_day: '',
                      chronic: false,
                      Doctor_Comments: '',
                    })
                  }
                >
                  {t('add medicine')}
                </LoadingButton>
              </Stack>
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

MedicationNewEditForm.propTypes = {
  currentFavorite: PropTypes.object,
};
